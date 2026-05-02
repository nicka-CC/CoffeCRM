import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateIntegrationDto, UpdateIntegrationDto } from '../../dto/integration.dto';

@Injectable()
export class IntegrationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateIntegrationDto) {
    const company = await this.prisma.company.findUnique({ where: { id: dto.companyId } });
    if (!company) {
      throw new NotFoundException(`Компания с ID ${dto.companyId} не найдена`);
    }

    return this.prisma.integration.create({
      data: {
        companyId: dto.companyId,
        icon: dto.icon,
        name: dto.name,
        type: dto.type,
        provider: dto.provider,
        apiKey: dto.apiKey,
        apiSecret: dto.apiSecret,
        apiUrl: dto.apiUrl,
        webhookUrl: dto.webhookUrl,
        isActive: dto.isActive ?? true,
        isTest: dto.isTest ?? false,
        settings: dto.settings,
        syncStatus: 'PENDING',
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

    return this.prisma.integration.findMany({
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
    const integration = await this.prisma.integration.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!integration) {
      throw new NotFoundException(`Интеграция с ID ${id} не найдена`);
    }

    return integration;
  }

  async update(id: string, dto: UpdateIntegrationDto) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });
    if (!integration) {
      throw new NotFoundException(`Интеграция с ID ${id} не найдена`);
    }

    const data: any = {};
    if (dto.icon !== undefined) data.icon = dto.icon;
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.provider !== undefined) data.provider = dto.provider;
    if (dto.apiKey !== undefined) data.apiKey = dto.apiKey;
    if (dto.apiSecret !== undefined) data.apiSecret = dto.apiSecret;
    if (dto.apiUrl !== undefined) data.apiUrl = dto.apiUrl;
    if (dto.webhookUrl !== undefined) data.webhookUrl = dto.webhookUrl;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.isTest !== undefined) data.isTest = dto.isTest;
    if (dto.settings !== undefined) data.settings = dto.settings;

    return this.prisma.integration.update({
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

  async sync(id: string) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });
    if (!integration) {
      throw new NotFoundException(`Интеграция с ID ${id} не найдена`);
    }

    // Обновляем статус синхронизации
    await this.prisma.integration.update({
      where: { id },
      data: {
        syncStatus: 'SYNCING',
        lastSyncAt: new Date(),
      },
    });

    // Здесь должна быть логика синхронизации в зависимости от типа интеграции
    // Для примера просто обновляем статус

    return this.prisma.integration.update({
      where: { id },
      data: {
        syncStatus: 'SUCCESS',
        lastSyncAt: new Date(),
        errorMessage: null,
      },
    });
  }

  async remove(id: string) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });
    if (!integration) {
      throw new NotFoundException(`Интеграция с ID ${id} не найдена`);
    }

    return this.prisma.integration.delete({ where: { id } });
  }
}





