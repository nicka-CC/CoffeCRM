export interface ProductStockSummary {
  branchId: string;
  branchName: string;
  quantity: number;
}

export interface ProductListItem {
  id: string;
  name: string;
  nameEn?: string | null;
  categoryId: string;
  price: number;
  cost?: number | null;
  oldPrice?: number | null;
  sku?: string | null;
  barcode?: string | null;
  unit?: string | null;
  weight?: number | null;
  volume?: number | null;
  calories?: number | null;
  proteins?: number | null;
  fats?: number | null;
  carbs?: number | null;
  description?: string | null;
  composition?: string | null;
  allergens?: string | null;
  shelfLife?: number | null;
  storageTemp?: string | null;
  imageUrl?: string | null;
  images?: string[] | null;
  icon?: string | null;
  isActive: boolean;
  isIngredient?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  sortOrder?: number;
  tags?: string[] | null;
  category?: {
    id: string;
    name: string;
  } | null;
  stocks?: Array<{
    id: string;
    branchId: string;
    quantity: number;
    reserved?: number;
    minQuantity?: number;
    location?: string | null;
    branch?: {
      id: string;
      name: string;
      city: string;
    } | null;
  }>;
}
