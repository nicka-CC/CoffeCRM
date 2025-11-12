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
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
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
  status?: OrderStatus;
  total: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  total?: number;
  items?: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}


