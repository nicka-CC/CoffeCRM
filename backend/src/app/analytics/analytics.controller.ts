import { Controller, Get, Query, Res, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить обзор аналитики' })
  @ApiResponse({ status: 200, description: 'Обзор аналитики' })
  getOverview(
    @Query('period') period?: 'week' | 'month' | 'quarter' | 'custom',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analyticsService.getOverview({ period, from, to });
  }

  @Get('sales')
  @ApiOperation({ summary: 'Получить динамику продаж' })
  @ApiResponse({ status: 200, description: 'Динамика продаж' })
  getSales(
    @Query('period') period?: 'week' | 'month' | 'quarter' | 'custom',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const range = this.analyticsService.resolveRange({ period, from, to });
    return this.analyticsService.getSalesDynamics(range);
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Получить ТОП товаров' })
  @ApiResponse({ status: 200, description: 'ТОП товаров' })
  getTopProducts(
    @Query('limit') limit = '5',
    @Query('period') period?: 'week' | 'month' | 'quarter' | 'custom',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const range = this.analyticsService.resolveRange({ period, from, to });
    return this.analyticsService.getTopProducts(range, Number(limit));
  }

  @Get('top-customers')
  @ApiOperation({ summary: 'Получить ТОП клиентов' })
  @ApiResponse({ status: 200, description: 'ТОП клиентов' })
  getTopCustomers(
    @Query('limit') limit = '5',
    @Query('period') period?: 'week' | 'month' | 'quarter' | 'custom',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const range = this.analyticsService.resolveRange({ period, from, to });
    return this.analyticsService.getTopCustomers(range, Number(limit));
  }

  @Get('branch-sales')
  @ApiOperation({ summary: 'Получить продажи по филиалам' })
  @ApiResponse({ status: 200, description: 'Продажи по филиалам' })
  getBranchSales(
    @Query('period') period?: 'week' | 'month' | 'quarter' | 'custom',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const range = this.analyticsService.resolveRange({ period, from, to });
    return this.analyticsService.getBranchSales(range);
  }

  @Get('peak-hours')
  @ApiOperation({ summary: 'Получить пиковые часы' })
  @ApiResponse({ status: 200, description: 'Пиковые часы' })
  getPeakHours(
    @Query('period') period?: 'week' | 'month' | 'quarter' | 'custom',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const range = this.analyticsService.resolveRange({ period, from, to });
    return this.analyticsService.getPeakHours(range);
  }

  @Get('export')
  @ApiOperation({ summary: 'Экспортировать отчет' })
  @ApiResponse({ status: 200, description: 'Файл отчета' })
  async exportReport(
    @Res() res: Response,
    @Query('dataset') dataset: 'sales' | 'branches' | 'products' | 'customers',
    @Query('format') format: 'excel' | 'pdf',
    @Query('period') period?: 'week' | 'month' | 'quarter' | 'custom',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const result = await this.analyticsService.exportReport({
      dataset: dataset ?? 'sales',
      format: format ?? 'excel',
      period,
      from,
      to,
    });

    const buffer = Buffer.from(result.base64, 'base64');

    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.setHeader('Content-Length', buffer.length.toString());

    res.send(buffer);
  }
}
