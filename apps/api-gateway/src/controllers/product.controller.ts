import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { Categories, CreateCategoryDTO, CreateProductDTO } from 'apps/product';
import { CurrentUser, Service } from 'libs/shared';
import { lastValueFrom } from 'rxjs';
import { AtGuard } from '../common';
import { User } from 'apps/user';

@Controller('')
export class ProductController {
  constructor(@Inject(Service.PRODUCT) private clientProduct: ClientRMQ) {}

  @UseGuards(AtGuard)
  @Post('cate')
  async createCate(@Body() cate_dto: CreateCategoryDTO): Promise<Categories> {
    try {
      const cate = await lastValueFrom(
        this.clientProduct.send('create_cate', cate_dto),
      );
      return cate;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AtGuard)
  @Post('products')
  async createProduct(
    @Body() product_dto: CreateProductDTO,
    @CurrentUser() user: User,
  ): Promise<Categories> {
    try {
      product_dto.created_by = user.id;
      const cate = await lastValueFrom(
        this.clientProduct.send('create_product', product_dto),
      );
      return cate;
    } catch (error) {
      throw error;
    }
  }
}
