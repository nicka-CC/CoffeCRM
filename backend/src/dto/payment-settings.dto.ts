import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentSettingsDto {
  @ApiProperty({ description: 'ID компании' })
  companyId: string;

  @ApiProperty({ description: 'Провайдер платежной системы' })
  provider: string;

  @ApiProperty({ description: 'API ключ' })
  apiKey: string;

  @ApiPropertyOptional({ description: 'Иконка' })
  icon?: string;

  @ApiPropertyOptional({ description: 'Название настройки' })
  name?: string;

  @ApiPropertyOptional({ description: 'Секретный ключ' })
  secretKey?: string;

  @ApiPropertyOptional({ description: 'ID мерчанта' })
  merchantId?: string;

  @ApiPropertyOptional({ description: 'ID терминала' })
  terminalId?: string;

  @ApiPropertyOptional({ description: 'Активна ли настройка', default: true })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Тестовый режим', default: false })
  isTest?: boolean;

  @ApiPropertyOptional({ description: 'Комиссия в процентах', type: Number })
  commission?: number;

  @ApiPropertyOptional({ description: 'Минимальная сумма', type: Number })
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Максимальная сумма', type: Number })
  maxAmount?: number;

  @ApiPropertyOptional({ description: 'URL для webhook' })
  webhookUrl?: string;

  @ApiPropertyOptional({ description: 'Дополнительные настройки (JSON)' })
  settings?: string;
}

export class UpdatePaymentSettingsDto {
  @ApiPropertyOptional({ description: 'Провайдер платежной системы' })
  provider?: string;

  @ApiPropertyOptional({ description: 'API ключ' })
  apiKey?: string;

  @ApiPropertyOptional({ description: 'Иконка' })
  icon?: string;

  @ApiPropertyOptional({ description: 'Название настройки' })
  name?: string;

  @ApiPropertyOptional({ description: 'Секретный ключ' })
  secretKey?: string;

  @ApiPropertyOptional({ description: 'ID мерчанта' })
  merchantId?: string;

  @ApiPropertyOptional({ description: 'ID терминала' })
  terminalId?: string;

  @ApiPropertyOptional({ description: 'Активна ли настройка' })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Тестовый режим' })
  isTest?: boolean;

  @ApiPropertyOptional({ description: 'Комиссия в процентах', type: Number })
  commission?: number;

  @ApiPropertyOptional({ description: 'Минимальная сумма', type: Number })
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Максимальная сумма', type: Number })
  maxAmount?: number;

  @ApiPropertyOptional({ description: 'URL для webhook' })
  webhookUrl?: string;

  @ApiPropertyOptional({ description: 'Дополнительные настройки (JSON)' })
  settings?: string;
}
