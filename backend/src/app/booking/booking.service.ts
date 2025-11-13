import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto } from '../../dto/booking.dto';
import { BookingStatus, Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookingDto) {
    // Генерируем код подтверждения
    const confirmationCode = this.generateConfirmationCode();

    // Вычисляем продолжительность если не указана
    const duration = dto.duration ?? this.calculateDuration(dto.timeFrom, dto.timeTo);

    // Проверяем конфликты времени
    await this.checkTimeConflict(dto.branchId, dto.timeFrom, dto.timeTo, dto.tableNumber);

    const data: Prisma.BookingCreateInput = {
      branch: { connect: { id: dto.branchId } },
      customer: { connect: { id: dto.customerId } },
      date: dto.date,
      timeFrom: dto.timeFrom,
      timeTo: dto.timeTo,
      duration,
      type: dto.type ?? 'TABLE',
      status: dto.status ?? BookingStatus.PENDING,
      guestsCount: dto.guestsCount ?? 1,
      tableNumber: dto.tableNumber,
      title: dto.title,
      description: dto.description,
      contactName: dto.contactName,
      contactPhone: dto.contactPhone,
      contactEmail: dto.contactEmail,
      specialRequests: dto.specialRequests,
      notes: dto.notes,
      price: dto.price,
      deposit: dto.deposit,
      paymentMethod: dto.paymentMethod,
      isPaid: dto.isPaid ?? false,
      isConfirmed: dto.isConfirmed ?? false,
      confirmationCode,
      reminderDate: dto.reminderDate,
      recurrenceRule: dto.recurrenceRule,
      parentBookingId: dto.parentBookingId,
      source: dto.source,
      tags: dto.tags ?? [],
      ...(dto.employeeId && { employee: { connect: { id: dto.employeeId } } }),
    };

    return this.prisma.booking.create({
      data,
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            phone: true,
            email: true,
          },
        },
        customer: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        employee: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(query: any) {
    const where: Prisma.BookingWhereInput = {};

    if (query.branchId) {
      where.branchId = query.branchId;
    }

    if (query.customerId) {
      where.customerId = query.customerId;
    }

    if (query.status) {
      where.status = query.status as BookingStatus;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.dateFrom || query.dateTo) {
      where.date = {};
      if (query.dateFrom) {
        where.date.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        where.date.lte = new Date(query.dateTo);
      }
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { contactName: { contains: query.search, mode: 'insensitive' } },
        { contactPhone: { contains: query.search, mode: 'insensitive' } },
        { contactEmail: { contains: query.search, mode: 'insensitive' } },
        { tableNumber: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const page = query.page ? Number(query.page) : undefined;
    const limit = query.limit ? Number(query.limit) : undefined;
    const take = limit;
    const skip = page && limit ? (page - 1) * limit : undefined;

    const [bookings, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where,
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              phone: true,
            },
          },
          customer: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
          employee: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
        },
        orderBy: { date: 'asc' },
        take,
        skip,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      total,
      page: page ?? (skip !== undefined && take ? Math.floor(skip / take) + 1 : 1),
      limit: take,
    };
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            phone: true,
            email: true,
            openTime: true,
            closeTime: true,
          },
        },
        customer: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        employee: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
            branch: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Бронирование с ID ${id} не найдено`);
    }

    return booking;
  }

  async update(id: string, dto: UpdateBookingDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Бронирование с ID ${id} не найдено`);
    }

    const data: Prisma.BookingUpdateInput = {};

    if (dto.employeeId !== undefined) {
      data.employee = dto.employeeId ? { connect: { id: dto.employeeId } } : { disconnect: true };
    }

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.date !== undefined) data.date = dto.date;
    if (dto.timeFrom !== undefined) data.timeFrom = dto.timeFrom;
    if (dto.timeTo !== undefined) data.timeTo = dto.timeTo;
    if (dto.duration !== undefined) data.duration = dto.duration;
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.guestsCount !== undefined) data.guestsCount = dto.guestsCount;
    if (dto.tableNumber !== undefined) data.tableNumber = dto.tableNumber;
    if (dto.contactName !== undefined) data.contactName = dto.contactName;
    if (dto.contactPhone !== undefined) data.contactPhone = dto.contactPhone;
    if (dto.contactEmail !== undefined) data.contactEmail = dto.contactEmail;
    if (dto.specialRequests !== undefined) data.specialRequests = dto.specialRequests;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.deposit !== undefined) data.deposit = dto.deposit;
    if (dto.paymentMethod !== undefined) data.paymentMethod = dto.paymentMethod;
    if (dto.isPaid !== undefined) data.isPaid = dto.isPaid;
    if (dto.isConfirmed !== undefined) data.isConfirmed = dto.isConfirmed;
    if (dto.reminderDate !== undefined) data.reminderDate = dto.reminderDate;
    if (dto.recurrenceRule !== undefined) data.recurrenceRule = dto.recurrenceRule;
    if (dto.source !== undefined) data.source = dto.source;
    if (dto.tags !== undefined) data.tags = dto.tags;

    // Если статус меняется на CANCELED
    if (dto.status === BookingStatus.CANCELED) {
      data.cancelledAt = new Date();
    }

    // Если статус меняется на COMPLETED
    if (dto.status === BookingStatus.COMPLETED) {
      data.completedAt = new Date();
    }

    return this.prisma.booking.update({
      where: { id },
      data,
      include: {
        branch: true,
        customer: {
          include: {
            user: true,
          },
        },
        employee: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Бронирование с ID ${id} не найдено`);
    }

    return this.prisma.booking.delete({ where: { id } });
  }

  async getCalendar(query: { branchId?: string; startDate: string; endDate: string }) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    const where: Prisma.BookingWhereInput = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (query.branchId) {
      where.branchId = query.branchId;
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        customer: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                phone: true,
              },
            },
          },
        },
        employee: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
      orderBy: {
        timeFrom: 'asc',
      },
    });
  }

  async confirm(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Бронирование с ID ${id} не найдено`);
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CONFIRMED,
        isConfirmed: true,
      },
      include: {
        branch: true,
        customer: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async cancel(id: string, reason?: string, cancelledBy?: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Бронирование с ID ${id} не найдено`);
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELED,
        cancelledAt: new Date(),
        cancellationReason: reason,
        cancelledBy,
      },
      include: {
        branch: true,
        customer: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async complete(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Бронирование с ID ${id} не найдено`);
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.COMPLETED,
        completedAt: new Date(),
      },
      include: {
        branch: true,
        customer: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  private generateConfirmationCode(): string {
    return randomBytes(4).toString('hex').toUpperCase();
  }

  private calculateDuration(timeFrom: Date, timeTo: Date): number {
    const diff = new Date(timeTo).getTime() - new Date(timeFrom).getTime();
    return Math.round(diff / (1000 * 60)); // в минутах
  }

  private async checkTimeConflict(
    branchId: string,
    timeFrom: Date,
    timeTo: Date,
    tableNumber?: string,
  ): Promise<void> {
    const conflict = await this.prisma.booking.findFirst({
      where: {
        branchId,
        ...(tableNumber && { tableNumber }),
        status: {
          not: BookingStatus.CANCELED,
        },
        OR: [
          {
            AND: [
              { timeFrom: { lte: new Date(timeFrom) } },
              { timeTo: { gt: new Date(timeFrom) } },
            ],
          },
          {
            AND: [
              { timeFrom: { lt: new Date(timeTo) } },
              { timeTo: { gte: new Date(timeTo) } },
            ],
          },
          {
            AND: [
              { timeFrom: { gte: new Date(timeFrom) } },
              { timeTo: { lte: new Date(timeTo) } },
            ],
          },
        ],
      },
    });

    if (conflict) {
      throw new BadRequestException('В это время уже есть бронирование');
    }
  }
}
