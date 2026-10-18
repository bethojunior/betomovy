import { Injectable, BadRequestException } from '@nestjs/common';

export interface CouponItem {
  id: number;
  code: string;
  description: string;
  discount_type: 'fixed_amount' | 'percentage';
  discount_value: number;
  currency: 'USD' | 'BRL';
  min_trip_value: number;
  is_active: boolean;
}

@Injectable()
export class CouponsService {
  private activeCoupons: CouponItem[] = [
    {
      id: 1,
      code: 'MOVYUSA',
      description: 'US Launch Promo - $5 OFF your ride',
      discount_type: 'fixed_amount',
      discount_value: 5.00,
      currency: 'USD',
      min_trip_value: 10.00,
      is_active: true,
    },
    {
      id: 2,
      code: 'BEMVINDO',
      description: 'Boas-Vindas Brasil - R$ 10 OFF na primeira viagem',
      discount_type: 'fixed_amount',
      discount_value: 10.00,
      currency: 'BRL',
      min_trip_value: 20.00,
      is_active: true,
    },
    {
      id: 3,
      code: 'VIPMOVY',
      description: '15% de Desconto em corridas MOVY Comfort',
      discount_type: 'percentage',
      discount_value: 15.00,
      currency: 'USD',
      min_trip_value: 15.00,
      is_active: true,
    },
  ];

  async validateAndApply(code: string, fareTotal: number, currency: 'USD' | 'BRL') {
    const coupon = this.activeCoupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.is_active
    );

    if (!coupon) {
      throw new BadRequestException('Coupon code is invalid or has expired.');
    }

    if (coupon.currency !== currency) {
      throw new BadRequestException(`Coupon ${coupon.code} is only valid for ${coupon.currency}.`);
    }

    if (fareTotal < coupon.min_trip_value) {
      throw new BadRequestException(
        `Minimum fare of ${currency} ${coupon.min_trip_value.toFixed(2)} required to apply this coupon.`
      );
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'fixed_amount') {
      discountAmount = Math.min(coupon.discount_value, fareTotal);
    } else {
      discountAmount = Number(((fareTotal * coupon.discount_value) / 100).toFixed(2));
    }

    const finalFare = Math.max(0, Number((fareTotal - discountAmount).toFixed(2)));

    return {
      success: true,
      code: coupon.code,
      description: coupon.description,
      original_fare: fareTotal,
      discount_applied: discountAmount,
      final_fare: finalFare,
      currency,
    };
  }

  async listActiveCoupons(currency: 'USD' | 'BRL') {
    return this.activeCoupons.filter((c) => c.currency === currency && c.is_active);
  }
}
