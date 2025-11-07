import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({ description: 'Идентификатор заказа' })
  orderId: string;

  @ApiProperty({ description: 'Идентификатор товара' })
  productId: string;

  @ApiProperty({ description: 'Количество единиц товара', type: Number })
  quantity: number;

  @ApiProperty({ description: 'Цена позиции', type: Number })
  price: number;
}

export class UpdateOrderItemDto {
  @ApiPropertyOptional({ description: 'Количество единиц товара', type: Number })
  quantity?: number;

  @ApiPropertyOptional({ description: 'Цена позиции', type: Number })
  price?: number;
}
