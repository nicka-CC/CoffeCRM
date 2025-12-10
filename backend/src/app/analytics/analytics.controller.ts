// backend/src/app/analytics/analytics.controller.ts

import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {JwtAuthGuard} from "../../jwt-auth.guard";

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor( readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить аналитику' })
  @ApiResponse({ status: 200, description: 'Аналитические данные' })
  async getAnalytics(
      @Query('period') period?: 'week' | 'month' | 'quarter' | 'custom',
      @Query('from') from?: string,
      @Query('to') to?: string,
  ) {
    return this.analyticsService.getOverview({ period, from, to });
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
    try {
      const range = this.analyticsService.resolveRange({ period, from, to });
      let data: any[] = [];
      let title = '';

      switch (dataset) {
        case 'sales':
          data = await this.analyticsService.getSalesDynamics(range);
          title = 'Отчет по продажам';
          break;
        case 'branches':
          data = await this.analyticsService.getBranchSales(range);
          title = 'Отчет по филиалам';
          break;
        case 'products':
          data = await this.analyticsService.getTopProducts(range, 100);
          title = 'ТОП товаров';
          break;
        case 'customers':
          data = await this.analyticsService.getTopCustomers(range, 100);
          title = 'ТОП клиентов';
          break;
      }
      const result = format === 'excel'
          ? await this.analyticsService.generateExcel(title, data)
          : await this.analyticsService.generatePdf(title, data);

      const filename = encodeURIComponent(
          `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'xlsx' : 'pdf'}`
      );

      res.setHeader('Content-Type', format === 'excel'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf'
      );
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      if (format === 'excel') {
        res.setHeader('Content-Length', (result as ArrayBuffer).byteLength);
        res.end(Buffer.from(result as ArrayBuffer));
      } else {
        res.end(result);
      }
    } catch (error) {
      console.error('Export error:', error);
      res.status(500).json({
        statusCode: 500,
        message: 'Ошибка при экспорте отчета',
        error: 'Internal Server Error'
      });
    }
  }
}