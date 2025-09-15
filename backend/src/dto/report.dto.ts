export class CreateReportDto {
  type: string;
  period: string;
  fileUrl: string;
}

export class UpdateReportDto {
  type?: string;
  period?: string;
  fileUrl?: string;
}
