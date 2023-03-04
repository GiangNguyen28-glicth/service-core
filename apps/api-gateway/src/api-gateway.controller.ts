import { Body, Controller, Get, Post } from '@nestjs/common';
import { SignUpDTO } from 'apps/user/src/dto/user.dto';
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

  @Post('signUp')
  signUp(@Body() signUpDto: SignUpDTO) {
    return this.apiGateWayService.signUp(signUpDto);
  }
}
