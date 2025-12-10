import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import * as PDFDocument from 'pdfkit';

type AnalyticsPeriod = 'week' | 'month' | 'quarter' | 'custom';
type ExportFormat = 'excel' | 'pdf';
type ExportDataset = 'sales' | 'branches' | 'products' | 'customers';

export interface AnalyticsRange {
  from: Date;
  to: Date;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(params: { period?: AnalyticsPeriod; from?: string; to?: string }) {
    const range = this.resolveRange(params);

    const [salesDynamics, topProducts, topCustomers, branchSales, peakHours] = await Promise.all([
      this.getSalesDynamics(range),
      this.getTopProducts(range, 5),
      this.getTopCustomers(range, 5),
      this.getBranchSales(range),
      this.getPeakHours(range),
    ]);

    return {
      range,
      salesDynamics,
      topProducts,
      topCustomers,
      branchSales,
      peakHours,
    };
  }

  async getSalesDynamics(range: AnalyticsRange) {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: range.from,
          lte: range.to,
        },
        status: {
          not: OrderStatus.CANCELED,
        },
      },
      select: {
        id: true,
        total: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const buckets = new Map<string, { date: string; revenue: number; orders: number }>();

    orders.forEach((order) => {
      const key = order.createdAt.toISOString().slice(0, 10);
      const bucket = buckets.get(key) ?? {
        date: key,
        revenue: 0,
        orders: 0,
      };
      bucket.revenue += order.total;
      bucket.orders += 1;
      buckets.set(key, bucket);
    });

    return Array.from(buckets.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  async getTopProducts(range: AnalyticsRange, limit = 5) {
    const items = await this.prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: range.from,
            lte: range.to,
          },
          status: {
            not: OrderStatus.CANCELED,
          },
        },
      },
      include: {
        product: true,
      },
    });

    const aggregated = new Map<
      string,
      {
        productId: string;
        name: string;
        revenue: number;
        quantity: number;
      }
    >();

    items.forEach((item) => {
      const entry = aggregated.get(item.productId) ?? {
        productId: item.productId,
        name: item.product.name,
        revenue: 0,
        quantity: 0,
      };
      entry.revenue += item.price * item.quantity;
      entry.quantity += item.quantity;
      aggregated.set(item.productId, entry);
    });

    return Array.from(aggregated.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }

  async getTopCustomers(range: AnalyticsRange, limit = 5) {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: range.from,
          lte: range.to,
        },
        status: {
          not: OrderStatus.CANCELED,
        },
        customerId: {
          not: null,
        },
      },
      include: {
        customer: {
          include: {
            user: true,
          },
        },
      },
    });

    const aggregated = new Map<
      string,
      {
        customerId: string;
        name: string | null;
        phone: string | null;
        orders: number;
        revenue: number;
      }
    >();

    orders.forEach((order) => {
      if (!order.customer) {
        return;
      }

      const key = order.customerId!;
      const entry = aggregated.get(key) ?? {
        customerId: key,
        name: order.customer.user?.fullName ?? null,
        phone: order.customer.user?.phone ?? null,
        orders: 0,
        revenue: 0,
      };
      entry.orders += 1;
      entry.revenue += order.total;
      aggregated.set(key, entry);
    });

    return Array.from(aggregated.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }

  async getBranchSales(range: AnalyticsRange) {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: range.from,
          lte: range.to,
        },
        status: {
          not: OrderStatus.CANCELED,
        },
      },
      include: {
        branch: true,
      },
    });

    const aggregated = new Map<
      string,
      {
        branchId: string;
        name: string;
        city: string;
        revenue: number;
        orders: number;
      }
    >();

    orders.forEach((order) => {
      const entry = aggregated.get(order.branchId) ?? {
        branchId: order.branchId,
        name: order.branch.name,
        city: order.branch.city,
        revenue: 0,
        orders: 0,
      };
      entry.revenue += order.total;
      entry.orders += 1;
      aggregated.set(order.branchId, entry);
    });

    return Array.from(aggregated.values()).sort((a, b) => b.revenue - a.revenue);
  }

  async getPeakHours(range: AnalyticsRange) {
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: range.from,
          lte: range.to,
        },
        status: {
          not: OrderStatus.CANCELED,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    const buckets = new Map<number, number>();

    orders.forEach((order) => {
      const hour = order.createdAt.getHours();
      buckets.set(hour, (buckets.get(hour) ?? 0) + 1);
    });

    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      orders: buckets.get(hour) ?? 0,
    })).sort((a, b) => b.orders - a.orders);
  }

  async exportReport(params: {
    dataset: ExportDataset;
    format: ExportFormat;
    period?: AnalyticsPeriod;
    from?: string;
    to?: string;
  }) {
    const range = this.resolveRange(params);

    let rows: Array<Record<string, unknown>> = [];
    let filename = 'report';

    switch (params.dataset) {
      case 'branches':
        rows = await this.getBranchSales(range);
        filename = 'branch-sales';
        break;
      case 'products':
        rows = await this.getTopProducts(range, 50);
        filename = 'top-products';
        break;
      case 'customers':
        rows = await this.getTopCustomers(range, 50);
        filename = 'top-customers';
        break;
      case 'sales':
      default:
        rows = await this.getSalesDynamics(range);
        filename = 'sales-dynamics';
        break;
    }

    const exportTime = new Date().toISOString().replace(/[:.]/g, '-');
    const fullFilename = `${filename}-${exportTime}.${params.format === 'excel' ? 'xlsx' : 'pdf'}`;

    if (params.format === 'excel') {
      const buffer = await this.generateExcel(fullFilename, rows);
      return {
        filename: fullFilename,
        format: params.format,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        base64: buffer.toString('base64'),
      };
    }

    const buffer = await this.generatePdf(fullFilename, rows);
    return {
      filename: fullFilename,
      format: params.format,
      mimeType: 'application/pdf',
      base64: buffer.toString('base64'),
    };
  }

  resolveRange(params: { period?: AnalyticsPeriod; from?: string; to?: string }): AnalyticsRange {
    if (params.period === 'custom' && params.from && params.to) {
      return {
        from: new Date(params.from),
        to: new Date(params.to),
      };
    }

    const now = new Date();
    const to = now;
    const from = new Date(now);

    switch (params.period) {
      case 'week':
        from.setDate(now.getDate() - 7);
        break;
      case 'quarter':
        from.setMonth(now.getMonth() - 3);
        break;
      case 'month':
      default:
        from.setMonth(now.getMonth() - 1);
        break;
    }

    return { from, to };
  }

  async generateExcel(title: string, rows: Array<Record<string, unknown>>) {
    // @ts-ignore
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    if (rows.length > 0) {
      const columns = Object.keys(rows[0]).map((key) => ({
        header: key,
        key,
        width: Math.max(15, key.length + 5),
      }));
      worksheet.columns = columns;
      worksheet.addRows(rows);
    }

    worksheet.insertRow(1, [title]);
    const columnCount = worksheet.columns?.length ?? 1;
    const lastColumn = this.columnNumberToName(columnCount);
    worksheet.mergeCells(`A1:${lastColumn}1`);
    worksheet.getCell('A1').font = { size: 16, bold: true };

    return workbook.xlsx.writeBuffer();
  }

 async generatePdf(title: string, rows: Array<Record<string, unknown>>) {
    const doc = new (PDFDocument as any)({ margin: 40 });
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));

    const ready = new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });

    doc.fontSize(18).text(title, { align: 'left' });
    doc.moveDown();

    rows.forEach((row) => {
      Object.entries(row).forEach(([key, value]) => {
        const displayValue = value instanceof Date ? value.toLocaleString('ru-RU') : value;
        doc.fontSize(12).text(`${key}: ${displayValue}`);
      });
      doc.moveDown(0.5);
    });

    doc.end();

    return ready;
  }

  private columnNumberToName(num: number) {
    let result = '';
    let n = num;

    while (n > 0) {
      const rem = (n - 1) % 26;
      result = String.fromCharCode(65 + rem) + result;
      n = Math.floor((n - 1) / 26);
    }

    return result || 'A';
  }
}

