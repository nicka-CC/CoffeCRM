import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Идентификатор пользователя' })
  userId: string;

  @ApiPropertyOptional({ description: 'Количество бонусов', type: Number })
  bonus?: number;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: 'Количество бонусов', type: Number })
  bonus?: number;
}
