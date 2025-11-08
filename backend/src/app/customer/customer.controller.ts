import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto, AddBonusDto, SpendBonusDto } from '../../dto/customer.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Создать клиента' })
  @ApiResponse({ status: 201, description: 'Клиент успешно создан' })
  create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список клиентов' })
  @ApiResponse({ status: 200, description: 'Список клиентов' })
  findAll(@Query() query: any) {
    return this.customerService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить клиента по ID' })
  @ApiResponse({ status: 200, description: 'Клиент найден' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Get(':id/orders')
  @ApiOperation({ summary: 'Получить историю заказов клиента' })
  @ApiResponse({ status: 200, description: 'История заказов' })
  getOrderHistory(@Param('id') id: string, @Query() query: any) {
    return this.customerService.getOrderHistory(id, query);
  }

  @Get(':id/bonuses')
  @ApiOperation({ summary: 'Получить историю бонусов клиента' })
  @ApiResponse({ status: 200, description: 'История бонусов' })
  getBonusHistory(@Param('id') id: string, @Query() query: any) {
    return this.customerService.getBonusHistory(id, query);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Получить статистику клиента' })
  @ApiResponse({ status: 200, description: 'Статистика клиента' })
  getStatistics(@Param('id') id: string) {
    return this.customerService.getStatistics(id);
  }

  @Put(':id/bonuses/add')
  @ApiOperation({ summary: 'Начислить бонусы клиенту' })
  @ApiResponse({ status: 200, description: 'Бонусы начислены' })
  addBonus(@Param('id') id: string, @Body() dto: AddBonusDto) {
    return this.customerService.addBonus(id, dto);
  }

  @Put(':id/bonuses/spend')
  @ApiOperation({ summary: 'Списать бонусы у клиента' })
  @ApiResponse({ status: 200, description: 'Бонусы списаны' })
  spendBonus(@Param('id') id: string, @Body() dto: SpendBonusDto) {
    return this.customerService.spendBonus(id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить клиента' })
  @ApiResponse({ status: 200, description: 'Клиент успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить клиента' })
  @ApiResponse({ status: 200, description: 'Клиент успешно удален' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
