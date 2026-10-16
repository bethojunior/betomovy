import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SuggestionService } from '~/interfaces/suggestionTrip';
import { rgba } from 'polished';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  padding-top: 32px;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const Content = styled.View`
  flex: 1;
`;

export const TitleText = styled.Text<{ color?: string }>`
  font-size: ${({ theme }) => theme.fontSizes.xslarge}px;
  font-family: MavenPro_700Bold;
  color: ${({ theme, color }) => color ?? theme.colors.black};
  margin-bottom: 12px;
`;

export const SubtitleText = styled.Text<{ bold?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  line-height: ${RFValue(16)}px;
  font-family: ${({ theme, bold }) => (bold ? theme.fonts.bold : theme.fonts.regular)};
  color: ${({ theme, bold }) => (bold ? theme.colors.black : theme.colors.light_gray)};
`;

export const NewChargeNoticeCard = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  background-color: ${({ theme }) => rgba(theme.colors.yellowLight, 0.5)};
  margin-top: 5px;
  margin-bottom: 11px;
`;

export const NewChargeNoticeText = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  line-height: ${RFValue(16)}px;
  font-family: MavenPro_400Regular;
  color: ${({ theme }) => theme.colors.black};
`;

export const NewChargeNoticeTextBold = styled.Text`
  font-family: MavenPro_700Bold;
`;

export const OptionsCountText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-family: MavenPro_400Regular;
  color: ${({ theme }) => theme.colors.black};
  margin-top: 16px;
  margin-bottom: 8px;
`;

export const TravelOptionsList = styled(FlatList<SuggestionService>)`
  height: 50%;
`;

export const CancelButton = styled.TouchableOpacity`
  height: ${RFValue(52)}px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.primary};
`;

export const CancelButtonText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: MavenPro_600SemiBold;
  color: ${({ theme }) => theme.colors.primary};
`;

export const CloseIconButton = styled.TouchableOpacity`
  margin-bottom: 8px;
`;
