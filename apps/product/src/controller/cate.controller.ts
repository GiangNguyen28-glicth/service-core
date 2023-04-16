import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CategoryService } from '../services';
import { CreateCategoryDTO } from '../dto';

@Controller('')
export class CateController {
  constructor(private cateService: CategoryService) {}
  @EventPattern('create_cate')
  create(@Payload() cate_dto: CreateCategoryDTO, @Ctx() ctx: RmqContext) {
    console.log(cate_dto);
    return this.cateService.create(cate_dto, ctx);
  }
}
