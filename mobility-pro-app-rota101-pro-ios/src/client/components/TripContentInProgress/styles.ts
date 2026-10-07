// @ts-nocheck

import styled from 'styled-components/native';
import {MotiView} from 'moti';
import {Ionicons} from '@expo/vector-icons';
import {shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';

interface ContainerProps {
  height?: number;
}

export const Container = styled(MotiView)<ContainerProps>`
  align-items: center;
  height: 260px;
  width: 100%;
  border-radius: 25px;
`;

export const HeaderContainer = styled.View`
  width: 96%;
  flex-direction: row;
  align-items: center;
  margin-top: -16px;
  justify-content: space-around;
  flex: 1;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) =>
    shade(0.05, theme.colors.background_global)};
`;

export const TripStatusContainer = styled.View`
  width: 70%;
`;

export const TripStatus = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const TripTimeContainer = styled.View`
  border-color: ${({theme}) => shade(0.06, theme.colors.background_global)};
  border-width: 1px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  width: 15%;
  height: 60%;
`;

export const CenterContainer = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px ${({theme}) => theme.spacing.xxlarge}px;
`;

export const DriverInfoContainer = styled.TouchableOpacity`
  align-items: center;
`;

export const DriverProfilePicture = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: 50px;
`;

export const DriverRatingContainer = styled.View`
  flex-direction: row;
  bottom: 0;
  position: absolute;
  background-color: ${({theme}) => theme.colors.white};
  align-items: center;
  justify-content: center;
  width: 68px;
  elevation: 1;
  border-radius: 10px;
`;

export const DriverRating = styled.Text`
  margin-right: 4px;
`;

export const NicknameContainer = styled.View`
  flex-direction: row;
  flex: 1;
  margin-left: 10px;
  align-items: center;
`;

export const Nickname = styled.Text`
  margin-left: 10px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const CarInfoContainer = styled.View`
  align-items: flex-end;
  width: 50%;
`;

export const LicensePlate = styled.Text`
  font-size: ${RFValue(18)}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const CarInfo = styled.Text`
  font-size: ${RFValue(14)}px;
  width: 80%;
  text-align: right;
  color: ${({theme}) => theme.colors.secondary};
`;

export const BottomContainer = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: row;
  padding: ${RFValue(20)}px ${RFValue(10)}px 0 ${RFValue(10)}px;
  justify-content: space-between;
  align-items: center;
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
  right: 10px;
`;

export const ShareButton = styled.Pressable`
  background-color: ${({theme}) => theme.colors.primary};
  margin: 0 ${RFValue(3)}px;
  height: ${RFValue(38)}px;
  width: ${RFValue(38)}px;
  border-radius: ${RFValue(50)}px;
  align-items: center;
  justify-content: center;
`;

export const ContainerButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  flex-direction: row;
  margin: 0 ${RFValue(3)}px;
  height: ${RFValue(38)}px;
  width: ${RFValue(38)}px;
  border-radius: ${RFValue(50)}px;
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
  margin: 0 ${RFValue(3)}px;
  height: ${RFValue(38)}px;
  width: ${RFValue(38)}px;
  border-radius: ${RFValue(50)}px;
  align-items: center;
  justify-content: center;
`;

export const Input = styled.TextInput.attrs(({theme}) => ({
  placeholderTextColor: theme.colors.black,
  // fontsize
  fontSize: theme.fontSizes.medium,
}))`
  width: 100%;
  background-color: ${({newMessage, theme}) =>
    newMessage ? theme.colors.primary : theme.colors.background_global};
  padding: ${RFValue(8)}px;
  border-width: ${RFValue(1)}px;
  border-color: ${({theme, newMessage}) =>
    newMessage ? theme.colors.primaryText : theme.colors.secondary};
  border-radius: ${RFValue(50)}px;
  flex-direction: row;
`;
