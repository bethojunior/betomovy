import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService, SystemFeatureSettings } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public')
  async getPublicSettings(): Promise<SystemFeatureSettings> {
    return this.settingsService.getPublicSettings();
  }

  @Put('toggle')
  async toggleFeature(
    @Body() body: { key: keyof SystemFeatureSettings; value: any }
  ): Promise<SystemFeatureSettings> {
    return this.settingsService.updateSetting(body.key, body.value);
  }
}
