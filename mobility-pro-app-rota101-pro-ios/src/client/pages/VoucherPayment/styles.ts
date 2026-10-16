import styled from 'styled-components/native';
import { Button } from '~/client/components/Button';
import { USE_DARK_PRIMARY_VARIANT } from '~/constantBuild/config';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_white};
`;

export const ScrollContent = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow:1,
    padding: 20,
    paddingBottom: 40,
  },
})``;

export const SuccessContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const SuccessTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 20px;
`;

export const ConfirmSection = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: space-between;
`;

export const CardsWrapper = styled.View`
  gap: 12px;
`;

export const SummaryCard = styled.View`
  background-color: #fff;
  border-radius: 10px;
  padding: 24px 20px;
  align-items: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.grayBright};
`;

export const VoucherLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.text_gray};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;

export const VoucherValue = styled.Text`
  font-size: 40px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 4px;
`;

export const VoucherAmountLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const PaymentCard = styled.View`
  background-color: #fff;
  border-radius: 10px;
  padding: 16px 20px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.grayBright};
`;

export const PaymentCardTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.text_gray};
  margin-bottom: 10px;
`;

export const PaymentMethodRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const PaymentMethodText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const ConfirmButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  border-radius: 10px;
  padding: 14px;
  width: 100%;
  margin-top: 10px;
`;

export const ConfirmButtonText = styled.Text`
  color: ${USE_DARK_PRIMARY_VARIANT ? 'black' : 'white'};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: bold;
`;
