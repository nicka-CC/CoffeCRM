import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiConsumes } from '@nestjs/swagger';
import { ProductService } from './product_service';
import { CreateProductDto, UpdateProductDto } from '../../../dto/product.dto';
import { Express, Request } from 'express';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileName = `${uniqueSuffix}${extname(file.originalname)}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  create(@Body() dto: CreateProductDto, @UploadedFile() file?: Express.Multer.File, @Req() req?: Request) {
    const normalizedDto = this.normalizeFormData(dto, req) as CreateProductDto;
    return this.productService.create(normalizedDto, file);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get(':id/availability')
  getAvailability(@Param('id') id: string) {
    return this.productService.getAvailability(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileName = `${uniqueSuffix}${extname(file.originalname)}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @UploadedFile() file?: Express.Multer.File, @Req() req?: Request) {
    const normalizedDto = this.normalizeFormData(dto, req) as UpdateProductDto;
    return this.productService.update(id, normalizedDto, file);
  }

  private normalizeFormData(dto: CreateProductDto | UpdateProductDto, req?: Request): CreateProductDto | UpdateProductDto {
    const normalized = { ...dto } as any;

    if (req?.body) {
      const body = req.body as any;
      if (body.tags || body['tags[]']) {
        const tags = body.tags || body['tags[]'];
        if (Array.isArray(tags)) {
          normalized.tags = tags;
        } else if (typeof tags === 'string') {
          try {
            const parsed = JSON.parse(tags);
            normalized.tags = Array.isArray(parsed) ? parsed : [tags];
          } catch {
            normalized.tags = tags.split(',').map((t: string) => t.trim()).filter(Boolean);
          }
        }
      }
    }

    return normalized;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
