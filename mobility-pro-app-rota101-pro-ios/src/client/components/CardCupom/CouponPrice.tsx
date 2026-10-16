import {PriceValue} from './styles';
import {CouponPriceProps} from './types';

/** Valor da corrida com o cupom aplicado — fica no cabeçalho, ao lado do código. */
export function CouponPrice({price}: CouponPriceProps) {
  return <PriceValue>{price}</PriceValue>;
}
