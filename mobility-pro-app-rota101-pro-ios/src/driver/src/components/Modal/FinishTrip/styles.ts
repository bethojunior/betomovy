import {Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ChoosePriceProps {
  isOriginal?: boolean;
}

interface ContentProps {
  isTransparent: boolean;
  disableBackground: boolean;
}

interface SectionTripRewardProps {
  visible: boolean;
}

export const Content = styled.View<ContentProps>`
  display: ${({isTransparent}) => (isTransparent ? 'none' : 'flex')};
  background-color: ${({disableBackground}) =>
    disableBackground ? 'transparent' : 'rgba(0, 128, 0, 1)'};
  width: 100%;
  height: 100%;
  padding: 15px;
  position: absolute;
  z-index: 2;
`;

export const ContentButtonAvaliable = styled.View`
  flex-direction: row;
  align-self: center;
  width: 90%;
  border-bottom-width: 1px;
  margin: -2px;
`;

export const Modall = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  width: 95%;
  padding: 15px;
  align-self: center;
  align-content: center;
  min-height: 350px;
  border-radius: 8px;
  elevation: 30;
  top: 10%;
`;

export const NameClient = styled.Text`
  font-family: MavenPro_500Medium;
  font-size: 16px;
  margin-left: 5px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Section = styled.View`
  flex-direction: row;
`;

export const HeaderAvaliable = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
`;

export const ClientPhoto = styled.Image`
  width: 85px;
  height: 85px;
  border-radius: 50px;
`;

export const AvaliableText = styled.Text`
  margin: 2px 0 5px 5px;
`;

export const TitleResume = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: MavenPro_600SemiBold;
  margin-top: 15px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Info = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: ${RFValue(12)}px;
  max-width: 95%;
  color: ${({theme}) => theme.colors.secondary};
`;

export const TextButton = styled.Text`
  font-size: 17px;
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.primaryText};
`;

export const SectionTripReward = styled.View<SectionTripRewardProps>`
  display: ${({visible}) => (visible ? 'flex' : 'none')};
  border-bottom-width: 0.5px;
  border-color: ${({theme}) => theme.colors.button_text_disabled};
  padding-bottom: 20px;
  margin-bottom: 10px;
`;

export const ContainerChoosePrice = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
  width: 95%;
  align-self: center;
`;

export const SectionPayment = styled.View`
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

export const ContentChoosePrice = styled.View`
  align-items: center;
  height: 100%;
  justify-content: center;
`;

export const ButtonChoosePrice = styled.TouchableOpacity<ChoosePriceProps>`
  background-color: ${({theme, isOriginal}) =>
    isOriginal ? theme.colors.primary : theme.colors.secondary};
  padding: 12px;
  border-radius: 5px;
  margin-top: 5px;
  height: 70px;
  width: 140px;
  align-items: center;
  justify-items: center;
`;

export const TitleChoosePrice = styled.Text<ChoosePriceProps>`
  color: ${({theme}) => theme.colors.background_global};
  font-family: MavenPro_400Regular;
`;

export const Price = styled.Text<ChoosePriceProps>`
  color: ${({theme}) => theme.colors.background_global};
  font-size: 17px;
  font-family: MavenPro_500Medium;
  margin-top: 3px;
`;

export const Title = styled.Text`
  font-size: 17px;
  font-family: MavenPro_600SemiBold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const TextReward = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: 17px;
  color: ${({theme}) => theme.colors.secondary};
  text-align: justify;
  font-size: 16px;
`;

export const ConfirmButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  height: 40px;
  margin-top: 20px;
`;

export const PriceContainer = styled.View`
  align-items: center;
  width: 100%;
  margin-bottom: ${RFValue(5)}px;
`;

export const PriceText = styled.Text`
  color: black;
  font-family: MavenPro_400Regular;
  font-size: ${() => RFValue(20)}px;
`;

export const ShowPrice = styled.Text`
  color: red;
  font-weight: bold;
  font-size: ${() => RFValue(40)}px;
`;

// font-family: MavenPro_500Medium;
// font-family: MavenPro_400Regular;
