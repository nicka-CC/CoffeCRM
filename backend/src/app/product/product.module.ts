
import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import {ProductController} from "./product/product.controller";
import {ProductService} from "./product/product_service";


@Module({
  imports: [JwtModule.register({})],
  controllers: [ProductController],
  providers:[ProductService, PrismaService],
  exports: [ProductService]
})
export class ProductModule {}