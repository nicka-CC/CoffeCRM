export interface BranchStats {
  revenue: number;
  orders: number;
  employees: number;
  stockQuantity: number;
}

export interface BranchSummary {
  id: string;
  name: string;
  address: string;
  city: string;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
  openTime?: string | null;
  closeTime?: string | null;
  isActive?: boolean;
  managerName?: string | null;
  managerPhone?: string | null;
  area?: number | null;
  capacity?: number | null;
  description?: string | null;
  createdAt?: string;
  stats?: BranchStats;
}

export interface BranchDetails {
  branch: {
    id: string;
    name: string;
    address: string;
    city: string;
    region?: string | null;
    postalCode?: string | null;
    country?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    timezone?: string | null;
    openTime?: string | null;
    closeTime?: string | null;
    isActive?: boolean;
    managerName?: string | null;
    managerPhone?: string | null;
    area?: number | null;
    capacity?: number | null;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  sales: {
    revenue: number;
    ordersCount: number;
    averageCheck: number;
    latestOrders: Array<{
      id: string;
      total: number;
      status: string;
      createdAt: string;
      customer: {
        id: string;
        name?: string | null;
        phone?: string | null;
      } | null;
    }>;
  };
  inventory: Array<{
    stockId: string;
    productId: string;
    productName: string;
    quantity: number;
  }>;
  employees: Array<{
    id: string;
    fullName?: string | null;
    position?: string | null;
    salary?: number | null;
    phone?: string | null;
    email?: string | null;
  }>;
}
