import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStockDto {
  @ApiProperty({ description: 'Идентификатор филиала' })
  branchId: string;

  @ApiProperty({ description: 'Идентификатор товара' })
  productId: string;

  @ApiProperty({ description: 'Количество на складе', type: Number })
  quantity: number;

  @ApiPropertyOptional({ description: 'Зарезервировано', type: Number, default: 0 })
  reserved?: number;

  @ApiPropertyOptional({ description: 'Минимальный остаток', type: Number, default: 0 })
  minQuantity?: number;

  @ApiPropertyOptional({ description: 'Максимальный остаток', type: Number })
  maxQuantity?: number;

  @ApiPropertyOptional({ description: 'Точка заказа', type: Number })
  reorderPoint?: number;

  @ApiPropertyOptional({ description: 'Место хранения на складе' })
  location?: string;

  @ApiPropertyOptional({ description: 'Номер партии' })
  batchNumber?: string;

  @ApiPropertyOptional({ description: 'Срок годности', type: String, format: 'date-time' })
  expiryDate?: Date;

  @ApiPropertyOptional({ description: 'Закупочная цена', type: Number })
  purchasePrice?: number;

  @ApiPropertyOptional({ description: 'Поставщик' })
  supplier?: string;

  @ApiPropertyOptional({ description: 'Заметки' })
  notes?: string;
}

export class UpdateStockDto {
  @ApiPropertyOptional({ description: 'Количество на складе', type: Number })
  quantity?: number;

  @ApiPropertyOptional({ description: 'Зарезервировано', type: Number })
  reserved?: number;

  @ApiPropertyOptional({ description: 'Минимальный остаток', type: Number })
  minQuantity?: number;

  @ApiPropertyOptional({ description: 'Максимальный остаток', type: Number })
  maxQuantity?: number;

  @ApiPropertyOptional({ description: 'Точка заказа', type: Number })
  reorderPoint?: number;

  @ApiPropertyOptional({ description: 'Место хранения на складе' })
  location?: string;

  @ApiPropertyOptional({ description: 'Номер партии' })
  batchNumber?: string;

  @ApiPropertyOptional({ description: 'Срок годности', type: String, format: 'date-time' })
  expiryDate?: Date;

  @ApiPropertyOptional({ description: 'Закупочная цена', type: Number })
  purchasePrice?: number;

  @ApiPropertyOptional({ description: 'Поставщик' })
  supplier?: string;

  @ApiPropertyOptional({ description: 'Заметки' })
  notes?: string;
}
