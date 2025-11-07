import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getOverview(
    @Query('period') period?: 'week' | 'month' | 'quarter' | 'custom',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analyticsService.getOverview({ period, from, to });
  }

  @Get('sales')
  getSales(@Query('period') period?: 'week' | 'month' | 'quarter' | 'custom', @Query('from') from?: string, @Query('to') to?: string) {
    const range = this.analyticsService.resolveRange({ period, from, to });
    return this.analyticsService.getSalesDynamics(range);
  }

  @Get('top-products')
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
  getBranchSales(@Query('period') period?: 'week' | 'month' | 'quarter' | 'custom', @Query('from') from?: string, @Query('to') to?: string) {
    const range = this.analyticsService.resolveRange({ period, from, to });
    return this.analyticsService.getBranchSales(range);
  }

  @Get('peak-hours')
  getPeakHours(@Query('period') period?: 'week' | 'month' | 'quarter' | 'custom', @Query('from') from?: string, @Query('to') to?: string) {
    const range = this.analyticsService.resolveRange({ period, from, to });
    return this.analyticsService.getPeakHours(range);
  }

  @Get('export')
  exportReport(
    @Query('dataset') dataset: 'sales' | 'branches' | 'products' | 'customers',
    @Query('format') format: 'excel' | 'pdf',
    @Query('period') period?: 'week' | 'month' | 'quarter' | 'custom',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analyticsService.exportReport({
      dataset: dataset ?? 'sales',
      format: format ?? 'excel',
      period,
      from,
      to,
    });
  }
}

