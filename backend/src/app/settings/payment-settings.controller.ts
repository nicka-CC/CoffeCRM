import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentSettingsService } from './payment-settings.service';
import { CreatePaymentSettingsDto, UpdatePaymentSettingsDto } from '../../dto/payment-settings.dto';

@ApiTags('Settings - Payment')
@Controller('settings/payment')
export class PaymentSettingsController {
  constructor(private readonly paymentSettingsService: PaymentSettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать настройки платежей' })
  @ApiResponse({ status: 201, description: 'Настройки успешно созданы' })
  create(@Body() dto: CreatePaymentSettingsDto) {
    return this.paymentSettingsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список настроек платежей' })
  @ApiResponse({ status: 200, description: 'Список настроек' })
  findAll(@Query('companyId') companyId?: string) {
    return this.paymentSettingsService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить настройки по ID' })
  @ApiResponse({ status: 200, description: 'Настройки найдены' })
  @ApiResponse({ status: 404, description: 'Настройки не найдены' })
  findOne(@Param('id') id: string) {
    return this.paymentSettingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить настройки платежей' })
  @ApiResponse({ status: 200, description: 'Настройки успешно обновлены' })
  @ApiResponse({ status: 404, description: 'Настройки не найдены' })
  update(@Param('id') id: string, @Body() dto: UpdatePaymentSettingsDto) {
    return this.paymentSettingsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить настройки платежей' })
  @ApiResponse({ status: 200, description: 'Настройки успешно удалены' })
  @ApiResponse({ status: 404, description: 'Настройки не найдены' })
  remove(@Param('id') id: string) {
    return this.paymentSettingsService.remove(id);
  }
}





