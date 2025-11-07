export interface StockOverviewItem {
  id: string;
  branch: {
    id: string;
    name: string;
    city: string;
    region?: string | null;
    address: string;
    phone?: string | null;
    email?: string | null;
    managerName?: string | null;
    managerPhone?: string | null;
  };
  product: {
    id: string;
    name: string;
    nameEn?: string | null;
    categoryId: string;
    price: number;
    cost?: number | null;
    sku?: string | null;
    barcode?: string | null;
    unit?: string | null;
    weight?: number | null;
    volume?: number | null;
    imageUrl?: string | null;
    icon?: string | null;
  };
  quantity: number;
  reserved?: number;
  available?: number;
  minQuantity?: number;
  maxQuantity?: number | null;
  reorderPoint?: number | null;
  location?: string | null;
  batchNumber?: string | null;
  expiryDate?: string | null;
  purchasePrice?: number | null;
  supplier?: string | null;
  lastRestockedAt?: string | null;
  notes?: string | null;
  estimatedValue: number;
  isLowStock?: boolean;
  recentTransactions?: Array<{
    id: string;
    type: string;
    quantity: number;
    date: string;
    price?: number | null;
    totalPrice?: number | null;
    reason?: string | null;
    document?: string | null;
  }>;
  updatedAt: string;
}

export interface LowStockAlert {
  stockId: string;
  productName: string;
  productSku?: string | null;
  productBarcode?: string | null;
  productUnit?: string | null;
  productImageUrl?: string | null;
  branchId: string;
  branchName: string;
  branchCity?: string | null;
  branchPhone?: string | null;
  branchEmail?: string | null;
  branchManagerName?: string | null;
  branchManagerPhone?: string | null;
  quantity: number;
  reserved?: number;
  available?: number;
  minQuantity: number;
  threshold: number;
  reorderPoint?: number | null;
  location?: string | null;
}
