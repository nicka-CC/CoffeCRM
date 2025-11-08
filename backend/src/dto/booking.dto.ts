import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus, BookingType, PaymentMethod } from '@prisma/client';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID филиала' })
  branchId: string;

  @ApiProperty({ description: 'ID клиента' })
  customerId: string;

  @ApiPropertyOptional({ description: 'ID сотрудника, который обслуживает' })
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Название/описание бронирования' })
  title?: string;

  @ApiPropertyOptional({ description: 'Описание события' })
  description?: string;

  @ApiProperty({ description: 'Дата бронирования', type: String, format: 'date-time' })
  date: Date;

  @ApiProperty({ description: 'Время начала', type: String, format: 'date-time' })
  timeFrom: Date;

  @ApiProperty({ description: 'Время окончания', type: String, format: 'date-time' })
  timeTo: Date;

  @ApiPropertyOptional({ description: 'Продолжительность в минутах', type: Number })
  duration?: number;

  @ApiPropertyOptional({ description: 'Тип бронирования', enum: BookingType, default: BookingType.TABLE })
  type?: BookingType;

  @ApiPropertyOptional({ description: 'Статус бронирования', enum: BookingStatus, default: BookingStatus.PENDING })
  status?: BookingStatus;

  @ApiPropertyOptional({ description: 'Количество гостей', type: Number, default: 1 })
  guestsCount?: number;

  @ApiPropertyOptional({ description: 'Номер стола' })
  tableNumber?: string;

  @ApiPropertyOptional({ description: 'Контактное имя' })
  contactName?: string;

  @ApiPropertyOptional({ description: 'Контактный телефон' })
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Контактный email' })
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Особые пожелания' })
  specialRequests?: string;

  @ApiPropertyOptional({ description: 'Внутренние заметки' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Стоимость бронирования', type: Number })
  price?: number;

  @ApiPropertyOptional({ description: 'Предоплата', type: Number })
  deposit?: number;

  @ApiPropertyOptional({ description: 'Способ оплаты', enum: PaymentMethod })
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ description: 'Оплачено ли', default: false })
  isPaid?: boolean;

  @ApiPropertyOptional({ description: 'Подтверждено клиентом', default: false })
  isConfirmed?: boolean;

  @ApiPropertyOptional({ description: 'Дата напоминания', type: String, format: 'date-time' })
  reminderDate?: Date;

  @ApiPropertyOptional({ description: 'Причина отмены' })
  cancellationReason?: string;

  @ApiPropertyOptional({ description: 'Правило повтора (RRULE format)' })
  recurrenceRule?: string;

  @ApiPropertyOptional({ description: 'ID родительского бронирования' })
  parentBookingId?: string;

  @ApiPropertyOptional({ description: 'Источник бронирования' })
  source?: string;

  @ApiPropertyOptional({ description: 'Теги', type: [String] })
  tags?: string[];
}

export class UpdateBookingDto {
  @ApiPropertyOptional({ description: 'ID сотрудника' })
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Название/описание бронирования' })
  title?: string;

  @ApiPropertyOptional({ description: 'Описание события' })
  description?: string;

  @ApiPropertyOptional({ description: 'Дата бронирования', type: String, format: 'date-time' })
  date?: Date;

  @ApiPropertyOptional({ description: 'Время начала', type: String, format: 'date-time' })
  timeFrom?: Date;

  @ApiPropertyOptional({ description: 'Время окончания', type: String, format: 'date-time' })
  timeTo?: Date;

  @ApiPropertyOptional({ description: 'Продолжительность в минутах', type: Number })
  duration?: number;

  @ApiPropertyOptional({ description: 'Тип бронирования', enum: BookingType })
  type?: BookingType;

  @ApiPropertyOptional({ description: 'Статус бронирования', enum: BookingStatus })
  status?: BookingStatus;

  @ApiPropertyOptional({ description: 'Количество гостей', type: Number })
  guestsCount?: number;

  @ApiPropertyOptional({ description: 'Номер стола' })
  tableNumber?: string;

  @ApiPropertyOptional({ description: 'Контактное имя' })
  contactName?: string;

  @ApiPropertyOptional({ description: 'Контактный телефон' })
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Контактный email' })
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Особые пожелания' })
  specialRequests?: string;

  @ApiPropertyOptional({ description: 'Внутренние заметки' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Стоимость бронирования', type: Number })
  price?: number;

  @ApiPropertyOptional({ description: 'Предоплата', type: Number })
  deposit?: number;

  @ApiPropertyOptional({ description: 'Способ оплаты', enum: PaymentMethod })
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ description: 'Оплачено ли' })
  isPaid?: boolean;

  @ApiPropertyOptional({ description: 'Подтверждено клиентом' })
  isConfirmed?: boolean;

  @ApiPropertyOptional({ description: 'Дата напоминания', type: String, format: 'date-time' })
  reminderDate?: Date;

  @ApiPropertyOptional({ description: 'Причина отмены' })
  cancellationReason?: string;

  @ApiPropertyOptional({ description: 'Правило повтора (RRULE format)' })
  recurrenceRule?: string;

  @ApiPropertyOptional({ description: 'Источник бронирования' })
  source?: string;

  @ApiPropertyOptional({ description: 'Теги', type: [String] })
  tags?: string[];
}
