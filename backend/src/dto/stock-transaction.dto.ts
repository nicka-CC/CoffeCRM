export class CreateStockTransactionDto {
  stockId: string;
  type: string;
  quantity: number;
  date?: Date;
}

export class UpdateStockTransactionDto {
  type?: string;
  quantity?: number;
  date?: Date;
}
