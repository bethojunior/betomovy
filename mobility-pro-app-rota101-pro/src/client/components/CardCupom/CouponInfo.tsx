import {CodeText} from './styles';
import {CouponInfoProps} from './types';

/** Nome/código do cupom — sem largura fixa, quebra em palavras se precisar. */
export function CouponInfo({code}: CouponInfoProps) {
  return <CodeText>{code}</CodeText>;
}
