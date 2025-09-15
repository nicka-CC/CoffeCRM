export class CreatePaymentSettingsDto {
  provider: string;
  apiKey: string;
  companyId: string;
}

export class UpdatePaymentSettingsDto {
  provider?: string;
  apiKey?: string;
}
