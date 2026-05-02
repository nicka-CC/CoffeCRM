import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto } from '../../dto/company.dto';

@ApiTags('Settings - Company')
@Controller('settings/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Создать компанию' })
  @ApiResponse({ status: 201, description: 'Компания успешно создана' })
  create(@Body() dto: CreateCompanyDto) {
    return this.companyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список компаний' })
  @ApiResponse({ status: 200, description: 'Список компаний' })
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить компанию по ID' })
  @ApiResponse({ status: 200, description: 'Компания найдена' })
  @ApiResponse({ status: 404, description: 'Компания не найдена' })
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить компанию' })
  @ApiResponse({ status: 200, description: 'Компания успешно обновлена' })
  @ApiResponse({ status: 404, description: 'Компания не найдена' })
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.companyService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить компанию' })
  @ApiResponse({ status: 200, description: 'Компания успешно удалена' })
  @ApiResponse({ status: 404, description: 'Компания не найдена' })
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}





