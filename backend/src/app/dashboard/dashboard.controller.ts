import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Получить сводку Dashboard' })
  @ApiResponse({ status: 200, description: 'Сводка Dashboard' })
  getSummary(@Query('period') period: 'day' | 'week' | 'month' = 'day') {
    return this.dashboardService.getDashboardSummary(period ?? 'day');
  }
}
