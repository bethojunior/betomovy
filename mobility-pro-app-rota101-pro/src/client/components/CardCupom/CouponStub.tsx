import {translate} from '../../locales';
import {StubCode, StubColumn, StubLabel} from './styles';
import {CouponStubProps} from './types';

/** Canhoto destacável do ticket — ícone + código repetido + rótulo. */
export function CouponStub({image, code}: CouponStubProps) {
  return (
    <StubColumn>
      {image}
      <StubCode>{code}</StubCode>
      <StubLabel>{translate('coupon.code_label')}</StubLabel>
    </StubColumn>
  );
}
