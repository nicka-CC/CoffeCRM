import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class CreateStockTransactionDto {
  @ApiProperty({ description: 'Идентификатор складской позиции' })
  stockId: string;

  @ApiProperty({ description: 'Тип движения', enum: TransactionType, enumName: 'TransactionType' })
  type: TransactionType;

  @ApiProperty({ description: 'Количество единиц', type: Number })
  quantity: number;

  @ApiPropertyOptional({ description: 'Дата операции', type: String, format: 'date-time' })
  date?: Date;

  @ApiPropertyOptional({ description: 'Цена за единицу', type: Number })
  price?: number;

  @ApiPropertyOptional({ description: 'Общая стоимость', type: Number })
  totalPrice?: number;

  @ApiPropertyOptional({ description: 'Причина операции' })
  reason?: string;

  @ApiPropertyOptional({ description: 'Номер документа (накладная, счет и т.д.)' })
  document?: string;

  @ApiPropertyOptional({ description: 'Поставщик' })
  supplier?: string;

  @ApiPropertyOptional({ description: 'Номер партии' })
  batchNumber?: string;

  @ApiPropertyOptional({ description: 'Срок годности для партии', type: String, format: 'date-time' })
  expiryDate?: Date;

  @ApiPropertyOptional({ description: 'Идентификатор сотрудника, проверившего операцию' })
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Примечания' })
  notes?: string;
}

export class UpdateStockTransactionDto {
  @ApiPropertyOptional({ description: 'Тип движения', enum: TransactionType, enumName: 'TransactionType' })
  type?: TransactionType;

  @ApiPropertyOptional({ description: 'Количество единиц', type: Number })
  quantity?: number;

  @ApiPropertyOptional({ description: 'Дата операции', type: String, format: 'date-time' })
  date?: Date;

  @ApiPropertyOptional({ description: 'Цена за единицу', type: Number })
  price?: number;

  @ApiPropertyOptional({ description: 'Общая стоимость', type: Number })
  totalPrice?: number;

  @ApiPropertyOptional({ description: 'Причина операции' })
  reason?: string;

  @ApiPropertyOptional({ description: 'Номер документа' })
  document?: string;

  @ApiPropertyOptional({ description: 'Поставщик' })
  supplier?: string;

  @ApiPropertyOptional({ description: 'Номер партии' })
  batchNumber?: string;

  @ApiPropertyOptional({ description: 'Срок годности', type: String, format: 'date-time' })
  expiryDate?: Date;

  @ApiPropertyOptional({ description: 'Идентификатор сотрудника' })
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Примечания' })
  notes?: string;
}
