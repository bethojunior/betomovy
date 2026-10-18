import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { DriversService, UpdateLocationDto, CashoutDto } from './drivers.service';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post('telemetry/location')
  async updateLocation(@Body() dto: UpdateLocationDto) {
    return this.driversService.updateLocation(dto);
  }

  // Saque Instantâneo (Zelle para EUA / Pix para Brasil)
  @Post('wallet/cashout')
  async cashout(@Body() dto: CashoutDto) {
    return this.driversService.processCashout(dto);
  }

  @Get(':id/cockpit')
  async getCockpit(@Param('id') id: string) {
    return this.driversService.getDriverCockpit(Number(id));
  }
}
