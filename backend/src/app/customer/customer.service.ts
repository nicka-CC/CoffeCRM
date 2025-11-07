import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from '../../dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({ data: dto });
  }

  async findAll(query: any) {
    const take = query.take ? Number(query.take) : undefined;
    const skip = query.skip ? Number(query.skip) : undefined;
    const search = query.search as string | undefined;

    const where: Prisma.CustomerWhereInput | undefined = search
      ? {
          user: {
            is: {
              OR: [
                {
                  fullName: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  phone: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          },
        }
      : undefined;

    const [customers, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where,
        include: {
          user: true,
          orders: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 5,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take,
        skip,
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      total,
    };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        user: true,
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
            branch: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Клиент с идентификатором ${id} не найден`);
    }

    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    return this.prisma.customer.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.customer.delete({ where: { id } });
  }

  async getOrderHistory(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });

    if (!customer) {
      throw new NotFoundException(`Клиент с идентификатором ${id} не найден`);
    }

    const orders = await this.prisma.order.findMany({
      where: { customerId: id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        branch: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  }
}
