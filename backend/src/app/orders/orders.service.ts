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
      const orderType = dto.type ?? TransactionType.EXPENSE;

      const createData: any = {
        branchId: dto.branchId,
        customerId: dto.customerId,
        type: orderType,
        status: dto.status ?? OrderStatus.NEW,
        total: dto.total ?? totalFromItems,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      };

      const order = await tx.order.create({
        data: createData as any,
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

      // adjust stock according to order type: INCOME increases stock, EXPENSE decreases
      await Promise.all(
        dto.items.map((item) => {
          const quantityDelta = orderType === TransactionType.INCOME ? item.quantity : -item.quantity;
          return this.adjustStock(tx, dto.branchId, item.productId, quantityDelta, orderType, {
            createTransaction: true,
            orderId: order.id,
            price: item.price,
            totalPrice: item.price * item.quantity,
            reason: `Order ${order.id}`,
          });
        }),
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
        include: ({
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
          stockTransactions: true,
        } as any),
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
      include: ({
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
        stockTransactions: true,
      } as any),
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
        // remove previous stock transactions linked to this order (we will recreate them to mirror the order)
        await tx.stockTransaction.deleteMany({ where: { orderId: id } } as any);

        // revert previous stock deltas without creating transactions
        const prevType = (existingOrder as any).type ?? TransactionType.EXPENSE;
        await Promise.all(
          existingOrder.items.map((item) => {
            const revertDelta = prevType === TransactionType.INCOME ? -item.quantity : item.quantity;
            return this.adjustStock(tx, existingOrder.branchId, item.productId, revertDelta, prevType, { createTransaction: false });
          }),
        );

        // replace order items
        await tx.orderItem.deleteMany({ where: { orderId: id } });
        await tx.orderItem.createMany({
          data: dto.items.map((item) => ({
            orderId: id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        });

        const newTotal = dto.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        dto.total = dto.total ?? newTotal;

        // apply new items and create new stock transactions linked to this order
        const newType = dto.type ?? prevType ?? TransactionType.EXPENSE;
        await Promise.all(
          dto.items.map((item) => {
            const delta = newType === TransactionType.INCOME ? item.quantity : -item.quantity;
            return this.adjustStock(tx, existingOrder.branchId, item.productId, delta, newType, {
              createTransaction: true,
              orderId: id,
              price: item.price,
              totalPrice: item.price * item.quantity,
              reason: `Order ${id}`,
            });
          }),
        );
      }

      const updateData: any = {
        status: dto.status ?? existingOrder.status,
        total: dto.total ?? existingOrder.total,
        type: dto.type ?? (existingOrder as any).type ?? TransactionType.EXPENSE,
      };

      const updatedOrder = await tx.order.update({
        where: { id },
        data: updateData as any,
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

      // remove stock transactions linked to this order
      await tx.stockTransaction.deleteMany({ where: { orderId: id } } as any);

      // revert stock according to existing order type without creating transactions
      const prevType = (existingOrder as any).type ?? TransactionType.EXPENSE;
      await Promise.all(
        existingOrder.items.map((item) => {
          const delta = prevType === TransactionType.INCOME ? -item.quantity : item.quantity;
          return this.adjustStock(tx, existingOrder.branchId, item.productId, delta, prevType, { createTransaction: false });
        }),
      );

      await tx.orderItem.deleteMany({ where: { orderId: id } });
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
    options?: {
      createTransaction?: boolean;
      orderId?: string;
      price?: number;
      totalPrice?: number;
      reason?: string;
      document?: string;
      supplier?: string;
      batchNumber?: string;
      expiryDate?: Date;
      employeeId?: string;
      notes?: string;
    },
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

    if (options?.createTransaction !== false) {
      await tx.stockTransaction.create({
        data: ({
          stockId: stock.id,
          type,
          quantity: Math.abs(quantityDelta),
          date: new Date(),
          orderId: options?.orderId,
          price: options?.price,
          totalPrice: options?.totalPrice,
          reason: options?.reason,
          document: options?.document,
          supplier: options?.supplier,
          batchNumber: options?.batchNumber,
          expiryDate: options?.expiryDate,
          employeeId: options?.employeeId,
          notes: options?.notes,
        } as any),
      });
    }

    return stock;
  }
}
