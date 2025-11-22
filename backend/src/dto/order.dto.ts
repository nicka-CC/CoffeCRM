import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, TransactionType } from '@prisma/client';

class OrderItemInputDto {
  @ApiProperty({ description: 'Идентификатор товара' })
  productId: string;

  @ApiProperty({ description: 'Количество товара', type: Number })
  quantity: number;

  @ApiProperty({ description: 'Цена товара в заказе', type: Number })
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Идентификатор филиала, где оформлен заказ' })
  branchId: string;

  @ApiPropertyOptional({ description: 'Идентификатор клиента' })
  customerId?: string;

  @ApiPropertyOptional({ description: 'Статус заказа', enum: OrderStatus, enumName: 'OrderStatus' })
  status?: OrderStatus;

  @ApiPropertyOptional({ description: 'Тип операции по складу (INCOME = приход, EXPENSE = расход)', enum: TransactionType, enumName: 'TransactionType' })
  type?: TransactionType;

  @ApiProperty({ description: 'Итоговая сумма заказа', type: Number })
  total: number;

  @ApiProperty({ description: 'Состав заказа', type: [OrderItemInputDto] })
  items: OrderItemInputDto[];

  constructor(
    branchId: string,
    total: number,
    items: OrderItemInputDto[],
    customerId?: string,
    status?: OrderStatus,
  ) {
    this.branchId = branchId;
    this.total = total;
    this.items = items;
    this.customerId = customerId;
    this.status = status;
  }
}

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: 'Статус заказа', enum: OrderStatus, enumName: 'OrderStatus' })
  status?: OrderStatus;

  @ApiPropertyOptional({ description: 'Тип операции по складу (INCOME = приход, EXPENSE = расход)', enum: TransactionType, enumName: 'TransactionType' })
  type?: TransactionType;

  @ApiPropertyOptional({ description: 'Итоговая сумма заказа', type: Number })
  total?: number;

  @ApiPropertyOptional({ description: 'Актуализированный состав заказа', type: [OrderItemInputDto] })
  items?: OrderItemInputDto[];

  constructor(status?: OrderStatus, total?: number, items?: OrderItemInputDto[]) {
    this.status = status;
    this.total = total;
    this.items = items;
  }
}
