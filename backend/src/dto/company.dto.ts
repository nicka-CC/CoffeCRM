import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Название компании' })
  name: string;

  @ApiPropertyOptional({ description: 'Иконка' })
  icon?: string;

  @ApiPropertyOptional({ description: 'Описание' })
  description?: string;

  @ApiPropertyOptional({ description: 'Юридическое название' })
  legalName?: string;

  @ApiPropertyOptional({ description: 'ИНН' })
  inn?: string;

  @ApiPropertyOptional({ description: 'КПП' })
  kpp?: string;

  @ApiPropertyOptional({ description: 'ОГРН' })
  ogrn?: string;

  @ApiPropertyOptional({ description: 'Юридический адрес' })
  address?: string;

  @ApiPropertyOptional({ description: 'Фактический адрес' })
  actualAddress?: string;

  @ApiPropertyOptional({ description: 'Телефон' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Email' })
  email?: string;

  @ApiPropertyOptional({ description: 'Сайт' })
  website?: string;

  @ApiPropertyOptional({ description: 'Директор' })
  director?: string;

  @ApiPropertyOptional({ description: 'Бухгалтер' })
  accountant?: string;

  @ApiPropertyOptional({ description: 'Банк' })
  bankName?: string;

  @ApiPropertyOptional({ description: 'Расчетный счет' })
  bankAccount?: string;

  @ApiPropertyOptional({ description: 'БИК' })
  bankBik?: string;

  @ApiPropertyOptional({ description: 'Система налогообложения' })
  taxSystem?: string;

  @ApiPropertyOptional({ description: 'Логотип' })
  logo?: string;

  @ApiPropertyOptional({ description: 'Настройки (JSON)' })
  settings?: string;

  @ApiPropertyOptional({ description: 'Часовой пояс', default: 'Europe/Moscow' })
  timezone?: string;

  @ApiPropertyOptional({ description: 'Валюта', default: 'RUB' })
  currency?: string;

  @ApiPropertyOptional({ description: 'Язык', default: 'ru' })
  language?: string;
}

export class UpdateCompanyDto {
  @ApiPropertyOptional({ description: 'Название компании' })
  name?: string;

  @ApiPropertyOptional({ description: 'Иконка' })
  icon?: string;

  @ApiPropertyOptional({ description: 'Описание' })
  description?: string;

  @ApiPropertyOptional({ description: 'Юридическое название' })
  legalName?: string;

  @ApiPropertyOptional({ description: 'ИНН' })
  inn?: string;

  @ApiPropertyOptional({ description: 'КПП' })
  kpp?: string;

  @ApiPropertyOptional({ description: 'ОГРН' })
  ogrn?: string;

  @ApiPropertyOptional({ description: 'Юридический адрес' })
  address?: string;

  @ApiPropertyOptional({ description: 'Фактический адрес' })
  actualAddress?: string;

  @ApiPropertyOptional({ description: 'Телефон' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Email' })
  email?: string;

  @ApiPropertyOptional({ description: 'Сайт' })
  website?: string;

  @ApiPropertyOptional({ description: 'Директор' })
  director?: string;

  @ApiPropertyOptional({ description: 'Бухгалтер' })
  accountant?: string;

  @ApiPropertyOptional({ description: 'Банк' })
  bankName?: string;

  @ApiPropertyOptional({ description: 'Расчетный счет' })
  bankAccount?: string;

  @ApiPropertyOptional({ description: 'БИК' })
  bankBik?: string;

  @ApiPropertyOptional({ description: 'Система налогообложения' })
  taxSystem?: string;

  @ApiPropertyOptional({ description: 'Логотип' })
  logo?: string;

  @ApiPropertyOptional({ description: 'Настройки (JSON)' })
  settings?: string;

  @ApiPropertyOptional({ description: 'Часовой пояс' })
  timezone?: string;

  @ApiPropertyOptional({ description: 'Валюта' })
  currency?: string;

  @ApiPropertyOptional({ description: 'Язык' })
  language?: string;
}
