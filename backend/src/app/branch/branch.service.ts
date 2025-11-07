import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateBranchDto, UpdateBranchDto } from '../../dto/branch.dto';

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBranchDto) {
    return this.prisma.branch.create({ data: dto });
  }

  async findAll(query: any) {
    const withStats = query?.withStats === 'true';

    const branches = (await this.prisma.branch.findMany({
      include: withStats
        ? ({
            _count: {
              select: {
                employees: true,
                orders: true,
              },
            },
            orders: {
              select: {
                total: true,
              },
            },
            stocks: {
              select: {
                quantity: true,
              },
            },
          } as const)
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    })) as Array<any>;

    if (!withStats) {
      return branches;
    }

    return branches.map((branch) => {
      const revenue = branch.orders?.reduce((acc, order) => acc + order.total, 0) ?? 0;
      const stockQuantity = branch.stocks?.reduce((acc, stock) => acc + stock.quantity, 0) ?? 0;

      const { orders, stocks, _count, ...rest } = branch as any;

      return {
        ...rest,
        stats: {
          revenue,
          orders: _count?.orders ?? 0,
          employees: _count?.employees ?? 0,
          stockQuantity,
        },
      };
    });
  }

  async findOne(id: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id } });

    if (!branch) {
      throw new NotFoundException(`Филиал с идентификатором ${id} не найден`);
    }

    return branch;
  }

  async update(id: string, dto: UpdateBranchDto) {
    return this.prisma.branch.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.branch.delete({ where: { id } });
  }

  async getMapPoints() {
    const branches = (await this.prisma.branch.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        latitude: true,
        longitude: true,
        phone: true,
        email: true,
      } as any,
    })) as Array<any>;

    return branches.map((branch) => ({
      ...branch,
      hasCoordinates:
        typeof branch.latitude === 'number' && typeof branch.longitude === 'number',
    }));
  }

  async getBranchDetails(id: string) {
    const branch = (await this.prisma.branch.findUnique({
      where: { id },
      include: {
        employees: {
          include: {
            user: true,
            kpis: true,
          },
        },
        orders: {
          include: {
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
        },
        stocks: {
          include: {
            product: true,
            transactions: {
              orderBy: {
                date: 'desc',
              },
              take: 5,
            },
          },
        },
      },
    })) as any;

    if (!branch) {
      throw new NotFoundException(`Филиал с идентификатором ${id} не найден`);
    }

    const salesTotal = branch.orders.reduce((acc, order) => acc + order.total, 0);
    const ordersCount = branch.orders.length;
    const averageCheck = ordersCount > 0 ? salesTotal / ordersCount : 0;

    const inventory = branch.stocks.map((stock) => ({
      stockId: stock.id,
      productId: stock.productId,
      productName: stock.product.name,
      quantity: stock.quantity,
      transactions: stock.transactions,
    }));

    const employees = branch.employees.map((employee) => ({
      id: employee.id,
      fullName: employee.user?.fullName,
      position: employee.position,
      salary: employee.salary,
      phone: employee.user?.phone,
      email: employee.user?.email,
      kpis: employee.kpis,
    }));

    return {
      branch: {
        id: branch.id,
        name: branch.name,
        address: branch.address,
        city: branch.city,
        phone: branch.phone,
        email: branch.email,
        latitude: branch.latitude,
        longitude: branch.longitude,
        createdAt: branch.createdAt,
        updatedAt: branch.updatedAt,
      },
      sales: {
        revenue: salesTotal,
        ordersCount,
        averageCheck,
        latestOrders: branch.orders.slice(0, 10).map((order) => ({
          id: order.id,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          customer: order.customer
            ? {
                id: order.customer.id,
                name: order.customer.user?.fullName,
                phone: order.customer.user?.phone,
              }
            : null,
        })),
      },
      inventory,
      employees,
    };
  }
}
