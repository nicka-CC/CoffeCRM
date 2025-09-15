import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateBranchDto, UpdateBranchDto } from '../../dto/branch.dto';

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBranchDto) {
    return this.prisma.branch.create({ data: dto });
  }

  async findAll(query: any) {
    return this.prisma.branch.findMany();
  }

  async findOne(id: string) {
    return this.prisma.branch.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateBranchDto) {
    return this.prisma.branch.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.branch.delete({ where: { id } });
  }
}
