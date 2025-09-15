export class CreateKpiDto {
  employeeId: string;
  metric: string;
  value: number;
  date?: Date;
}

export class UpdateKpiDto {
  metric?: string;
  value?: number;
  date?: Date;
}
