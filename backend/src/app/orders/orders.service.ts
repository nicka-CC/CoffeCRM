import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, OrderStatus, TransactionType } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from '../../dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const totalFromItems = dto.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          branchId: dto.branchId,
          customerId: dto.customerId,
          status: dto.status ?? OrderStatus.NEW,
          total: dto.total ?? totalFromItems,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          branch: true,
          customer: {
            include: {
              user: true,
            },
          },
        },
      });

      await Promise.all(
        dto.items.map((item) =>
          this.adjustStock(tx, dto.branchId, item.productId, -item.quantity, TransactionType.EXPENSE),
        ),
      );

      return order;
    });
  }

  async findAll(query: any) {
    const where: Prisma.OrderWhereInput = {};

    if (query.status) {
      where.status = query.status as OrderStatus;
    }

    if (query.branchId) {
      where.branchId = query.branchId;
    }

    if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.fromDate || query.toDate) {
      where.createdAt = where.createdAt ?? {};
      if (query.fromDate) {
        (where.createdAt as Prisma.DateTimeFilter).gte = new Date(query.fromDate);
      }
      if (query.toDate) {
        (where.createdAt as Prisma.DateTimeFilter).lte = new Date(query.toDate);
      }
    }

    if (query.search) {
      const searchTerm = query.search as string;
      where.OR = [
        {
          customer: {
            user: {
              fullName: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          branch: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // support page/limit or take/skip
    const page = query.page ? Number(query.page) : undefined;
    const limit = query.limit ? Number(query.limit) : undefined;
    let take = query.take ? Number(query.take) : undefined;
    let skip = query.skip ? Number(query.skip) : undefined;

    if (page !== undefined && limit !== undefined) {
      take = limit;
      skip = (page - 1) * limit;
    }

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: {
          branch: true,
          customer: {
            include: {
              user: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take,
        skip,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      total,
      page: page ?? (skip !== undefined && take ? Math.floor(skip / take) + 1 : 1),
      limit: take,
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        branch: true,
        customer: {
          include: {
            user: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Заказ с идентификатором ${id} не найден`);
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (!existingOrder) {
        throw new NotFoundException(`Заказ с идентификатором ${id} не найден`);
      }

      if (dto.items) {
        await Promise.all(
          existingOrder.items.map((item) =>
            this.adjustStock(tx, existingOrder.branchId, item.productId, item.quantity, TransactionType.INCOME),
          ),
        );

        await tx.orderItem.deleteMany({ where: { orderId: id } });
        await tx.orderItem.createMany({
          data: dto.items.map((item) => ({
            orderId: id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        });

        const newTotal = dto.items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );
        dto.total = dto.total ?? newTotal;

        await Promise.all(
          dto.items.map((item) =>
            this.adjustStock(tx, existingOrder.branchId, item.productId, -item.quantity, TransactionType.EXPENSE),
          ),
        );
      }

      const updatedOrder = await tx.order.update({
        where: { id },
        data: {
          status: dto.status ?? existingOrder.status,
          total: dto.total ?? existingOrder.total,
        },
        include: {
          branch: true,
          customer: {
            include: {
              user: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return updatedOrder;
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id },
        include: {
          items: true,
        },
      });

      if (!existingOrder) {
        throw new NotFoundException(`Заказ с идентификатором ${id} не найден`);
      }

      await tx.orderItem.deleteMany({ where: { orderId: id } });

      await Promise.all(
        existingOrder.items.map((item) =>
          this.adjustStock(tx, existingOrder.branchId, item.productId, item.quantity, TransactionType.INCOME),
        ),
      );

      await tx.order.delete({ where: { id } });

      return { success: true };
    });
  }

  private async adjustStock(
    tx: Prisma.TransactionClient,
    branchId: string,
    productId: string,
    quantityDelta: number,
    type: TransactionType,
  ) {
    let stock = await tx.stock.findFirst({
      where: {
        branchId,
        productId,
      },
    });

    if (!stock) {
      stock = await tx.stock.create({
        data: {
          branchId,
          productId,
          quantity: quantityDelta,
        },
      });
    } else {
      stock = await tx.stock.update({
        where: { id: stock.id },
        data: {
          quantity: {
            increment: quantityDelta,
          },
        },
      });
    }

    await tx.stockTransaction.create({
      data: {
        stockId: stock.id,
        type,
        quantity: Math.abs(quantityDelta),
        date: new Date(),
      },
    });

    return stock;
  }
}
