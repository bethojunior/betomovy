import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface SelectedProps {
  selected?: boolean;
}

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.75);
  justify-content: center;
  align-items: center;
  padding: 16px;
  z-index: 99999;
  elevation: 99999;
`;

export const ContainerAll = styled.View`
  background-color: ${({ theme }) => theme.colors.background_global || '#FFFFFF'};
  border-radius: 24px;
  padding: 22px 20px 24px 20px;
  width: 100%;
  max-width: 420px;
  max-height: 85%;
  elevation: 100000;
  z-index: 100000;
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.35;
  shadow-radius: 16px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 14px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border || '#E5E7EB'};
  margin-bottom: 12px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${RFValue(16)}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryText || '#111827'};
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 4px;
  border-radius: 20px;
`;

export const Description = styled.Text`
  font-size: ${RFValue(13)}px;
  color: ${({ theme }) => theme.colors.secondary || '#6B7280'};
  margin-bottom: 14px;
  line-height: 18px;
`;

export const Content = styled.ScrollView`
  max-height: 280px;
  margin-bottom: 12px;
`;

export const ButtonReason = styled.TouchableOpacity<SelectedProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 12px;
  margin-bottom: 8px;
  border-width: 1.5px;
  border-color: ${({ selected, theme }) =>
    selected ? (theme.colors.primary || '#00349a') : (theme.colors.border || '#E5E7EB')};
  background-color: ${({ selected, theme }) =>
    selected ? '#EFF6FF' : (theme.colors.background_global || '#FAFAFA')};
`;

export const ReasonName = styled.Text<SelectedProps>`
  font-size: ${RFValue(14)}px;
  font-weight: ${({ selected }) => (selected ? '700' : '500')};
  color: ${({ selected, theme }) =>
    selected ? (theme.colors.primary || '#00349a') : (theme.colors.primaryText || '#1F2937')};
  flex: 1;
  padding-right: 12px;
`;

export const RadioIndicator = styled.View<SelectedProps>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  border-width: 2px;
  border-color: ${({ selected, theme }) =>
    selected ? (theme.colors.primary || '#00349a') : '#9CA3AF'};
  align-items: center;
  justify-content: center;
  background-color: ${({ selected, theme }) =>
    selected ? (theme.colors.primary || '#00349a') : 'transparent'};
`;

export const ContainerButton = styled.View`
  margin-top: 10px;
  gap: 10px;
`;

export const ButtonConfirm = styled.TouchableOpacity`
  background-color: #DC2626;
  border-radius: 14px;
  height: 52px;
  align-items: center;
  justify-content: center;
  shadow-color: #DC2626;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  elevation: 4;
`;

export const ButtonConfirmText = styled.Text`
  color: #FFFFFF;
  font-size: ${RFValue(15)}px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ButtonDismiss = styled.TouchableOpacity`
  height: 44px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border || '#D1D5DB'};
  background-color: transparent;
`;

export const ButtonDismissText = styled.Text`
  color: ${({ theme }) => theme.colors.secondary || '#4B5563'};
  font-size: ${RFValue(14)}px;
  font-weight: 600;
`;
