export interface Customer {
  id: string;
  userId: string;
  bonus: number;
  totalSpent: number;
  totalOrders: number;
  averageCheck?: number | null;
  lastOrderDate?: string | null;
  favoriteProduct?: string | null;
  favoriteBranch?: string | null;
  discountPercent?: number | null;
  vipStatus: boolean;
  notes?: string | null;
  tags?: string[] | null;
  source?: string | null;
  referralCode?: string | null;
  referredBy?: string | null;
  birthday?: string | null;
  preferences?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
    icon?: string | null;
    role: string;
  };
  orders?: Array<{
    id: string;
    total: number;
    createdAt: string;
    status: string;
  }>;
}

export interface BonusTransaction {
  id: string;
  customerId: string;
  type: 'EARNED' | 'SPENT' | 'EXPIRED' | 'ADJUSTED';
  amount: number;
  orderId?: string | null;
  description?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: string;
    total: number;
    createdAt: string;
  } | null;
}

export interface CreateCustomerDto {
  userId: string;
  bonus?: number;
  discountPercent?: number;
  vipStatus?: boolean;
  notes?: string;
  tags?: string[];
  source?: string;
  birthday?: string;
  preferences?: string;
}

export interface UpdateCustomerDto {
  bonus?: number;
  discountPercent?: number;
  vipStatus?: boolean;
  favoriteProduct?: string;
  favoriteBranch?: string;
  notes?: string;
  tags?: string[];
  birthday?: string;
  preferences?: string;
}

export interface AddBonusDto {
  amount: number;
  orderId?: string;
  description?: string;
  expiresAt?: string;
}

export interface SpendBonusDto {
  amount: number;
  orderId?: string;
  description?: string;
}

export interface CustomerStatistics {
  totalSpent: number;
  totalOrders: number;
  completedOrders: number;
  averageCheck: number;
  currentBonus: number;
  earnedBonuses: number;
  spentBonuses: number;
  lastOrderDate?: string | null;
  vipStatus: boolean;
  discountPercent?: number | null;
}



