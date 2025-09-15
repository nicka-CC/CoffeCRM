import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto } from '../../dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookingDto) {
    return this.prisma.booking.create({ data: dto });
  }

  async findAll(query: any) {
    return this.prisma.booking.findMany();
  }

  async findOne(id: string) {
    return this.prisma.booking.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateBookingDto) {
    return this.prisma.booking.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.booking.delete({ where: { id } });
  }
}
