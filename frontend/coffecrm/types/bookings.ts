export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';
export type BookingType = 'TABLE' | 'EVENT' | 'MEETING' | 'PRIVATE' | 'OTHER';
export type PaymentMethod = 'CASH' | 'CARD' | 'ONLINE' | 'BONUS' | 'FREE';

export interface Booking {
  id: string;
  branchId: string;
  customerId: string;
  employeeId?: string | null;
  title?: string | null;
  description?: string | null;
  date: string;
  timeFrom: string;
  timeTo: string;
  duration?: number | null;
  type: BookingType;
  status: BookingStatus;
  guestsCount: number;
  tableNumber?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  specialRequests?: string | null;
  notes?: string | null;
  price?: number | null;
  deposit?: number | null;
  paymentMethod?: PaymentMethod | null;
  isPaid: boolean;
  isConfirmed: boolean;
  confirmationCode?: string | null;
  reminderSent: boolean;
  reminderDate?: string | null;
  cancelledAt?: string | null;
  cancelledBy?: string | null;
  cancellationReason?: string | null;
  completedAt?: string | null;
  recurrenceRule?: string | null;
  parentBookingId?: string | null;
  source?: string | null;
  tags?: string[] | null;
  createdAt: string;
  updatedAt: string;
  branch?: {
    id: string;
    name: string;
    address: string;
    city: string;
    phone?: string | null;
    email?: string | null;
    openTime?: string | null;
    closeTime?: string | null;
  };
  customer?: {
    id: string;
    user?: {
      id: string;
      fullName: string;
      email: string;
      phone?: string | null;
    };
  };
  employee?: {
    id: string;
    user?: {
      id: string;
      fullName: string;
      email?: string | null;
      phone?: string | null;
    };
    branch?: {
      id: string;
      name: string;
    };
  } | null;
}

export interface CreateBookingDto {
  branchId: string;
  customerId: string;
  employeeId?: string;
  title?: string;
  description?: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  duration?: number;
  type?: BookingType;
  status?: BookingStatus;
  guestsCount?: number;
  tableNumber?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  specialRequests?: string;
  notes?: string;
  price?: number;
  deposit?: number;
  paymentMethod?: PaymentMethod;
  isPaid?: boolean;
  isConfirmed?: boolean;
  reminderDate?: string;
  cancellationReason?: string;
  recurrenceRule?: string;
  parentBookingId?: string;
  source?: string;
  tags?: string[];
}

export interface UpdateBookingDto {
  employeeId?: string;
  title?: string;
  description?: string;
  date?: string;
  timeFrom?: string;
  timeTo?: string;
  duration?: number;
  type?: BookingType;
  status?: BookingStatus;
  guestsCount?: number;
  tableNumber?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  specialRequests?: string;
  notes?: string;
  price?: number;
  deposit?: number;
  paymentMethod?: PaymentMethod;
  isPaid?: boolean;
  isConfirmed?: boolean;
  reminderDate?: string;
  cancellationReason?: string;
  recurrenceRule?: string;
  source?: string;
  tags?: string[];
}


