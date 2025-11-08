import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Идентификатор пользователя' })
  userId: string;

  @ApiPropertyOptional({ description: 'Количество бонусов', type: Number, default: 0 })
  bonus?: number;

  @ApiPropertyOptional({ description: 'Процент скидки', type: Number })
  discountPercent?: number;

  @ApiPropertyOptional({ description: 'VIP статус', default: false })
  vipStatus?: boolean;

  @ApiPropertyOptional({ description: 'Заметки о клиенте' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Теги для сегментации', type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Источник клиента' })
  source?: string;

  @ApiPropertyOptional({ description: 'День рождения', type: String, format: 'date-time' })
  birthday?: Date;

  @ApiPropertyOptional({ description: 'Предпочтения (JSON)' })
  preferences?: string;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: 'Количество бонусов', type: Number })
  bonus?: number;

  @ApiPropertyOptional({ description: 'Процент скидки', type: Number })
  discountPercent?: number;

  @ApiPropertyOptional({ description: 'VIP статус' })
  vipStatus?: boolean;

  @ApiPropertyOptional({ description: 'Любимый товар (productId)' })
  favoriteProduct?: string;

  @ApiPropertyOptional({ description: 'Любимый филиал (branchId)' })
  favoriteBranch?: string;

  @ApiPropertyOptional({ description: 'Заметки о клиенте' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Теги для сегментации', type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ description: 'День рождения', type: String, format: 'date-time' })
  birthday?: Date;

  @ApiPropertyOptional({ description: 'Предпочтения (JSON)' })
  preferences?: string;
}

export class AddBonusDto {
  @ApiProperty({ description: 'Количество бонусов', type: Number })
  amount: number;

  @ApiPropertyOptional({ description: 'ID заказа' })
  orderId?: string;

  @ApiPropertyOptional({ description: 'Описание операции' })
  description?: string;

  @ApiPropertyOptional({ description: 'Срок действия бонусов', type: String, format: 'date-time' })
  expiresAt?: Date;
}

export class SpendBonusDto {
  @ApiProperty({ description: 'Количество бонусов', type: Number })
  amount: number;

  @ApiPropertyOptional({ description: 'ID заказа' })
  orderId?: string;

  @ApiPropertyOptional({ description: 'Описание операции' })
  description?: string;
}
