import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get('list')
  async listCoupons(@Query('currency') currency: 'USD' | 'BRL' = 'USD') {
    return this.couponsService.listActiveCoupons(currency);
  }

  @Post('apply')
  async applyCoupon(
    @Body() body: { code: string; fare_total: number; currency: 'USD' | 'BRL' }
  ) {
    return this.couponsService.validateAndApply(body.code, body.fare_total, body.currency);
  }
}
