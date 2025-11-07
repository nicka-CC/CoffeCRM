import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from "../prisma/prisma/prisma.service";
import {AuthModule} from './user/auth/auth.module'
import { AppService } from "./app.service";

import { ProductModule } from "./app/product/product.module";
import { UserModule } from "./app/user/user.module";
import { OrdersModule } from "./app/orders/orders.module";
import { BranchModule } from "./app/branch/branch.module";
import { CustomerModule } from "./app/customer/customer.module";
import { EmployeeModule } from "./app/employee/employee.module";
import { StockModule } from "./app/stock/stock.module";
import { DashboardModule } from "./app/dashboard/dashboard.module";
import { AnalyticsModule } from "./app/analytics/analytics.module";

@Module({
  imports: [
    AuthModule,
    ProductModule,
    UserModule,
    OrdersModule,
    BranchModule,
    CustomerModule,
    EmployeeModule,
    StockModule,
    DashboardModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
