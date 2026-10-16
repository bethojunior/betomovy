import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { rgba } from 'polished';
import { MotiView } from 'moti';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const Content = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xlarge,
    paddingTop: getStatusBarHeight() + RFValue(24),
    paddingBottom: theme.spacing.xlarge,
  },
}))`
  flex: 1;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
`;

export const Subtitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text_gray};
  text-align: center;
  line-height: ${RFValue(19)}px;
  margin-top: ${({ theme }) => theme.spacing.medium}px;
`;

export const AuthArea = styled.View`
  align-items: center;
  justify-content: center;
  align-self: center;
  width: ${RFValue(180)}px;
  height: ${RFValue(180)}px;
  margin-top: ${({ theme }) => theme.spacing.xslarge}px;
`;

export const PulseRing = styled(MotiView)`
  position: absolute;
  width: ${RFValue(150)}px;
  height: ${RFValue(150)}px;
  border-radius: ${RFValue(75)}px;
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.primary};
`;

export const IconCircle = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: ${RFValue(140)}px;
  height: ${RFValue(140)}px;
  border-radius: ${RFValue(70)}px;
  background-color: ${({ theme }) => rgba(theme.colors.primary, 0.08)};
`;

export const IconBadge = styled.View<{ failed?: boolean }>`
  position: absolute;
  right: ${RFValue(6)}px;
  bottom: ${RFValue(6)}px;
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, failed }) => (failed ? theme.colors.destructive : theme.colors.primary)};
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.background_global};
`;

export const StatusTitle = styled.Text<{ failed?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme, failed }) => (failed ? theme.colors.destructive : theme.colors.secondary)};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.large}px;
`;

export const StatusHint = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text_gray};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;

export const InfoCard = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.medium}px;
  background-color: ${({ theme }) => rgba(theme.colors.primary, 0.06)};
  border-radius: ${({ theme }) => theme.radius.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  margin-top: ${({ theme }) => theme.spacing.xslarge}px;
`;

export const InfoIconBadge = styled.View`
  width: ${RFValue(32)}px;
  height: ${RFValue(32)}px;
  border-radius: ${RFValue(16)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const InfoTextColumn = styled.View`
  flex: 1;
`;

export const InfoTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const InfoDescription = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;

export const MethodsSection = styled.View`
  margin-top: ${({ theme }) => theme.spacing.xslarge}px;
  align-items: center;
`;

export const MethodsSectionLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text_gray};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

export const MethodsRow = styled.View`
  flex-direction: row;
  align-items: stretch;
  align-self: stretch;
  border-radius: ${({ theme }) => theme.radius.xxlarge}px;
  background-color: ${({ theme }) => rgba(theme.colors.primary, 0.05)};
  overflow: hidden;
`;

export const MethodOption = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small}px;
  padding-vertical: ${({ theme }) => theme.spacing.large}px;
  padding-horizontal: ${({ theme }) => theme.spacing.small}px;
`;

export const MethodDivider = styled.View`
  width: 1px;
  margin-vertical: ${({ theme }) => theme.spacing.medium}px;
  background-color: ${({ theme }) => rgba(theme.colors.primary, 0.15)};
`;

export const MethodIconBadge = styled.View`
  width: ${RFValue(28)}px;
  height: ${RFValue(28)}px;
  border-radius: ${RFValue(14)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => rgba(theme.colors.primary, 0.12)};
`;

export const MethodLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
`;

export const Footer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small}px;
  padding-vertical: ${({ theme }) => theme.spacing.large}px;
  padding-horizontal: ${({ theme }) => theme.spacing.xlarge}px;
`;

export const FooterText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text_gray};
  text-align: center;
`;
