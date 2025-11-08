import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

type DashboardPeriod = 'day' | 'week' | 'month';
type ChartGranularity = 'hour' | 'day' | 'week';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardSummary(period: DashboardPeriod = 'day') {
    const { from, to, granularity } = this.resolvePeriod(period);

    const [orders, customers, products, branches, bookings] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          createdAt: {
            gte: from,
            lte: to,
          },
        },
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
            },
          },
          customer: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
      this.prisma.customer.count({
        where: {
          createdAt: {
            gte: from,
            lte: to,
          },
        },
      }),
      this.prisma.product.count({
        where: {
          isActive: true,
        },
      }),
      this.prisma.branch.count({
        where: {
          isActive: true,
        },
      }),
      this.prisma.booking.count({
        where: {
          date: {
            gte: from,
            lte: to,
          },
          status: {
            not: 'CANCELED',
          },
        },
      }),
    ]);

    const completedOrders = orders.filter((o) => o.status === OrderStatus.COMPLETED);
    const revenue = completedOrders.reduce((acc, order) => acc + order.total, 0);
    const ordersCount = orders.length;
    const completedOrdersCount = completedOrders.length;
    const averageCheck = completedOrdersCount > 0 ? revenue / completedOrdersCount : 0;

    const topProducts = this.calculateTopProducts(orders);
    const salesChart = this.buildSalesChart(orders, from, to, granularity);
    const branchStats = this.calculateBranchStats(orders);
    const statusDistribution = this.calculateStatusDistribution(orders);

    return {
      period,
      range: {
        from,
        to,
      },
      kpis: {
        revenue,
        ordersCount,
        completedOrdersCount,
        averageCheck,
        newCustomers: customers,
        activeProducts: products,
        activeBranches: branches,
        bookings,
      },
      topProducts,
      salesChart,
      branchStats,
      statusDistribution,
      quickLinks: this.getQuickLinks(),
    };
  }

  private resolvePeriod(period: DashboardPeriod) {
    const now = new Date();
    const to = now;
    const from = new Date(now);
    let granularity: ChartGranularity = 'day';

    switch (period) {
      case 'month':
        from.setMonth(now.getMonth() - 1);
        granularity = 'week';
        break;
      case 'week':
        from.setDate(now.getDate() - 7);
        granularity = 'day';
        break;
      case 'day':
      default:
        from.setDate(now.getDate() - 1);
        granularity = 'hour';
        break;
    }

    return { from, to, granularity };
  }

  private calculateTopProducts(
    orders: Array<{
      items: Array<{
        quantity: number;
        price: number;
        product: {
          id: string;
          name: string;
          icon?: string | null;
        };
      }>;
    }>,
  ) {
    const productMap = new Map<
      string,
      {
        productId: string;
        name: string;
        quantity: number;
        revenue: number;
        icon: string | null;
      }
    >();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = productMap.get(item.product.id);

        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          productMap.set(item.product.id, {
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            revenue: item.price * item.quantity,
            icon: item.product.icon ?? null,
          });
        }
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }

  private buildSalesChart(
    orders: Array<{ createdAt: Date; total: number; status: OrderStatus }>,
    from: Date,
    to: Date,
    granularity: ChartGranularity,
  ) {
    const buckets = new Map<string, { label: string; revenue: number; orders: number }>();

    const formatter = new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      ...(granularity === 'hour' ? { hour: '2-digit' } : {}),
    });

    const cursor = new Date(from);

    while (cursor <= to) {
      const key = this.getBucketKey(cursor, granularity);
      buckets.set(key, {
        label: formatter.format(cursor),
        revenue: 0,
        orders: 0,
      });
      this.advanceCursor(cursor, granularity);
    }

    orders
      .filter((o) => o.status === OrderStatus.COMPLETED)
      .forEach((order) => {
        const key = this.getBucketKey(order.createdAt, granularity);
        const bucket = buckets.get(key);
        if (bucket) {
          bucket.revenue += order.total;
          bucket.orders += 1;
        }
      });

    return Array.from(buckets.values());
  }

  private calculateBranchStats(
    orders: Array<{
      branch: { id: string; name: string };
      total: number;
      status: OrderStatus;
    }>,
  ) {
    const branchMap = new Map<
      string,
      {
        branchId: string;
        name: string;
        revenue: number;
        orders: number;
      }
    >();

    orders
      .filter((o) => o.status === OrderStatus.COMPLETED)
      .forEach((order) => {
        const existing = branchMap.get(order.branch.id);
        if (existing) {
          existing.revenue += order.total;
          existing.orders += 1;
        } else {
          branchMap.set(order.branch.id, {
            branchId: order.branch.id,
            name: order.branch.name,
            revenue: order.total,
            orders: 1,
          });
        }
      });

    return Array.from(branchMap.values()).sort((a, b) => b.revenue - a.revenue);
  }

  private calculateStatusDistribution(orders: Array<{ status: OrderStatus }>) {
    const distribution: Record<OrderStatus, number> = {
      NEW: 0,
      IN_PROGRESS: 0,
      READY: 0,
      COMPLETED: 0,
      CANCELED: 0,
    };

    orders.forEach((order) => {
      distribution[order.status] = (distribution[order.status] || 0) + 1;
    });

    return Object.entries(distribution).map(([status, count]) => ({
      status,
      count,
    }));
  }

  private getBucketKey(date: Date, granularity: ChartGranularity) {
    const keyDate = new Date(date);
    keyDate.setMinutes(0, 0, 0);

    if (granularity === 'day' || granularity === 'week') {
      keyDate.setHours(0, 0, 0, 0);
    }

    if (granularity === 'week') {
      const day = keyDate.getDay();
      const diff = keyDate.getDate() - day + (day === 0 ? -6 : 1);
      keyDate.setDate(diff);
    }

    return keyDate.toISOString();
  }

  private advanceCursor(cursor: Date, granularity: ChartGranularity) {
    switch (granularity) {
      case 'week':
        cursor.setDate(cursor.getDate() + 7);
        break;
      case 'day':
        cursor.setDate(cursor.getDate() + 1);
        break;
      case 'hour':
      default:
        cursor.setHours(cursor.getHours() + 1);
        break;
    }
  }

  private getQuickLinks() {
    return [
      {
        title: 'Создать заказ',
        icon: 'shopping-cart',
        url: '/orders/new',
        action: 'createOrder',
      },
      {
        title: 'Добавить товар',
        icon: 'coffee',
        url: '/products/new',
        action: 'createProduct',
      },
      {
        title: 'Пополнить склад',
        icon: 'truck',
        url: '/inventory/inbound',
        action: 'addStock',
      },
      {
        title: 'Новый сотрудник',
        icon: 'user-plus',
        url: '/employees/new',
        action: 'createEmployee',
      },
      {
        title: 'Создать бронирование',
        icon: 'calendar',
        url: '/bookings/new',
        action: 'createBooking',
      },
      {
        title: 'Новый клиент',
        icon: 'users',
        url: '/customers/new',
        action: 'createCustomer',
      },
    ];
  }
}
