export class CreateCompanyDto {
  name: string;
  description?: string;
}

export class UpdateCompanyDto {
  name?: string;
  description?: string;
}
