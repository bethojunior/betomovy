import {ReactNode} from 'react';
import {Coupon} from '../../modules/mobility/pages/CouponTripContent/types';

export interface CardCupomProps {
  coupon: Coupon;
  selectedCoupon: Coupon | any;
  setSelectedCoupon: (coupon: Coupon) => void;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

/** Um item da lista de regras (ícone + texto já formatado). */
export interface CouponDetailItem {
  key: string;
  icon: string;
  text: string;
}

export interface CouponImageProps {
  source: number;
}

/** Código do cupom, em destaque — usado tanto no canhoto quanto no corpo do ticket. */
export interface CouponInfoProps {
  code: string;
}

/** Ícone + código + rótulo "código do cupom" — o canhoto destacável à esquerda. */
export interface CouponStubProps {
  image: ReactNode;
  code: string;
}

export interface CouponDiscountBadgeProps {
  label: string;
}

export interface CouponDetailsProps {
  items: CouponDetailItem[];
}

export interface CouponValidityProps {
  date?: string;
}

export interface CouponPriceProps {
  price: string;
}

export interface CouponTicketDividerProps {
  /** Quantos traços renderizar — a coluna estica pra altura do ticket via flexbox, então o número é só densidade visual. */
  dashCount?: number;
}

export interface CouponCardProps {
  disabled?: boolean;
  selected?: boolean;
  stub: ReactNode;
  code: ReactNode;
  price: ReactNode;
  discountBadge: ReactNode;
  details: ReactNode;
  validity?: ReactNode;
}
