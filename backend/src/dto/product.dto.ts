export class CreateProductDto {
  name: string;
  categoryId: string;
  price: number;
  isActive?: boolean;
}

export class UpdateProductDto {
  name?: string;
  categoryId?: string;
  price?: number;
  isActive?: boolean;
}
