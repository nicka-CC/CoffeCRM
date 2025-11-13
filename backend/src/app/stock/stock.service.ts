import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateStockDto, UpdateStockDto } from '../../dto/stock.dto';
import { CreateStockTransactionDto } from '../../dto/stock-transaction.dto';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStockDto) {
    const existing = await this.prisma.stock.findFirst({
      where: {
        branchId: dto.branchId,
        productId: dto.productId,
      },
    });

    if (existing) {
      return this.prisma.stock.update({
        where: { id: existing.id },
        data: {
          quantity: {
            increment: dto.quantity,
          },
        },
      });
    }

    return this.prisma.stock.create({ data: dto });
  }

  async findAll(query: any) {
    const branchId = query.branchId as string | undefined;
    const productId = query.productId as string | undefined;

    return this.prisma.stock.findMany({
      where: {
        branchId,
        productId,
      },
      include: {
        branch: true,
        product: true,
        transactions: {
          orderBy: {
            date: 'desc',
          },
          take: 5,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const stock = await this.prisma.stock.findUnique({
      where: { id },
      include: {
        branch: true,
        product: true,
        transactions: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!stock) {
      throw new NotFoundException(`Складская позиция с идентификатором ${id} не найдена`);
    }

    return stock;
  }

  async update(id: string, dto: UpdateStockDto) {
    return this.prisma.stock.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.stock.delete({ where: { id } });
  }

  async getInventoryOverview(query?: any) {
    const page = query?.page ? Number(query.page) : undefined;
    const limit = query?.limit ? Number(query.limit) : undefined;
    let take = limit;
    let skip: number | undefined = undefined;
    if (page !== undefined && limit !== undefined) {
      skip = (page - 1) * limit;
    }

    const [stocks, total] = await this.prisma.$transaction([
      this.prisma.stock.findMany({
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              city: true,
              region: true,
              address: true,
              phone: true,
              email: true,
              managerName: true,
              managerPhone: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              nameEn: true,
              categoryId: true,
              price: true,
              cost: true,
              sku: true,
              barcode: true,
              unit: true,
              weight: true,
              volume: true,
              imageUrl: true,
              icon: true,
            },
          },
          transactions: {
            take: 5,
            orderBy: { date: 'desc' },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        skip,
        take,
      }),
      this.prisma.stock.count(),
    ]);

    const mapped = stocks.map((stock) => ({
      id: stock.id,
      branch: {
        id: stock.branchId,
        name: stock.branch.name,
        city: stock.branch.city,
        region: stock.branch.region,
        address: stock.branch.address,
        phone: stock.branch.phone,
        email: stock.branch.email,
        managerName: stock.branch.managerName,
        managerPhone: stock.branch.managerPhone,
      },
      product: {
        id: stock.productId,
        name: stock.product.name,
        nameEn: stock.product.nameEn,
        categoryId: stock.product.categoryId,
        price: stock.product.price,
        cost: stock.product.cost ?? null,
        sku: stock.product.sku,
        barcode: stock.product.barcode,
        unit: stock.product.unit,
        weight: stock.product.weight,
        volume: stock.product.volume,
        imageUrl: stock.product.imageUrl,
        icon: stock.product.icon,
      },
      quantity: stock.quantity,
      reserved: stock.reserved ?? 0,
      available: stock.quantity - (stock.reserved ?? 0),
      minQuantity: stock.minQuantity ?? 0,
      maxQuantity: stock.maxQuantity,
      reorderPoint: stock.reorderPoint,
      location: stock.location,
      batchNumber: stock.batchNumber,
      expiryDate: stock.expiryDate,
      purchasePrice: stock.purchasePrice,
      supplier: stock.supplier,
      lastRestockedAt: stock.lastRestockedAt,
      notes: stock.notes,
      estimatedValue: (stock.purchasePrice ?? stock.product.cost ?? stock.product.price) * stock.quantity,
      isLowStock: stock.quantity <= (stock.minQuantity ?? 0),
      recentTransactions: stock.transactions,
      updatedAt: stock.updatedAt,
    }));

    return {
      data: mapped,
      total,
      page: page ?? (skip !== undefined && take ? Math.floor(skip / take) + 1 : 1),
      limit: take,
    };
  }

  async registerTransaction(dto: CreateStockTransactionDto) {
    return this.prisma.$transaction(async (tx) => {
      const stock = await tx.stock.findUnique({ where: { id: dto.stockId } });

      if (!stock) {
        throw new NotFoundException(`Складская позиция с идентификатором ${dto.stockId} не найдена`);
      }

      let quantityDelta = dto.quantity;

      switch (dto.type) {
        case TransactionType.INCOME:
          // do nothing, delta already positive
          break;
        case TransactionType.EXPENSE:
        case TransactionType.WRITE_OFF:
          quantityDelta = -Math.abs(dto.quantity);
          break;
        default:
          break;
      }

      const updateData: any = {
        quantity: {
          increment: quantityDelta,
        },
      };

      if (dto.type === TransactionType.INCOME) {
        updateData.lastRestockedAt = new Date();
        if (dto.price) {
          updateData.purchasePrice = dto.price;
        }
        if (dto.supplier) {
          updateData.supplier = dto.supplier;
        }
        if (dto.batchNumber) {
          updateData.batchNumber = dto.batchNumber;
        }
        if (dto.expiryDate) {
          updateData.expiryDate = dto.expiryDate;
        }
      }

      const updatedStock = await tx.stock.update({
        where: { id: dto.stockId },
        data: updateData,
        include: {
          branch: true,
          product: true,
        },
      });

      const totalPrice = dto.totalPrice ?? (dto.price ? dto.price * dto.quantity : null);

      const transaction = await tx.stockTransaction.create({
        data: {
          stockId: dto.stockId,
          type: dto.type,
          quantity: dto.quantity,
          date: dto.date ?? new Date(),
          price: dto.price,
          totalPrice,
          reason: dto.reason,
          document: dto.document,
          supplier: dto.supplier,
          batchNumber: dto.batchNumber,
          expiryDate: dto.expiryDate,
          employeeId: dto.employeeId,
          notes: dto.notes,
        },
      });

      return {
        stock: updatedStock,
        transaction,
      };
    });
  }

  async getLowStockAlerts(threshold?: number) {
    const allStocks = await this.prisma.stock.findMany({
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            city: true,
            phone: true,
            email: true,
            managerName: true,
            managerPhone: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            barcode: true,
            unit: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        quantity: 'asc',
      },
    });

    const filteredStocks = allStocks.filter((stock) => {
      const effectiveThreshold = threshold ?? stock.minQuantity ?? 0;
      return stock.quantity <= effectiveThreshold;
    });

    return filteredStocks
      .map((stock) => ({
        stockId: stock.id,
        productName: stock.product.name,
        productSku: stock.product.sku,
        productBarcode: stock.product.barcode,
        productUnit: stock.product.unit,
        productImageUrl: stock.product.imageUrl,
        branchId: stock.branchId,
        branchName: stock.branch.name,
        branchCity: stock.branch.city,
        branchPhone: stock.branch.phone,
        branchEmail: stock.branch.email,
        branchManagerName: stock.branch.managerName,
        branchManagerPhone: stock.branch.managerPhone,
        quantity: stock.quantity,
        reserved: stock.reserved ?? 0,
        available: stock.quantity - (stock.reserved ?? 0),
        minQuantity: stock.minQuantity ?? 0,
        threshold: threshold ?? stock.minQuantity ?? 10,
        reorderPoint: stock.reorderPoint,
        location: stock.location,
      }));
  }
}
