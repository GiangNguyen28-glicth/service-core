import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ConfigModule } from '@nestjs/config';
import { MongoDBModule, RabbitModule, Service } from 'libs/shared';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { Categories, CategorySchema } from './schema/cate.schema';
import { CategoryService } from './services/categories.service';
import { ProductController } from './controller/product.controller';
import { CateController } from './controller/cate.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/product/.env',
    }),
    RabbitModule.register({ name: Service.PRODUCT }),
    MongoDBModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Categories.name, schema: CategorySchema },
    ]),
  ],
  controllers: [ProductController, CateController],
  providers: [ProductService, CategoryService],
})
export class ProductModule {}
