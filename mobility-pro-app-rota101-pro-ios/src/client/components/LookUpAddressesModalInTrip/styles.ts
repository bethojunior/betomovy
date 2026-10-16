import { rgba } from 'polished';
import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { Button } from '../Button';

const MAX_SHEET_HEIGHT = Dimensions.get('window').height * 0.88;

export const Wrapper = styled.View`
  max-height: ${MAX_SHEET_HEIGHT}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
  padding: 0 ${({ theme }) => theme.spacing.large}px ${({ theme }) => theme.spacing.large}px;
`;

export const BackButton = styled.TouchableOpacity`
  width: ${RFValue(32)}px;
  height: ${RFValue(32)}px;
  border-radius: ${RFValue(16)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const HeaderTextGroup = styled.View`
  flex: 1;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-family: MavenPro_700Bold;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const HeaderSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;

export const Content = styled.ScrollView.attrs(({ theme }) => ({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingHorizontal: theme.spacing.large,
  },
}))``;

export const RouteCard = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const TimelineRow = styled.View`
  flex-direction: row;
`;

export const MarkerColumn = styled.View`
  width: ${RFValue(16)}px;
  align-items: center;
  padding-top: ${RFValue(14)}px;
  margin-right: ${({ theme }) => theme.spacing.medium}px;
`;

export const OriginBall = styled.View`
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  border-radius: ${RFValue(5)}px;
  background-color: ${({ theme }) => theme.colors.marker_origin};
`;

export const WaypointBall = styled.View`
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  border-radius: ${RFValue(5)}px;
  background-color: ${({ theme }) => theme.colors.marker_waypoint};
`;

export const DestinationSquare = styled.View`
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  background-color: ${({ theme }) => theme.colors.marker_destination};
`;

export const MarkerLine = styled.View`
  width: 1px;
  flex: 1;
  min-height: ${RFValue(28)}px;
  border-left-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-style: dashed;
  margin: ${RFValue(4)}px 0;
`;

export const InputsColumn = styled.View`
  flex: 1;
`;

export const AddressRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small}px;
`;

export const AddressInputWrapper = styled.View`
  flex: 1;
`;

export const RoundIconButton = styled.TouchableOpacity<{ variant: 'add' | 'remove' | 'help' }>`
  width: ${RFValue(28)}px;
  height: ${RFValue(28)}px;
  border-radius: ${RFValue(14)}px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme, variant }) =>
    variant === 'add' ? rgba(theme.colors.primary, 0.1) : theme.colors.background_white_light};
`;

export const OriginHelpCard = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small}px;
  background-color: ${({ theme }) => rgba(theme.colors.primary, 0.08)};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${({ theme }) => theme.spacing.medium}px;
  margin-top: ${({ theme }) => theme.spacing.small}px;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

export const OriginHelpText = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Footer = styled.View`
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const ButtonConfirm = styled(Button)``;

export const ContentChangePrice = styled.View`
  width: 100%;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const ContentText = styled.View`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small}px;
`;
