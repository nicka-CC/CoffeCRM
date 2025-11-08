import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { PaymentSettingsController } from './payment-settings.controller';
import { IntegrationController } from './integration.controller';
import { CompanyService } from './company.service';
import { PaymentSettingsService } from './payment-settings.service';
import { IntegrationService } from './integration.service';
import { PrismaService } from '../../../prisma/prisma/prisma.service';

@Module({
  controllers: [CompanyController, PaymentSettingsController, IntegrationController],
  providers: [CompanyService, PaymentSettingsService, IntegrationService, PrismaService],
  exports: [CompanyService, PaymentSettingsService, IntegrationService],
})
export class SettingsModule {}

