import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ScrollContent = styled.ScrollView.attrs<{keyboardHeight?: number}>(
  ({theme, keyboardHeight = 0}) => ({
    keyboardShouldPersistTaps: 'handled',
    contentContainerStyle: {
      padding: theme.spacing.large,
      paddingBottom: theme.spacing.large + keyboardHeight,
      gap: theme.spacing.large,
    },
  }),
)``;

export const Card = styled.View`
  background-color: ${({theme}) => theme.colors.white};
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  padding: ${({theme}) => theme.spacing.large}px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border_white_light};
`;

export const AvatarRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const AvatarWrapper = styled.View`
  position: relative;
`;

export const CameraBadge = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${RFValue(24)}px;
  height: ${RFValue(24)}px;
  border-radius: ${RFValue(12)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.primary};
  border-width: ${RFValue(1.5)}px;
  border-color: ${({theme}) => theme.colors.white};
`;

export const UserInfo = styled.View`
  flex: 1;
  justify-content: center;
  margin-left: ${({theme}) => theme.spacing.large}px;
  gap: ${({theme}) => theme.spacing.small}px;
`;

export const DriverName = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  font-family: MavenPro_700Bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const SimpleText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.text_gray};
  font-family: MavenPro_400Regular;
`;

export const SectionTitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({theme}) => theme.spacing.medium}px;
`;

export const SectionTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: MavenPro_700Bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const CountBadgeText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.grayLight};
`;

export const TripTypesList = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  padding-horizontal: ${({theme}) => theme.spacing.large}px;
`;

export const ListTypeContent = styled.View<{isLast: boolean}>`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.medium}px;
  padding-vertical: ${({theme}) => theme.spacing.medium}px;
  border-bottom-width: ${({isLast, theme}) => (isLast ? 0 : theme.borderWidth.small)}px;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;

export const Ball = styled.View`
  width: ${RFValue(7)}px;
  height: ${RFValue(7)}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: ${RFValue(4)}px;
`;

export const ItemTripType = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  color: ${({theme}) => theme.colors.secondary};
  text-transform: uppercase;
`;

export const DangerRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const DangerTextGroup = styled.View`
  flex: 1;
`;

export const DangerTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: MavenPro_700Bold;
  color: ${({theme}) => theme.colors.red};
`;

export const DangerSubtitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.text_gray};
  margin-top: ${RFValue(2)}px;
`;

export const SupportRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const SupportTextGroup = styled.View`
  flex: 1;
`;

export const SupportText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.text_gray};
  line-height: ${RFValue(18)}px;
`;

export const SupportLinkText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-family: MavenPro_700Bold;
  color: ${({theme}) => theme.colors.blue};
`;
