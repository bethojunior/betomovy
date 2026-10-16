import {DiscountPill, DiscountPillText} from './styles';
import {CouponDiscountBadgeProps} from './types';

/** Pílula de destaque do valor do desconto. */
export function CouponDiscountBadge({label}: CouponDiscountBadgeProps) {
  return (
    <DiscountPill>
      <DiscountPillText>{label}</DiscountPillText>
    </DiscountPill>
  );
}
