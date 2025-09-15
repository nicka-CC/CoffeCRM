import { BookingStatus } from '@prisma/client';

export class CreateBookingDto {
  branchId: string;
  customerId: string;
  date: Date;
  timeFrom: Date;
  timeTo: Date;
  type: string;
  status?: BookingStatus;
}

export class UpdateBookingDto {
  date?: Date;
  timeFrom?: Date;
  timeTo?: Date;
  type?: string;
  status?: BookingStatus;
}
