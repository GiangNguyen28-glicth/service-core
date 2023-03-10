import { Controller, Get } from '@nestjs/common';
import { ApiGateWayService } from './api-gateway.service';

@Controller('api-gateway')
export class ApiGateWayController {
  constructor(private readonly apiGateWayService: ApiGateWayService) {}

  @Get('ping-user')
  pingServiceA() {
    return this.apiGateWayService.pingServiceUser();
  }

  @Get('ping-auth')
  pingServiceAuth() {
    return this.apiGateWayService.pingServiceAuth();
  }
}
