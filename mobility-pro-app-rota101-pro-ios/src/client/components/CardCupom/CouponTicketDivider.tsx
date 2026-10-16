import {DividerColumn, VDash} from './styles';
import {CouponTicketDividerProps} from './types';

const DEFAULT_DASH_COUNT = 6;

/** Divisória tracejada entre o canhoto e o corpo do card. */
export function CouponTicketDivider({dashCount = DEFAULT_DASH_COUNT}: CouponTicketDividerProps) {
  return (
    <DividerColumn>
      {Array.from({length: dashCount}).map((_, index) => (
        <VDash key={index} />
      ))}
    </DividerColumn>
  );
}
