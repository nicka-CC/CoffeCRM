import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateStockDto, UpdateStockDto } from '../../dto/stock.dto';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStockDto) {
    return this.prisma.stock.create({ data: dto });
  }

  async findAll(query: any) {
    return this.prisma.stock.findMany();
  }

  async findOne(id: string) {
    return this.prisma.stock.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateStockDto) {
    return this.prisma.stock.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.stock.delete({ where: { id } });
  }
}
