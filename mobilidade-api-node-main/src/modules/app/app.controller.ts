import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'movy-api-node-ws',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }

  @Get('ws')
  getWs() {
    return {
      status: 'ok',
      service: 'movy-api-node-ws',
      timestamp: new Date().toISOString()
    };
  }

  @Get('ws/health')
  getWsHealth() {
    return {
      status: 'ok',
      service: 'movy-api-node-ws',
      timestamp: new Date().toISOString()
    };
  }
}

