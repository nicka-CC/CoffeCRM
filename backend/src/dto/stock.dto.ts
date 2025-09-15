export class CreateStockDto {
  branchId: string;
  productId: string;
  quantity: number;
}

export class UpdateStockDto {
  quantity?: number;
}
