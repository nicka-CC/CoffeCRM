export class CreateIntegrationDto {
  name: string;
  apiKey?: string;
  companyId: string;
}

export class UpdateIntegrationDto {
  name?: string;
  apiKey?: string;
}
