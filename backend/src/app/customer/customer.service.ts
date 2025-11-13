import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto, AddBonusDto, SpendBonusDto } from '../../dto/customer.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    // Генерируем реферальный код
    const referralCode = this.generateReferralCode();

    const data: Prisma.CustomerCreateInput = {
      user: { connect: { id: dto.userId } },
      bonus: dto.bonus ?? 0,
      discountPercent: dto.discountPercent ?? 0,
      vipStatus: dto.vipStatus ?? false,
      notes: dto.notes,
      tags: dto.tags ?? [],
      source: dto.source,
      birthday: dto.birthday,
      preferences: dto.preferences,
      referralCode,
    };

    return this.prisma.customer.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            icon: true,
          },
        },
      },
    });
  }

  async findAll(query: any) {
    const take = query.limit ? Number(query.limit) : query.take ? Number(query.take) : undefined;
    const skip = query.page && query.limit ? (Number(query.page) - 1) * Number(query.limit) : query.skip ? Number(query.skip) : undefined;
    const search = query.search as string | undefined;
    const vipStatus = query.vipStatus === 'true' ? true : query.vipStatus === 'false' ? false : undefined;
    const minSpent = query.minSpent ? Number(query.minSpent) : undefined;
    const tags = query.tags ? (Array.isArray(query.tags) ? query.tags : [query.tags]) : undefined;

    const where: Prisma.CustomerWhereInput = {};

    if (search) {
      where.user = {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (vipStatus !== undefined) {
      where.vipStatus = vipStatus;
    }

    if (minSpent !== undefined) {
      where.totalSpent = { gte: minSpent };
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    const [customers, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              icon: true,
              role: true,
            },
          },
          orders: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              total: true,
              createdAt: true,
              status: true,
            },
          },
        },
        orderBy: {
          totalSpent: 'desc',
        },
        take,
        skip,
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      total,
      page: skip ? Math.floor(skip / (take || 10)) + 1 : 1,
      limit: take || 10,
    };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            icon: true,
            role: true,
            createdAt: true,
          },
        },
        orders: {
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                    icon: true,
                  },
                },
              },
            },
            branch: {
              select: {
                id: true,
                name: true,
                city: true,
                address: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        bookings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            branch: {
              select: {
                id: true,
                name: true,
                city: true,
              },
            },
          },
        },
        bonusHistory: {
          take: 20,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Клиент с идентификатором ${id} не найден`);
    }

    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Клиент с идентификатором ${id} не найден`);
    }

    const data: Prisma.CustomerUpdateInput = {};
    if (dto.bonus !== undefined) data.bonus = dto.bonus;
    if (dto.discountPercent !== undefined) data.discountPercent = dto.discountPercent;
    if (dto.vipStatus !== undefined) data.vipStatus = dto.vipStatus;
    if (dto.favoriteProduct !== undefined) {
      data.favoriteProduct = dto.favoriteProduct || null;
    }
    if (dto.favoriteBranch !== undefined) {
      data.favoriteBranch = dto.favoriteBranch || null;
    }
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.tags !== undefined) data.tags = dto.tags;
    if (dto.birthday !== undefined) data.birthday = dto.birthday;
    if (dto.preferences !== undefined) data.preferences = dto.preferences;

    return this.prisma.customer.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            icon: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Клиент с идентификатором ${id} не найден`);
    }

    return this.prisma.customer.delete({ where: { id } });
  }

  async getOrderHistory(id: string, query?: { limit?: number; offset?: number }) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Клиент с идентификатором ${id} не найден`);
    }

    const limit = query?.limit ? Number(query.limit) : 50;
    const offset = query?.offset ? Number(query.offset) : 0;

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: { customerId: id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  icon: true,
                  category: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          branch: {
            select: {
              id: true,
              name: true,
              city: true,
              address: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      this.prisma.order.count({ where: { customerId: id } }),
    ]);

    return {
      data: orders,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
    };
  }

  async getBonusHistory(id: string, query?: { limit?: number; offset?: number }) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Клиент с идентификатором ${id} не найден`);
    }

    const limit = query?.limit ? Number(query.limit) : 50;
    const offset = query?.offset ? Number(query.offset) : 0;

    const [transactions, total] = await this.prisma.$transaction([
      this.prisma.bonusTransaction.findMany({
        where: { customerId: id },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      this.prisma.bonusTransaction.count({ where: { customerId: id } }),
    ]);

    return {
      data: transactions,
      total,
      page: Math.floor(offset / limit) + 1,
      limit,
    };
  }

  async addBonus(id: string, dto: AddBonusDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Клиент с идентификатором ${id} не найден`);
    }

    if (dto.amount <= 0) {
      throw new BadRequestException('Количество бонусов должно быть больше 0');
    }

    return this.prisma.$transaction(async (tx) => {
      // Создаем транзакцию
      const transaction = await tx.bonusTransaction.create({
        data: {
          customerId: id,
          type: 'EARNED',
          amount: dto.amount,
          orderId: dto.orderId,
          description: dto.description || 'Начисление бонусов',
          expiresAt: dto.expiresAt,
        },
      });

      // Обновляем баланс клиента
      await tx.customer.update({
        where: { id },
        data: {
          bonus: { increment: dto.amount },
        },
      });

      return transaction;
    });
  }

  async spendBonus(id: string, dto: SpendBonusDto) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Клиент с идентификатором ${id} не найден`);
    }

    if (dto.amount <= 0) {
      throw new BadRequestException('Количество бонусов должно быть больше 0');
    }

    if (customer.bonus < dto.amount) {
      throw new BadRequestException('Недостаточно бонусов');
    }

    return this.prisma.$transaction(async (tx) => {
      // Создаем транзакцию
      const transaction = await tx.bonusTransaction.create({
        data: {
          customerId: id,
          type: 'SPENT',
          amount: -dto.amount,
          orderId: dto.orderId,
          description: dto.description || 'Списание бонусов',
        },
      });

      // Обновляем баланс клиента
      await tx.customer.update({
        where: { id },
        data: {
          bonus: { decrement: dto.amount },
        },
      });

      return transaction;
    });
  }

  async getStatistics(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          select: {
            total: true,
            createdAt: true,
            status: true,
          },
        },
        bonusHistory: {
          select: {
            type: true,
            amount: true,
            createdAt: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Клиент с идентификатором ${id} не найден`);
    }

    const completedOrders = customer.orders.filter((o) => o.status === 'COMPLETED');
    const totalSpent = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const averageCheck = completedOrders.length > 0 ? totalSpent / completedOrders.length : 0;

    const earnedBonuses = customer.bonusHistory
      .filter((t) => t.type === 'EARNED')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const spentBonuses = customer.bonusHistory
      .filter((t) => t.type === 'SPENT')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      totalSpent,
      totalOrders: customer.orders.length,
      completedOrders: completedOrders.length,
      averageCheck,
      currentBonus: customer.bonus,
      earnedBonuses,
      spentBonuses,
      lastOrderDate: customer.lastOrderDate,
      vipStatus: customer.vipStatus,
      discountPercent: customer.discountPercent,
    };
  }

  private generateReferralCode(): string {
    return randomBytes(6).toString('hex').toUpperCase();
  }
}
