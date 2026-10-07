import React from 'react';
import {useAuth} from '../../../context/auth';
import {coinTypePerApi, maskMoney} from '../../utils/money';
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
  data?: LastTransaction;
}

interface LastTransaction {
  balanceFlowTypeId: string;
  color: string;
  date: string;
  flow: string;
  price: string;
  summary: string;
  tripReference: string;
  value: string;
}

export const CardTransfer = ({color, data}: Props) => {
  const {cityConfig} = useAuth();
  return (
    <ContainerCard>
      <ContainerCardLeft>
        <Ball color={color} />
        <ContainerTypeAndDate>
          <P>{data?.date}</P>
          <TextAddress>{data?.summary}</TextAddress>
        </ContainerTypeAndDate>
      </ContainerCardLeft>

      <ContainerValue>
        <P>
          {coinTypePerApi(cityConfig?.typeMoney)}{' '}
          {maskMoney(parseFloat(data?.value || '0'))}
        </P>
      </ContainerValue>
    </ContainerCard>
  );
};
