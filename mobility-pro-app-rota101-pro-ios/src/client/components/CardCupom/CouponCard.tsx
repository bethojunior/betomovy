import {Card, Content, Dash, HeaderRow, HorizontalDivider} from './styles';
import {CouponTicketDivider} from './CouponTicketDivider';
import {CouponCardProps} from './types';

const HORIZONTAL_DASH_COUNT = 20;

/**
 * Casco visual do card de cupom: borda sólida reta (sem recortes) e a
 * divisória entre o canhoto (esquerda) e o corpo (direita). Não sabe nada
 * sobre cupom — só posiciona os slots que recebe.
 */
export function CouponCard({disabled, selected, stub, code, price, discountBadge, details, validity}: CouponCardProps) {
  return (
    <Card disabled={disabled} selected={selected}>
      {stub}

      <CouponTicketDivider />

      <Content>
        <HeaderRow>
          {code}
          {price}
        </HeaderRow>

        {discountBadge}

        <HorizontalDivider>
          {Array.from({length: HORIZONTAL_DASH_COUNT}).map((_, index) => (
            <Dash key={index} />
          ))}
        </HorizontalDivider>

        {details}
        {validity}
      </Content>
    </Card>
  );
}
