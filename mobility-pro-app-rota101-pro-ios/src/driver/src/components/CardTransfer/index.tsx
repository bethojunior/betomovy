import {LastTransactionProps} from '../../context/bank/types';
import {moneyMask} from '../../utils/money';
import {
  Ball,
  ContainerCard,
  ContainerCardLeft,
  ContainerTypeAndDate,
  ContainerValue,
  P,
  TextAddress,
} from './styles';

interface Props {
  color?: string;
  data?: LastTransactionProps;
  background?: string;
}

export const CardTransfer = ({color, data, background}: Props) => {
  return (
    <ContainerCard background={background}>
      <ContainerCardLeft>
        <Ball color={color} />
        <ContainerTypeAndDate>
          <P>{data?.date}</P>
          <TextAddress>{data?.summary}</TextAddress>
        </ContainerTypeAndDate>
      </ContainerCardLeft>

      <ContainerValue>
        <P>R$ {moneyMask(parseFloat(data?.value || '0'))}</P>
      </ContainerValue>
    </ContainerCard>
  );
};
