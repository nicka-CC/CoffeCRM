import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Идентификатор пользователя' })
  userId: string;

  @ApiProperty({ description: 'Должность сотрудника' })
  position: string;

  @ApiPropertyOptional({ description: 'Размер заработной платы', type: Number })
  salary?: number;

  @ApiPropertyOptional({ description: 'Идентификатор филиала' })
  branchId?: string;
}

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ description: 'Должность сотрудника' })
  position?: string;

  @ApiPropertyOptional({ description: 'Размер заработной платы', type: Number })
  salary?: number;

  @ApiPropertyOptional({ description: 'Идентификатор филиала' })
  branchId?: string;
}
