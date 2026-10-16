import { FC } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components/native';
import { translate } from '../../client/locales';
import { ContainerValue, Divider, InfoContainer, Label, LabelRow, Value } from './styles';
import ExpirationCountdown from '../../driver/src/components/CountDown';

interface PixValueCardProps {
  amount: string;
  expirationSeconds?: number;
  onExpire?: () => void;
}

export const PixValueCard: FC<PixValueCardProps> = ({
  amount,
  expirationSeconds,
  onExpire,
}) => {
  const theme = useTheme();

  return (
    <ContainerValue>
      {expirationSeconds !== undefined && (
        <>
          <InfoContainer>
            <LabelRow>
              <MaterialCommunityIcons name="clock" size={14} color={theme.colors.text_gray} />
              <Label>{translate('paymentPage.label_expiration_time')}</Label>
            </LabelRow>
            <ExpirationCountdown seconds={expirationSeconds} onExpire={onExpire} />
          </InfoContainer>
          <Divider />
        </>
      )}

      <InfoContainer>
        <LabelRow>
          <MaterialCommunityIcons name="wallet-bifold" size={14} color={theme.colors.text_gray} />
          <Label>{translate('paymentPage.label_value')}</Label>
        </LabelRow>
        <Value>{amount}</Value>
      </InfoContainer>
    </ContainerValue>
  );
};

export default PixValueCard;
