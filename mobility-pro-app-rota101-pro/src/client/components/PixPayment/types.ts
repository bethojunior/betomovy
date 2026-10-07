import {StatusPayment} from './constants';

export interface PixKeyProps {
  key: string;
  qrCode: string;
  value: number;
}

export interface StatusPaymentProps {
  status: StatusPayment;
}
