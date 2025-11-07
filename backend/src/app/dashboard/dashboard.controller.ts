import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getSummary(@Query('period') period: 'day' | 'week' | 'month' = 'day') {
    return this.dashboardService.getDashboardSummary(period ?? 'day');
  }
}

