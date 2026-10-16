import {translate} from '../../locales';
import {ValidUntilText} from './styles';
import {CouponValidityProps} from './types';

/** Linha "Válido até DATA", no fim do corpo do ticket. */
export function CouponValidity({date}: CouponValidityProps) {
  if (!date) return null;

  return (
    <ValidUntilText>
      {translate('coupon.valid_until')} {date}
    </ValidUntilText>
  );
}
