export class CreateOrderItemDto {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export class UpdateOrderItemDto {
  quantity?: number;
  price?: number;
}
