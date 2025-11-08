import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Название категории' })
  name: string;

  @ApiPropertyOptional({ description: 'Иконка категории' })
  icon?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'Название категории' })
  name?: string;

  @ApiPropertyOptional({ description: 'Иконка категории' })
  icon?: string;
}
