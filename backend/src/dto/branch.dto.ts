import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBranchDto {
  @ApiProperty({ description: 'Название филиала' })
  name: string;

  @ApiProperty({ description: 'Адрес филиала' })
  address: string;

  @ApiProperty({ description: 'Город расположения филиала' })
  city: string;

  @ApiPropertyOptional({ description: 'Регион' })
  region?: string;

  @ApiPropertyOptional({ description: 'Почтовый индекс' })
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Страна', default: 'Россия' })
  country?: string;

  @ApiPropertyOptional({ description: 'Контактный телефон филиала' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Контактный email филиала' })
  email?: string;

  @ApiPropertyOptional({ description: 'Веб-сайт' })
  website?: string;

  @ApiPropertyOptional({ description: 'Широта на карте', type: Number })
  latitude?: number;

  @ApiPropertyOptional({ description: 'Долгота на карте', type: Number })
  longitude?: number;

  @ApiPropertyOptional({ description: 'Часовой пояс', default: 'Europe/Moscow' })
  timezone?: string;

  @ApiPropertyOptional({ description: 'Время открытия (формат: HH:mm)' })
  openTime?: string;

  @ApiPropertyOptional({ description: 'Время закрытия (формат: HH:mm)' })
  closeTime?: string;

  @ApiPropertyOptional({ description: 'Активен', default: true })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Имя менеджера филиала' })
  managerName?: string;

  @ApiPropertyOptional({ description: 'Телефон менеджера' })
  managerPhone?: string;

  @ApiPropertyOptional({ description: 'Площадь в м²', type: Number })
  area?: number;

  @ApiPropertyOptional({ description: 'Вместимость (количество мест)', type: Number })
  capacity?: number;

  @ApiPropertyOptional({ description: 'Описание филиала' })
  description?: string;
}

export class UpdateBranchDto {
  @ApiPropertyOptional({ description: 'Название филиала' })
  name?: string;

  @ApiPropertyOptional({ description: 'Адрес филиала' })
  address?: string;

  @ApiPropertyOptional({ description: 'Город расположения филиала' })
  city?: string;

  @ApiPropertyOptional({ description: 'Регион' })
  region?: string;

  @ApiPropertyOptional({ description: 'Почтовый индекс' })
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Страна' })
  country?: string;

  @ApiPropertyOptional({ description: 'Контактный телефон филиала' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Контактный email филиала' })
  email?: string;

  @ApiPropertyOptional({ description: 'Веб-сайт' })
  website?: string;

  @ApiPropertyOptional({ description: 'Широта на карте', type: Number })
  latitude?: number;

  @ApiPropertyOptional({ description: 'Долгота на карте', type: Number })
  longitude?: number;

  @ApiPropertyOptional({ description: 'Часовой пояс' })
  timezone?: string;

  @ApiPropertyOptional({ description: 'Время открытия (формат: HH:mm)' })
  openTime?: string;

  @ApiPropertyOptional({ description: 'Время закрытия (формат: HH:mm)' })
  closeTime?: string;

  @ApiPropertyOptional({ description: 'Активен' })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Имя менеджера филиала' })
  managerName?: string;

  @ApiPropertyOptional({ description: 'Телефон менеджера' })
  managerPhone?: string;

  @ApiPropertyOptional({ description: 'Площадь в м²', type: Number })
  area?: number;

  @ApiPropertyOptional({ description: 'Вместимость (количество мест)', type: Number })
  capacity?: number;

  @ApiPropertyOptional({ description: 'Описание филиала' })
  description?: string;
}
