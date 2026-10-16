import {Ionicons} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';
import {moneyMask} from '../../utils/money';
import {translate} from '../../../../client/locales';
import {
  Overlay,
  Card,
  CloseIconButton,
  Content,
  Title,
  Description,
  BalanceRow,
  BalanceLabel,
  BalanceValue,
  PayButton,
  PayButtonText,
  PrepaidButton,
  PrepaidButtonText,
} from './styles';
import {NegativeBalanceModalProps} from './types';

export const NegativeBalanceModal = ({
  visible,
  onClose,
  title,
  description,
  balanceValue,
  showPrepaidOption,
  onPressPay,
  onPressPrepaid,
}: NegativeBalanceModalProps) => {
  if (!visible) return null;

  const isNegative = balanceValue < 0;

  return (
    <Overlay>
      <Card>
        <CloseIconButton onPress={onClose} activeOpacity={0.6}>
          <Ionicons name="close" size={RFValue(20)} color={theme.colors.text_gray} />
        </CloseIconButton>

        <Content>
          <Ionicons name="alert-circle" size={RFValue(36)} color={theme.colors.red} />

          <Title>{title}</Title>
          <Description>{description}</Description>

          <BalanceRow>
            <BalanceLabel>{translate('negativeBalanceModal.text_current_balance')}</BalanceLabel>
            <BalanceValue>
              {isNegative ? '-' : ''}R$ {moneyMask(Math.abs(balanceValue))}
            </BalanceValue>
          </BalanceRow>

          <PayButton onPress={onPressPay} activeOpacity={0.7}>
            <PayButtonText>{translate('negativeBalanceModal.text_pay_balance')}</PayButtonText>
          </PayButton>

          {showPrepaidOption && (
            <PrepaidButton onPress={onPressPrepaid} activeOpacity={0.6}>
              <Ionicons name="wallet-outline" size={RFValue(18)} color={theme.colors.secondary} />
              <PrepaidButtonText>{translate('trip.to_prepaid')}</PrepaidButtonText>
            </PrepaidButton>
          )}
        </Content>
      </Card>
    </Overlay>
  );
};
