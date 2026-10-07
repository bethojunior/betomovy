import Helper from '../../utils/Helper';
import {translate} from '../../locales';
import {calculateDiscountAmount, calculateDiscountByCoupon} from '../../utils/CalulateDiscountByCoupon';
import {Coupon} from '../../modules/mobility/pages/CouponTripContent/types';
import {CouponDetailItem} from './types';

/** dd/mm/yyyy sem depender de Intl (Hermes nem sempre tem ICU completo pra toLocaleDateString). */
export function formatDateEnd(dateEnd?: string | null): string {
  if (!dateEnd) return '';
  const date = new Date(dateEnd);
  if (Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

/** Preço final da corrida já com o desconto do cupom aplicado (cálculo inalterado). */
export function resolveFinalPrice(price: number, coupon: Coupon): number {
  return calculateDiscountByCoupon(price, coupon);
}

/** Valor efetivo do desconto, pra badge — não é o mesmo número do preço final. */
export function resolveDiscountLabel(price: number, coupon: Coupon, currency: string): string {
  const amount = calculateDiscountAmount(price, coupon);
  return `${translate('coupon.discount_amount')}${currency}${Helper.maskMoney(amount)}`;
}

/** As 3 linhas de regra do cupom, já com ícone e texto prontos pra renderizar. */
export function buildCouponDetailItems(coupon: Coupon, currency: string): CouponDetailItem[] {
  return [
    {
      key: 'amount-range',
      icon: 'confirmation-number',
      text:
        `${translate('coupon.valid_for_amounts_from')}${currency}${safeText(coupon?.fromValue)} até ` +
        `${currency}${safeText(coupon?.limitedTo)}`,
    },
    {
      key: 'coupon-value',
      icon: 'local-offer',
      text: `${translate('coupon.coupon_value')}${safeText(coupon?.valueType)} ${safeText(coupon?.value)}`,
    },
    {
      key: 'region',
      icon: 'calendar-today',
      text: translate('coupon.valid_for_races_in') + resolveRegionText(coupon),
    },
  ];
}

/**
 * A API às vezes manda campo faltando como a string literal "null"/"undefined"
 * em vez de null/undefined de verdade — nenhum desses deve aparecer pro usuário.
 */
function safeText(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return text === 'null' || text === 'undefined' ? '' : text;
}

function resolveRegionText(coupon: Coupon): string {
  const city = safeText(coupon?.city);
  if (city) return city;

  const paymentForm = safeText(coupon?.tripPaymentForm);
  if (paymentForm) return paymentForm;

  return safeText(coupon?.gender);
}

/** true quando o cupom só vale pra uma forma de pagamento diferente da selecionada. */
export function isDisabledByPaymentForm(coupon: Coupon, selectedPaymentFormName?: string): boolean {
  return !!coupon.tripPaymentForm && coupon.tripPaymentForm !== selectedPaymentFormName;
}

/** true quando o preço da corrida está fora da faixa de valor do cupom, ou a forma de pagamento não bate. */
export function isCouponDisabled(
  price: number,
  coupon: Coupon,
  selectedPaymentFormName?: string,
): boolean {
  return (
    price <= parseFloat(coupon.fromValue) ||
    price >= parseFloat(coupon.limitedTo) ||
    isDisabledByPaymentForm(coupon, selectedPaymentFormName)
  );
}
