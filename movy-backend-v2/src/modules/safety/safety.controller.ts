import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { SafetyService, TriggerSosDto } from './safety.service';

@Controller('safety')
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Post('sos')
  async triggerSos(@Body() dto: TriggerSosDto) {
    return this.safetyService.triggerSos(dto);
  }

  @Get('active-alerts')
  async getActiveAlerts() {
    return this.safetyService.getActiveAlerts();
  }

  @Put('resolve/:id')
  async resolveAlert(@Param('id') id: string, @Body('notes') notes: string) {
    return this.safetyService.resolveAlert(id, notes || 'Resolved by safety operator');
  }
}
