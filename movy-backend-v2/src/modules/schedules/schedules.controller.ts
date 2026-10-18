import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { SchedulesService, CreateScheduleDto } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('create')
  async createSchedule(@Body() dto: CreateScheduleDto) {
    return this.schedulesService.createSchedule(dto);
  }

  @Get('available')
  async listAvailable(@Query('currency') currency: 'USD' | 'BRL' = 'USD') {
    return this.schedulesService.listAvailable(currency);
  }

  @Post('accept/:uuid')
  async acceptByDriver(
    @Param('uuid') uuid: string,
    @Body('driver_id') driverId: number
  ) {
    return this.schedulesService.acceptByDriver(uuid, driverId || 1);
  }
}
