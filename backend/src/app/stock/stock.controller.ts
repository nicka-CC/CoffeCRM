import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto, UpdateStockDto } from '../../dto/stock.dto';
import { CreateStockTransactionDto } from '../../dto/stock-transaction.dto';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body() dto: CreateStockDto) {
    return this.stockService.create(dto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.stockService.findAll(query);
  }

  @Get('overview')
  getOverview(@Query() query: any) {
    return this.stockService.getInventoryOverview(query);
  }

  @Get('alerts/low')
  getLowStockAlerts(@Query('threshold') threshold?: string) {
    const numericThreshold = threshold ? Number(threshold) : undefined;
    return this.stockService.getLowStockAlerts(numericThreshold ?? 10);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(id);
  }

  @Post(':id/transactions')
  registerTransaction(@Param('id') id: string, @Body() dto: CreateStockTransactionDto) {
    return this.stockService.registerTransaction({ ...dto, stockId: id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.stockService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockService.remove(id);
  }
}
