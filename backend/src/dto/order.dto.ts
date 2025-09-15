import { OrderStatus } from '@prisma/client';

export class CreateOrderDto {
  branchId: string;
  customerId?: string;
  status?: OrderStatus;
  total: number;
  items: Array<{ productId: string; quantity: number; price: number }>;

  constructor(
    branchId: string,
    total: number,
    items: Array<{ productId: string; quantity: number; price: number }>,
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
  status?: OrderStatus;
  total?: number;
  items?: Array<{ productId: string; quantity: number; price: number }>;

  constructor(
    status?: OrderStatus,
    total?: number,
    items?: Array<{ productId: string; quantity: number; price: number }>,
  ) {
    this.status = status;
    this.total = total;
    this.items = items;
  }
}
