// @ts-nocheck

import styled from 'styled-components/native';
import {MotiView} from 'moti';
import {Ionicons, Feather} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';
import {Dimensions} from 'react-native';
import {rgba} from 'polished';

interface ContainerProps {
  height?: number;
}

export const Container = styled(MotiView)<ContainerProps>`
  width: ${Dimensions.get('window').width}px;
  border-top-left-radius: ${({theme}) => theme.borderRadius.xxlarge}px;
  border-top-right-radius: ${({theme}) => theme.borderRadius.xxlarge}px;
  overflow: hidden;
  padding: 0 ${({theme}) => theme.spacing.large}px;
  background-color: ${({theme}) => theme.colors.white};
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 6px;
  elevation: 8;
`;

export const Handle = styled.View`
  align-self: center;
  width: ${RFValue(40)}px;
  height: ${RFValue(4)}px;
  border-radius: ${RFValue(2)}px;
  background-color: ${({theme}) => theme.colors.border};
  margin-top: ${({theme}) => theme.spacing.medium}px;
  margin-bottom: ${({theme}) => theme.spacing.small}px;
`;

export const HeaderContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({theme}) => theme.spacing.medium}px;
  padding-vertical: ${({theme}) => theme.spacing.medium}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.border_white_light};
`;

export const StatusIcon = styled(Ionicons)`
  margin-top: ${RFValue(2)}px;
`;

export const TripStatusContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  gap: ${({theme}) => theme.spacing.small}px;
`;

export const TripStatus = styled.Text`
  flex: 1;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  line-height: ${({theme}) => theme.fontSizes.medium + 4}px;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: 600;
`;

export const TripTimeContainer = styled.View`
  background-color: ${({theme}) => rgba(theme.colors.primary, 0.12)};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  align-items: center;
  justify-content: center;
  padding-vertical: ${({theme}) => theme.spacing.small}px;
  width: ${RFValue(52)}px;
`;

export const TripTimeValue = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.secondary};
`;

export const TripTimeLabel = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const CenterContainer = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.large}px;
  padding-top: ${({theme}) => theme.spacing.large}px;
  padding-bottom: ${({theme}) => theme.spacing.large}px;
`;

export const DriverInfoContainer = styled.TouchableOpacity`
  align-items: center;
`;

export const DriverProfilePictureContainer = styled.View`
  width: ${RFValue(64)}px;
  height: ${RFValue(64)}px;
  border-radius: ${RFValue(32)}px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  padding: 2px;
  margin-bottom: ${RFValue(6)}px;
  align-items: center;
  justify-content: center;
`;

export const DriverProfilePicture = styled.Image`
  width: ${RFValue(58)}px;
  height: ${RFValue(58)}px;
  border-radius: ${RFValue(29)}px;
`;

export const DriverRatingContainer = styled.View`
  flex-direction: row;
  bottom: 0;
  position: absolute;
  background-color: ${({theme}) => theme.colors.white};
  align-items: center;
  justify-content: center;
  gap: ${RFValue(2)}px;
  width: ${RFValue(56)}px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
`;

export const DriverRating = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.secondary};
`;

export const NicknameContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.small}px;
`;

export const Nickname = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const CarInfoContainer = styled.View`
  flex: 1;
`;

export const LicensePlate = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.secondary};
`;

export const CarInfo = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  color: ${({theme}) => theme.colors.text_gray};
`;

export const BottomContainer = styled.View`
  width: 100%;
  flex-direction: row;
  margin-top: ${({theme}) => theme.spacing.xlarge}px;
  gap: ${({theme}) => theme.spacing.medium}px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;

export const ContainerPressable = styled.Pressable`
  flex: 1;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const ChatIcon = styled(Ionicons)`
  position: absolute;
  right: ${RFValue(14)}px;
`;

export const ShareButton = styled.Pressable`
  background-color: ${({theme}) => theme.colors.primary};
  height: ${RFValue(40)}px;
  width: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  align-items: center;
  justify-content: center;
`;

export const ContainerButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  flex-direction: row;
  height: ${RFValue(40)}px;
  width: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  align-items: center;
  justify-content: center;
`;

export const ContainerAddress = styled.ScrollView`
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;
`;

export const CancelButton = styled.Pressable`
  background-color: ${({theme}) => theme.colors.primary};
  height: ${RFValue(40)}px;
  width: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  align-items: center;
  justify-content: center;
`;

export const Input = styled.TextInput.attrs(({theme}) => ({
  placeholderTextColor: theme.colors.black,
  editable: false,
}))`
  height: ${RFValue(40)}px;
  width: 100%;
  background-color: ${({theme}) => theme.colors.primary};
  padding-left: ${RFValue(16)}px;
  padding-right: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  color: ${({theme}) => theme.colors.black};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-weight: 700;
`;

export const MoreInfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MoreInfoButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(2)}px;
`;

export const MoreInfo = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.blue};
`;

export const NicknameIcon = styled(Feather).attrs((props) => ({
  size: RFValue(16),
  color: props.theme.colors.grayLight,
  ...props,
}))``;
