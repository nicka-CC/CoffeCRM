
import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import {ProductController} from "./product/product.controller";
import {ProductService} from "./product/product_service";
import {CategoryController} from "./category/category.controller";
import {CategoryService} from "./category/category_service";


@Module({
  imports: [JwtModule.register({})],
  controllers: [ProductController, CategoryController, ],
  providers:[ProductService, PrismaService, CategoryService, ],
  exports: [ProductService, CategoryService, ]
})
export class ProductModule {}