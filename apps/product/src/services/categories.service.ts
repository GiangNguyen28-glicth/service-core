import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categories } from '../schema/cate.schema';
import { CateModel } from '../schema/cate.schema';
import { CreateCategoryDTO } from '../dto/cate.dto';
import { RabbitService, toSlug } from 'libs/shared';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Categories.name) private cateModel: CateModel,
    private rmqService: RabbitService,
  ) {}

  async create(
    cate_dto: CreateCategoryDTO,
    ctx: RmqContext,
  ): Promise<Categories> {
    try {
      cate_dto.slug = toSlug(cate_dto.name);
      const cate = await this.cateModel.create(cate_dto);
      await cate.save();
      this.rmqService.ack(ctx);
      return cate;
    } catch (error) {
      throw error;
    }
  }
}
