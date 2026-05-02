import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreatePaymentSettingsDto, UpdatePaymentSettingsDto } from '../../dto/payment-settings.dto';

@Injectable()
export class PaymentSettingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentSettingsDto) {
    const company = await this.prisma.company.findUnique({ where: { id: dto.companyId } });
    if (!company) {
      throw new NotFoundException(`Компания с ID ${dto.companyId} не найдена`);
    }

    return this.prisma.paymentSettings.create({
      data: {
        companyId: dto.companyId,
        icon: dto.icon,
        provider: dto.provider,
        name: dto.name,
        apiKey: dto.apiKey,
        secretKey: dto.secretKey,
        merchantId: dto.merchantId,
        terminalId: dto.terminalId,
        isActive: dto.isActive ?? true,
        isTest: dto.isTest ?? false,
        commission: dto.commission,
        minAmount: dto.minAmount,
        maxAmount: dto.maxAmount,
        webhookUrl: dto.webhookUrl,
        settings: dto.settings,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(companyId?: string) {
    const where: any = {};
    if (companyId) {
      where.companyId = companyId;
    }

    return this.prisma.paymentSettings.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const settings = await this.prisma.paymentSettings.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!settings) {
      throw new NotFoundException(`Настройки платежей с ID ${id} не найдены`);
    }

    return settings;
  }

  async update(id: string, dto: UpdatePaymentSettingsDto) {
    const settings = await this.prisma.paymentSettings.findUnique({ where: { id } });
    if (!settings) {
      throw new NotFoundException(`Настройки платежей с ID ${id} не найдены`);
    }

    const data: any = {};
    if (dto.icon !== undefined) data.icon = dto.icon;
    if (dto.provider !== undefined) data.provider = dto.provider;
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.apiKey !== undefined) data.apiKey = dto.apiKey;
    if (dto.secretKey !== undefined) data.secretKey = dto.secretKey;
    if (dto.merchantId !== undefined) data.merchantId = dto.merchantId;
    if (dto.terminalId !== undefined) data.terminalId = dto.terminalId;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.isTest !== undefined) data.isTest = dto.isTest;
    if (dto.commission !== undefined) data.commission = dto.commission;
    if (dto.minAmount !== undefined) data.minAmount = dto.minAmount;
    if (dto.maxAmount !== undefined) data.maxAmount = dto.maxAmount;
    if (dto.webhookUrl !== undefined) data.webhookUrl = dto.webhookUrl;
    if (dto.settings !== undefined) data.settings = dto.settings;

    return this.prisma.paymentSettings.update({
      where: { id },
      data,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const settings = await this.prisma.paymentSettings.findUnique({ where: { id } });
    if (!settings) {
      throw new NotFoundException(`Настройки платежей с ID ${id} не найдены`);
    }

    return this.prisma.paymentSettings.delete({ where: { id } });
  }
}





