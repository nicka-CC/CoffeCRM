import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateCompanyDto, UpdateCompanyDto } from '../../dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: {
        name: dto.name,
        icon: dto.icon,
        description: dto.description,
        legalName: dto.legalName,
        inn: dto.inn,
        kpp: dto.kpp,
        ogrn: dto.ogrn,
        address: dto.address,
        actualAddress: dto.actualAddress,
        phone: dto.phone,
        email: dto.email,
        website: dto.website,
        director: dto.director,
        accountant: dto.accountant,
        bankName: dto.bankName,
        bankAccount: dto.bankAccount,
        bankBik: dto.bankBik,
        taxSystem: dto.taxSystem,
        logo: dto.logo,
        settings: dto.settings,
        timezone: dto.timezone || 'Europe/Moscow',
        currency: dto.currency || 'RUB',
        language: dto.language || 'ru',
      },
    });
  }

  async findAll() {
    return this.prisma.company.findMany({
      include: {
        PaymentSettings: true,
        Integration: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        PaymentSettings: true,
        Integration: true,
      },
    });

    if (!company) {
      throw new NotFoundException(`Компания с ID ${id} не найдена`);
    }

    return company;
  }

  async update(id: string, dto: UpdateCompanyDto) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Компания с ID ${id} не найдена`);
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.icon !== undefined) data.icon = dto.icon;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.legalName !== undefined) data.legalName = dto.legalName;
    if (dto.inn !== undefined) data.inn = dto.inn;
    if (dto.kpp !== undefined) data.kpp = dto.kpp;
    if (dto.ogrn !== undefined) data.ogrn = dto.ogrn;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.actualAddress !== undefined) data.actualAddress = dto.actualAddress;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.website !== undefined) data.website = dto.website;
    if (dto.director !== undefined) data.director = dto.director;
    if (dto.accountant !== undefined) data.accountant = dto.accountant;
    if (dto.bankName !== undefined) data.bankName = dto.bankName;
    if (dto.bankAccount !== undefined) data.bankAccount = dto.bankAccount;
    if (dto.bankBik !== undefined) data.bankBik = dto.bankBik;
    if (dto.taxSystem !== undefined) data.taxSystem = dto.taxSystem;
    if (dto.logo !== undefined) data.logo = dto.logo;
    if (dto.settings !== undefined) data.settings = dto.settings;
    if (dto.timezone !== undefined) data.timezone = dto.timezone;
    if (dto.currency !== undefined) data.currency = dto.currency;
    if (dto.language !== undefined) data.language = dto.language;

    return this.prisma.company.update({
      where: { id },
      data,
      include: {
        PaymentSettings: true,
        Integration: true,
      },
    });
  }

  async remove(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Компания с ID ${id} не найдена`);
    }

    return this.prisma.company.delete({ where: { id } });
  }
}





