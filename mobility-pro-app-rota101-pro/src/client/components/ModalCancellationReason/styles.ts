import {rgba} from 'polished';
import {Dimensions} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

const MAX_SHEET_HEIGHT = Dimensions.get('window').height * 0.82;

interface ReasonCardProps {
  selected: boolean;
}

export const Content = styled.View`
  max-height: ${MAX_SHEET_HEIGHT}px;
  padding: ${({theme}) => theme.spacing.xlarge}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const IconCircle = styled.View`
  width: ${RFValue(44)}px;
  height: ${RFValue(44)}px;
  border-radius: ${RFValue(22)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => rgba(theme.colors.destructive, 0.1)};
`;

export const HeaderTextGroup = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: MavenPro_700Bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Subtitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  color: ${({theme}) => theme.colors.text_gray};
  margin-top: ${({theme}) => theme.spacing.small}px;
`;

export const CloseButton = styled.TouchableOpacity`
  width: ${RFValue(32)}px;
  height: ${RFValue(32)}px;
  border-radius: ${RFValue(16)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.background_white_light};
`;

export const ReasonList = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const ReasonCard = styled.TouchableOpacity<ReasonCardProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({theme}) => theme.spacing.medium}px;
  border-width: 1px;
  border-color: ${({theme, selected}) => (selected ? theme.colors.primary : theme.colors.border)};
  background-color: ${({theme, selected}) =>
    selected ? rgba(0, 0, 0, 0.02) : theme.colors.white};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  padding: ${({theme}) => theme.spacing.medium}px ${({theme}) => theme.spacing.large}px;
  margin-bottom: ${({theme}) => theme.spacing.small}px;
`;

export const ReasonName = styled.Text<ReasonCardProps>`
  flex: 1;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({selected}) => (selected ? 'MavenPro_600SemiBold' : 'MavenPro_400Regular')};
  color: ${({theme}) => theme.colors.secondary};
`;

export const ConfirmButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  margin-top: ${({theme}) => theme.spacing.large}px;
  padding-vertical: ${({theme}) => theme.spacing.large}px;
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const ConfirmButtonText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: MavenPro_600SemiBold;
  color: ${({theme}) => theme.colors.primaryText};
`;
