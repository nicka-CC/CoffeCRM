import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Название товара' })
  name: string;

  @ApiPropertyOptional({ description: 'Название товара на английском' })
  nameEn?: string;

  @ApiProperty({ description: 'Идентификатор категории товара' })
  categoryId: string;

  @ApiProperty({ description: 'Цена продажи', type: Number })
  price: number;

  @ApiPropertyOptional({ description: 'Себестоимость товара', type: Number })
  cost?: number;

  @ApiPropertyOptional({ description: 'Старая цена', type: Number })
  oldPrice?: number;

  @ApiPropertyOptional({ description: 'Артикул' })
  sku?: string;

  @ApiPropertyOptional({ description: 'Штрихкод' })
  barcode?: string;

  @ApiPropertyOptional({ description: 'Единица измерения', default: 'шт' })
  unit?: string;

  @ApiPropertyOptional({ description: 'Вес в граммах', type: Number })
  weight?: number;

  @ApiPropertyOptional({ description: 'Объем в мл', type: Number })
  volume?: number;

  @ApiPropertyOptional({ description: 'Калории', type: Number })
  calories?: number;

  @ApiPropertyOptional({ description: 'Белки', type: Number })
  proteins?: number;

  @ApiPropertyOptional({ description: 'Жиры', type: Number })
  fats?: number;

  @ApiPropertyOptional({ description: 'Углеводы', type: Number })
  carbs?: number;

  @ApiPropertyOptional({ description: 'Описание товара' })
  description?: string;

  @ApiPropertyOptional({ description: 'Состав' })
  composition?: string;

  @ApiPropertyOptional({ description: 'Аллергены' })
  allergens?: string;

  @ApiPropertyOptional({ description: 'Срок годности в днях', type: Number })
  shelfLife?: number;

  @ApiPropertyOptional({ description: 'Температура хранения' })
  storageTemp?: string;

  @ApiPropertyOptional({ description: 'URL изображения товара' })
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Иконка товара' })
  icon?: string;

  @ApiPropertyOptional({ description: 'Признак активности товара', default: true })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Популярный товар', default: false })
  isPopular?: boolean;

  @ApiPropertyOptional({ description: 'Новый товар', default: false })
  isNew?: boolean;

  @ApiPropertyOptional({ description: 'Порядок сортировки', type: Number, default: 0 })
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Признак — товар является ингредиентом', default: false })
  isIngredient?: boolean;

  @ApiPropertyOptional({ description: 'Теги', type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Файл изображения товара', type: 'string', format: 'binary' })
  image?: any;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Название товара' })
  name?: string;

  @ApiPropertyOptional({ description: 'Название товара на английском' })
  nameEn?: string;

  @ApiPropertyOptional({ description: 'Идентификатор категории товара' })
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Цена продажи', type: Number })
  price?: number;

  @ApiPropertyOptional({ description: 'Себестоимость товара', type: Number })
  cost?: number;

  @ApiPropertyOptional({ description: 'Старая цена', type: Number })
  oldPrice?: number;

  @ApiPropertyOptional({ description: 'Артикул' })
  sku?: string;

  @ApiPropertyOptional({ description: 'Штрихкод' })
  barcode?: string;

  @ApiPropertyOptional({ description: 'Единица измерения' })
  unit?: string;

  @ApiPropertyOptional({ description: 'Вес в граммах', type: Number })
  weight?: number;

  @ApiPropertyOptional({ description: 'Объем в мл', type: Number })
  volume?: number;

  @ApiPropertyOptional({ description: 'Калории', type: Number })
  calories?: number;

  @ApiPropertyOptional({ description: 'Белки', type: Number })
  proteins?: number;

  @ApiPropertyOptional({ description: 'Жиры', type: Number })
  fats?: number;

  @ApiPropertyOptional({ description: 'Углеводы', type: Number })
  carbs?: number;

  @ApiPropertyOptional({ description: 'Описание товара' })
  description?: string;

  @ApiPropertyOptional({ description: 'Состав' })
  composition?: string;

  @ApiPropertyOptional({ description: 'Аллергены' })
  allergens?: string;

  @ApiPropertyOptional({ description: 'Срок годности в днях', type: Number })
  shelfLife?: number;

  @ApiPropertyOptional({ description: 'Температура хранения' })
  storageTemp?: string;

  @ApiPropertyOptional({ description: 'URL изображения товара' })
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Иконка товара' })
  icon?: string;

  @ApiPropertyOptional({ description: 'Признак активности товара' })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Популярный товар' })
  isPopular?: boolean;

  @ApiPropertyOptional({ description: 'Новый товар' })
  isNew?: boolean;

  @ApiPropertyOptional({ description: 'Порядок сортировки', type: Number })
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Признак — товар является ингредиентом' })
  isIngredient?: boolean;

  @ApiPropertyOptional({ description: 'Теги', type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Файл изображения товара', type: 'string', format: 'binary' })
  image?: any;
}
