import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from '../../dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    // TODO: реализовать создание заказа с учетом связей и позиций
    return this.prisma.order.create({
      data: {
        branchId: dto.branchId,
        customerId: dto.customerId,
        status: dto.status,
        total: dto.total,
        items: {
          create: dto.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });
  }

  async findAll(query: any) {
    // TODO: добавить фильтрацию по query
    return this.prisma.order.findMany({
      include: { items: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async update(id: string, dto: UpdateOrderDto) {
    // TODO: реализовать обновление позиций заказа
    return this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
        total: dto.total,
      },
      include: { items: true },
    });
  }

  async remove(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
