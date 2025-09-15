export class CreateEmployeeDto {
  userId: string;
  position: string;
  salary?: number;
  branchId?: string;
}

export class UpdateEmployeeDto {
  position?: string;
  salary?: number;
  branchId?: string;
}
