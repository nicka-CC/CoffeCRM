import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from "../prisma/prisma/prisma.service";
import {AuthModule} from './user/auth/auth.module'
import { AppService } from "./app.service";

import {ProductModule} from "./app/product/product.module";
import { UserModule } from "./app/user/user.module";
import { OrdersModule } from "./app/orders/orders.module";

@Module({
  imports: [
    AuthModule,
    ProductModule,
    UserModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
