import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { cardShadow } from '../../../../common/theme/cardShadow';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const TopBar = styled.View`
  padding: ${({ theme }) => theme.spacing.medium}px;
`;

export const ScrollContent = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.xxlarge,
    gap: theme.spacing.large,
  },
}))``;

export const AvatarSection = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

export const AvatarWrapper = styled.View`
  position: relative;
  border-radius: ${RFValue(48)}px;
  ${cardShadow}
  shadow-opacity: 0.15;
`;

export const CameraBadge = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${RFValue(28)}px;
  height: ${RFValue(28)}px;
  border-radius: ${RFValue(14)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  border-width: ${RFValue(2)}px;
  border-color: ${({ theme }) => theme.colors.background_global};
  ${cardShadow}
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  ${cardShadow}
`;

export const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

export const DocumentsRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const DocumentsTextGroup = styled.View`
  flex: 1;
`;

export const DocumentsLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const DocumentsPendingText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.red};
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;

export const StatusRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const StatusLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin-vertical: ${({ theme }) => theme.spacing.medium}px;
`;

export const Footer = styled.View`
  padding: ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.background_global};
`;
