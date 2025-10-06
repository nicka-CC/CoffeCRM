import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from '../../../../prisma/prisma/prisma.service';
import { UpdateUserDto, SearchUsersDto } from "../../../dto/user.dro";

@Injectable()
export class UserService {
  constructor(private prisma:PrismaService) {}
  
  async getUserInfo(userId: string) {
    // Подключаем реальные связи из Prisma-схемы: employee и customer
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        employee: {
          include: {
            branch: true,
            kpis: true
          }
        },
        customer: {
          include: {
            orders: true,
            bookings: true
          }
        }
      },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    // Не возвращаем пароль
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    // Не вручную обновляем поле updatedAt — Prisma сделает это автоматически
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
      },
      include: {
        employee: true,
        customer: true,
      },
    });

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Пользователь успешно удалён' };
  }

  async getAllUsers(searchDto: SearchUsersDto) {
    const { name, page = '0', limit = '10' } = searchDto;
    const skip = parseInt(page) * parseInt(limit);
    const take = parseInt(limit);

    // В Prisma модель User имеет поле `fullName`, используем его при поиске
    const where = name ? {
      OR: [
        { fullName: { contains: name, mode: 'insensitive' as const } },
        { email: { contains: name, mode: 'insensitive' as const } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        include: {
          employee: true,
          customer: true,
        },
        // Prisma schema uses `createdAt` for creation timestamp
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count({ where })
    ]);

    // Убираем пароли из всех пользователей
    const safeUsers = users.map(({ password, ...user }) => user);

    return {
      users: safeUsers,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    };
  }
}