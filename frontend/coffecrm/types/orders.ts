export type OrderStatus = 'NEW' | 'IN_PROGRESS' | 'READY' | 'COMPLETED' | 'CANCELED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    imageUrl?: string | null;
    icon?: string | null;
  };
}

export interface Order {
  id: string;
  branchId: string;
  customerId?: string | null;
  type?: 'INCOME' | 'EXPENSE' | 'WRITE_OFF';
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  stockTransactions?: StockTransaction[];
  branch?: {
    id: string;
    name: string;
    address: string;
    city: string;
  };
  customer?: {
    id: string;
    user?: {
      id: string;
      fullName: string;
      phone?: string | null;
      email: string;
    };
  } | null;
}

export interface CreateOrderDto {
  branchId: string;
  customerId?: string;
  type?: 'INCOME' | 'EXPENSE' | 'WRITE_OFF';
  status?: OrderStatus;
  total: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export interface UpdateOrderDto {
  type?: 'INCOME' | 'EXPENSE' | 'WRITE_OFF';
  status?: OrderStatus;
  total?: number;
  items?: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export interface StockTransaction {
  id: string;
  stockId: string;
  type: 'INCOME' | 'EXPENSE' | 'WRITE_OFF';
  quantity: number;
  date: string;
  price?: number | null;
  totalPrice?: number | null;
  reason?: string | null;
  document?: string | null;
  supplier?: string | null;
  batchNumber?: string | null;
  expiryDate?: string | null;
  employeeId?: string | null;
  notes?: string | null;
  orderId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}


