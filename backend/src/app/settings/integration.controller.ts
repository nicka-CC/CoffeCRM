import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IntegrationService } from './integration.service';
import { CreateIntegrationDto, UpdateIntegrationDto } from '../../dto/integration.dto';

@ApiTags('Settings - Integration')
@Controller('settings/integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post()
  @ApiOperation({ summary: 'Создать интеграцию' })
  @ApiResponse({ status: 201, description: 'Интеграция успешно создана' })
  create(@Body() dto: CreateIntegrationDto) {
    return this.integrationService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список интеграций' })
  @ApiResponse({ status: 200, description: 'Список интеграций' })
  findAll(@Query('companyId') companyId?: string) {
    return this.integrationService.findAll(companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить интеграцию по ID' })
  @ApiResponse({ status: 200, description: 'Интеграция найдена' })
  @ApiResponse({ status: 404, description: 'Интеграция не найдена' })
  findOne(@Param('id') id: string) {
    return this.integrationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить интеграцию' })
  @ApiResponse({ status: 200, description: 'Интеграция успешно обновлена' })
  @ApiResponse({ status: 404, description: 'Интеграция не найдена' })
  update(@Param('id') id: string, @Body() dto: UpdateIntegrationDto) {
    return this.integrationService.update(id, dto);
  }

  @Put(':id/sync')
  @ApiOperation({ summary: 'Синхронизировать интеграцию' })
  @ApiResponse({ status: 200, description: 'Синхронизация запущена' })
  sync(@Param('id') id: string) {
    return this.integrationService.sync(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить интеграцию' })
  @ApiResponse({ status: 200, description: 'Интеграция успешно удалена' })
  @ApiResponse({ status: 404, description: 'Интеграция не найдена' })
  remove(@Param('id') id: string) {
    return this.integrationService.remove(id);
  }
}





