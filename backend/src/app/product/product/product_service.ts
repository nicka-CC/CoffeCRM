import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Express } from 'express';
import { PrismaService } from '../../../../prisma/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from '../../../dto/product.dto';


@Injectable()
export class ProductService {
  constructor(private prisma:PrismaService) {}



  async create(dto: CreateProductDto, file?: Express.Multer.File) {
    const normalizedDto = this.normalizeDto(dto) as CreateProductDto;
    const data = this.buildCreateData(normalizedDto, file);
    return this.prisma.product.create({ data, include: { category: true } });
  }

  async findAll(query: any) {
    const where: Prisma.ProductWhereInput = {};

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.isActive) {
      where.isActive = query.isActive === 'true';
    }

    if (query.isIngredient !== undefined) {
      // accept both 'true'/'false' strings and boolean
      const val = typeof query.isIngredient === 'string' ? query.isIngredient === 'true' : Boolean(query.isIngredient);
      (where as any).isIngredient = val;
    }

    if (query.search) {
      where.name = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    // pagination
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          stocks: {
            include: {
              branch: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        stocks: {
          include: {
            branch: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateProductDto, file?: Express.Multer.File) {
    const normalizedDto = this.normalizeDto(dto) as UpdateProductDto;
    const data = this.buildUpdateData(normalizedDto, file);
    return this.prisma.product.update({ where: { id }, data, include: { category: true } });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  async getAvailability(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        stocks: {
          include: {
            branch: true,
          },
        },
      },
    });

    if (!product) {
      return [];
    }

    return product.stocks.map((stock) => ({
      branchId: stock.branchId,
      branchName: stock.branch.name,
      quantity: stock.quantity,
    }));
  }

  private buildCreateData(dto: CreateProductDto, file?: Express.Multer.File): Prisma.ProductCreateInput {
    const imagePath = file ? `/uploads/${file.filename}` : dto.imageUrl;
    const icon = dto.icon ?? imagePath ?? undefined;

    const price = this.parseNumber(dto.price);

    const data: Prisma.ProductCreateInput = {
      name: dto.name,
      category: {
        connect: {
          id: dto.categoryId,
        },
      },
      price: price ?? 0,
      isActive: this.parseBoolean(dto.isActive, true) ?? true,
      unit: dto.unit ?? 'шт',
      isPopular: this.parseBoolean(dto.isPopular, false) ?? false,
      isNew: this.parseBoolean(dto.isNew, false) ?? false,
      sortOrder: this.parseNumber(dto.sortOrder) ?? 0,
    };

    if (dto.nameEn) {
      data.nameEn = dto.nameEn;
    }

    const cost = this.parseNumber(dto.cost);
    if (cost !== undefined) {
      data.cost = cost;
    }

    const oldPrice = this.parseNumber(dto.oldPrice);
    if (oldPrice !== undefined) {
      data.oldPrice = oldPrice;
    }

    if (dto.sku) {
      data.sku = dto.sku;
    }

    if (dto.barcode) {
      data.barcode = dto.barcode;
    }

    const weight = this.parseNumber(dto.weight);
    if (weight !== undefined) {
      data.weight = weight;
    }

    const volume = this.parseNumber(dto.volume);
    if (volume !== undefined) {
      data.volume = volume;
    }

    if (dto.calories !== undefined) {
      data.calories = dto.calories;
    }

    const proteins = this.parseNumber(dto.proteins);
    if (proteins !== undefined) {
      data.proteins = proteins;
    }

    const fats = this.parseNumber(dto.fats);
    if (fats !== undefined) {
      data.fats = fats;
    }

    const carbs = this.parseNumber(dto.carbs);
    if (carbs !== undefined) {
      data.carbs = carbs;
    }

    if (dto.description) {
      data.description = dto.description;
    }

    if (dto.composition) {
      data.composition = dto.composition;
    }

    if (dto.allergens) {
      data.allergens = dto.allergens;
    }

    if (dto.shelfLife !== undefined) {
      data.shelfLife = dto.shelfLife;
    }

    if (dto.storageTemp) {
      data.storageTemp = dto.storageTemp;
    }

    if (imagePath) {
      data.imageUrl = imagePath;
      data.icon = icon;
    } else if (icon) {
      data.icon = icon;
    }

    if (dto.tags && Array.isArray(dto.tags)) {
      data.tags = dto.tags;
    }

    return data;
  }

  private buildUpdateData(dto: UpdateProductDto, file?: Express.Multer.File): Prisma.ProductUpdateInput {
    const data: Prisma.ProductUpdateInput = {};

    if (dto.name !== undefined) {
      data.name = dto.name;
    }

    if (dto.nameEn !== undefined) {
      data.nameEn = dto.nameEn;
    }

    if (dto.categoryId !== undefined && dto.categoryId !== '') {
      data.category = {
        connect: {
          id: dto.categoryId,
        },
      };
    }

    if (dto.price !== undefined) {
      data.price = this.parseNumber(dto.price) ?? undefined;
    }

    if (dto.cost !== undefined) {
      data.cost = this.parseNumber(dto.cost);
    }

    if (dto.oldPrice !== undefined) {
      data.oldPrice = this.parseNumber(dto.oldPrice);
    }

    if (dto.sku !== undefined) {
      data.sku = dto.sku;
    }

    if (dto.barcode !== undefined) {
      data.barcode = dto.barcode;
    }

    if (dto.unit !== undefined) {
      data.unit = dto.unit;
    }

    if (dto.weight !== undefined) {
      data.weight = this.parseNumber(dto.weight);
    }

    if (dto.volume !== undefined) {
      data.volume = this.parseNumber(dto.volume);
    }

    if (dto.calories !== undefined) {
      data.calories = dto.calories;
    }

    if (dto.proteins !== undefined) {
      data.proteins = this.parseNumber(dto.proteins);
    }

    if (dto.fats !== undefined) {
      data.fats = this.parseNumber(dto.fats);
    }

    if (dto.carbs !== undefined) {
      data.carbs = this.parseNumber(dto.carbs);
    }

    if (dto.description !== undefined) {
      data.description = dto.description;
    }

    if (dto.composition !== undefined) {
      data.composition = dto.composition;
    }

    if (dto.allergens !== undefined) {
      data.allergens = dto.allergens;
    }

    if (dto.shelfLife !== undefined) {
      data.shelfLife = dto.shelfLife;
    }

    if (dto.storageTemp !== undefined) {
      data.storageTemp = dto.storageTemp;
    }

    if (dto.isActive !== undefined) {
      data.isActive = this.parseBoolean(dto.isActive);
    }

    if (dto.isPopular !== undefined) {
      data.isPopular = this.parseBoolean(dto.isPopular);
    }

    if (dto.isNew !== undefined) {
      data.isNew = this.parseBoolean(dto.isNew);
    }

    if (dto.sortOrder !== undefined) {
      const parsed = this.parseNumber((dto as any).sortOrder);
      const value = parsed ?? undefined; // avoid null
      data.sortOrder = value ?? 0;
    }

    if (dto.tags !== undefined && Array.isArray(dto.tags)) {
      data.tags = dto.tags;
    }

    const imagePath = file ? `/uploads/${file.filename}` : dto.imageUrl || undefined;
    if (imagePath) {
      data.imageUrl = imagePath;
      data.icon = dto.icon ?? imagePath;
    } else if (dto.icon !== undefined) {
      data.icon = dto.icon;
    }

    return data;
  }

  private parseNumber(value: any): number | null | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    const parsed = typeof value === 'number' ? value : parseFloat(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  private parseBoolean(value: any, defaultValue?: boolean): boolean | undefined {
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return defaultValue;
  }

  private normalizeDto(dto: CreateProductDto | UpdateProductDto): CreateProductDto | UpdateProductDto {
    const normalized = { ...dto };

    if ((dto as any).tags) {
      const tagsValue = (dto as any).tags;
      if (Array.isArray(tagsValue)) {
        (normalized as any).tags = tagsValue;
      } else if (typeof tagsValue === 'string') {
        try {
          const parsed = JSON.parse(tagsValue);
          (normalized as any).tags = Array.isArray(parsed) ? parsed : [tagsValue];
        } catch {
          (normalized as any).tags = [tagsValue];
        }
      }
    }

    return normalized;
  }
}