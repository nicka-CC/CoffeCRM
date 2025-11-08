import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIntegrationDto {
  @ApiProperty({ description: 'ID компании' })
  companyId: string;

  @ApiProperty({ description: 'Название интеграции' })
  name: string;

  @ApiProperty({ description: 'Тип интеграции' })
  type: string;

  @ApiPropertyOptional({ description: 'Иконка' })
  icon?: string;

  @ApiPropertyOptional({ description: 'Провайдер' })
  provider?: string;

  @ApiPropertyOptional({ description: 'API ключ' })
  apiKey?: string;

  @ApiPropertyOptional({ description: 'Секретный ключ' })
  apiSecret?: string;

  @ApiPropertyOptional({ description: 'URL API' })
  apiUrl?: string;

  @ApiPropertyOptional({ description: 'URL для webhook' })
  webhookUrl?: string;

  @ApiPropertyOptional({ description: 'Активна ли интеграция', default: true })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Тестовый режим', default: false })
  isTest?: boolean;

  @ApiPropertyOptional({ description: 'Настройки (JSON)' })
  settings?: string;
}

export class UpdateIntegrationDto {
  @ApiPropertyOptional({ description: 'Название интеграции' })
  name?: string;

  @ApiPropertyOptional({ description: 'Тип интеграции' })
  type?: string;

  @ApiPropertyOptional({ description: 'Иконка' })
  icon?: string;

  @ApiPropertyOptional({ description: 'Провайдер' })
  provider?: string;

  @ApiPropertyOptional({ description: 'API ключ' })
  apiKey?: string;

  @ApiPropertyOptional({ description: 'Секретный ключ' })
  apiSecret?: string;

  @ApiPropertyOptional({ description: 'URL API' })
  apiUrl?: string;

  @ApiPropertyOptional({ description: 'URL для webhook' })
  webhookUrl?: string;

  @ApiPropertyOptional({ description: 'Активна ли интеграция' })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Тестовый режим' })
  isTest?: boolean;

  @ApiPropertyOptional({ description: 'Настройки (JSON)' })
  settings?: string;
}
