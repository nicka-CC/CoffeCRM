import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../../dto/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEmployeeDto) {
    return this.prisma.employee.create({ data: dto });
  }

  async findAll(query: any) {
    const branchId = query.branchId as string | undefined;
    const search = query.search as string | undefined;
    const page = query.page ? Number(query.page) : undefined;
    const limit = query.limit ? Number(query.limit) : undefined;
    const take = limit;
    const skip = page && limit ? (page - 1) * limit : undefined;

    const where = {
      ...(branchId ? { branchId } : {}),
      ...(search
        ? {
            user: {
              fullName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          }
        : {}),
    } as any;

    const [employees, total] = await this.prisma.$transaction([
      this.prisma.employee.findMany({
        where,
        include: {
          user: true,
          branch: true,
          kpis: {
            orderBy: {
              date: 'desc',
            },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.employee.count({ where }),
    ]);

    return {
      data: employees,
      total,
      page: page ?? (skip !== undefined && take ? Math.floor(skip / take) + 1 : 1),
      limit: take,
    };
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: true,
        branch: true,
        kpis: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException(`Сотрудник с идентификатором ${id} не найден`);
    }

    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    return this.prisma.employee.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.employee.delete({ where: { id } });
  }

  async getKpi(id: string, period: 'week' | 'month' | 'quarter' = 'month') {
    const employee = await this.prisma.employee.findUnique({ where: { id } });

    if (!employee) {
      throw new NotFoundException(`Сотрудник с идентификатором ${id} не найден`);
    }

    const { from, to } = this.resolvePeriod(period);

    const kpis = await this.prisma.kpi.findMany({
      where: {
        employeeId: id,
        date: {
          gte: from,
          lte: to,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    const metrics = kpis.reduce<Record<string, { total: number; count: number }>>(
      (acc, kpi) => {
        const current = acc[kpi.metric] ?? { total: 0, count: 0 };
        current.total += kpi.value;
        current.count += 1;
        acc[kpi.metric] = current;
        return acc;
      },
      {},
    );

    const aggregated = Object.entries(metrics).map(([metric, value]) => ({
      metric,
      total: value.total,
      average: value.total / value.count,
    }));

    return {
      period,
      range: { from, to },
      metrics: aggregated,
      raw: kpis,
    };
  }

  private resolvePeriod(period: 'week' | 'month' | 'quarter') {
    const now = new Date();
    const to = now;
    const from = new Date(now);

    switch (period) {
      case 'quarter':
        from.setMonth(now.getMonth() - 3);
        break;
      case 'week':
        from.setDate(now.getDate() - 7);
        break;
      case 'month':
      default:
        from.setMonth(now.getMonth() - 1);
        break;
    }

    return { from, to };
  }
}
