import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
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
import { CategoryModule } from "./app/category/category.module";
import { BookingModule } from "./app/booking/booking.module";
import { SettingsModule } from "./app/settings/settings.module";
import { CacheModule } from './cache/cache.module';
import { CacheInterceptor } from './cache/cache.interceptor';
import { CacheClearInterceptor } from './cache/cache-clear.interceptor';

@Module({
  imports: [
    CacheModule,
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
    CategoryModule,
    BookingModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheClearInterceptor,
    },
  ],
})
export class AppModule {}
