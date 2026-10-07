import {MotiView} from 'moti';
import {lighten, shade} from 'polished';
import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import themeCss from '../../../../styles/theme';
import theme from '../../../../styles/theme';

interface ContentAdressProps {
  hasPlaces?: boolean;
}

interface CardProps {
  hasBorder?: boolean;
}

export const HeaderTitle = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 15px;
`;

export const HeaderDescription = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: 16px;
`;

export const MyLocationViewer = styled.TouchableOpacity<{
  backgroundColor: string;
}>`
  background-color: ${props =>
    props.backgroundColor
      ? props.backgroundColor
      : ({theme}) => theme.colors.primary};
  z-index: 2;
  width: 45px;
  height: 45px;
  align-items: center;
  justify-content: center;
  position: absolute;
  margin-top: -${() => RFValue(80)}px;

  border-radius: 45px;
  padding: ${({theme}) => theme.spacing.small}px;

  margin-left: 20px;
`;

export const HeaderButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.secondary};
  border-radius: 30px;
  padding: 5px 15px;
  max-width: 40%;
  margin: 15px 0 0;
`;

export const HeaderButtonText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  text-align: center;
  font-size: 16px;
`;

export const CardContainer = styled.View`
  position: absolute;
  bottom: 50px;
  align-self: center;
  flex-direction: column;
  padding: ${themeCss.spacing.large}px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const LastPlaceItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) =>
    shade(0.05, theme.colors.background_global)};
  padding: 10px 0;
`;

export const LastPlaceItemContent = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const LastPlaceItemIcon = styled.View`
  padding: 0 5px;
  background-color: ${({theme}) => theme.colors.background_white};
  width: 40px;
  height: 40px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

export const LastPlaceItemText = styled.Text`
  font-size: 16px;
  width: 90%;
  font-weight: 600;
`;

export const HeaderDetails = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export const ModuleButtonLarge = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  elevation: 3;
  padding: 10px 5px 20px 20px;
  height: 90%;
  width: 48%;
  border-radius: 10px;
`;

export const ImageLarge = styled.Image`
  width: 90px;
  height: 90px;
  align-self: flex-end;
`;

export const TextLarge = styled.Text`
  font-size: 15px;
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.primaryText};
`;

export const ContentModuleButton = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const ModuleButtonSmall = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  elevation: 3;
  padding: 10px 5px 20px 20px;
  height: 85%;
  width: 48%;
  border-radius: 10px;
`;

export const TextSmall = styled.Text`
  font-size: 13px;
  align-self: flex-end;
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.primaryText};
`;

export const ImageSmall = styled.Image`
  width: 60px;
  height: 60px;
  align-self: flex-start;
`;

export const Input = styled.TouchableOpacity`
  max-height: ${RFValue(45)}px;
  height: ${RFValue(45)}px;
  flex-direction: row;
  align-self: center;
  width: 95%;
  margin-right: 0px;
  border-width: 0.5px;
  align-items: center;
  padding-left: 10px;
  border-color: ${({theme}) => theme.colors.primary};
  color: ${({theme}) => theme.colors.secondary};
  background-color: ${({theme}) => theme.colors.background_global};
  border-radius: 5px;
  font-size: 16px;
  font-family: MavenPro_400Regular;
`;

export const ContentAddress = styled.View<ContentAdressProps>`
  margin-top: 10px;
  padding: 0;
  margin-bottom: 30px;
  border-radius: 5px;
`;

export const ContentInput = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({theme}) => theme.colors.background_global};
  width: 100%;
  position: relative;
`;

export const ContentLastPlace = styled.View<ContentAdressProps>`
  border-radius: 5px;
  display: ${({hasPlaces}) => (hasPlaces ? 'flex' : 'none')};
`;

export const CardLastPlace = styled.TouchableOpacity<CardProps>`
  flex-direction: row;
  padding: 10px 30px 10px 15px;
  align-items: center;
  border-bottom-width: ${({hasBorder}) => (hasBorder ? '0.5px' : 0)};
  border-color: ${({theme}) => theme.colors.primary};
  margin: ${RFValue(5)}px 0;
`;

export const Title = styled.Text`
  font-size: 25px;
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.secondary};
`;

export const SubTitle = styled.Text`
  font-size: 23px;
  margin-bottom: 10px;
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.secondary};
`;

export const RaceSubTitle = styled.Text`
  font-size: 23px;
  margin-bottom: 10px;
  margin-left: 5px;
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.secondary};
`;

export const DetailsContent = styled.View`
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  position: absolute;
  align-self: center;
  bottom: 0;
  padding: 20px 25px 0 25px;
  background-color: ${({theme}) => theme.colors.background_global};
  min-height: 100%;
  // condition plaform ios and android

  shadow-color: ${({theme}) => theme.colors.primary};
  shadow-offset: 0 3px;
  shadow-opacity: 0.27;
  shadow-radius: 4.65px;
  elevation: 8;
`;

export const ProfileImage = styled.Image`
  width: ${RFValue(70)}px;
  height: ${RFValue(70)}px;
  border-radius: 100px;
  border-color: ${({theme}) => theme.colors.primary};
  border-width: 1px;
`;

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-family: MavenPro_600SemiBold;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ButtonMic = styled.TouchableOpacity`
  z-index: 1;
  background-color: ${({theme}) => theme.colors.background_global};
  border-radius: 80px;
  height: ${RFValue(50)}px;
  width: ${RFValue(50)}px;
  margin-right: 5px;
  position: absolute;
  align-items: center;
  justify-content: center;
  right: 0;
`;

export const AnimatingMic = styled(MotiView)`
  align-items: center;
  justify-content: center;
`;

export const ViewVoice = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const Header = styled.View`
  flex-direction: row;
  width: 100%;
  align-self: center;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 5px;
  padding: 30px 30px 0 30px;
  height: 300px;
`;

export const styles = StyleSheet.create({
  circle: {
    borderRadius: 150,
    width: RFValue(50),
    height: RFValue(50),
    borderColor: theme.colors.white,
    borderWidth: 2,
    zIndex: 1,
    top: 0,
    bottom: 0,
    position: 'absolute',
  },
  circleSpeedMob: {
    borderRadius: 150,
    width: RFValue(60),
    height: RFValue(60),
    borderWidth: 4,
    zIndex: 1,
    top: RFValue(60),
    right: RFValue(62),
    position: 'absolute',
  },
  shadow: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: theme.colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 24,
  },
  bell: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6.9,

    elevation: 13,
  },
});

/* MÓDULO - SPEEDMOB */

export const ContentButtonCallRacer = styled.View`
  position: absolute;
  bottom: 5%;
  left: 22%;
  z-index: 10;
`;

export const ButtonCallRacer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${RFValue(190)}px;
  height: ${RFValue(190)}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-width: 5px;
  border-color: ${({theme}) => theme.colors.background_global};
  border-radius: 360px;
`;

export const TextCallRacer = styled.Text`
  font-size: ${RFValue(20)}px;
  text-align: center;
  font-weight: bold;
  color: ${({theme}) => theme.colors.background_global};
`;

export const ContentNotification = styled.TouchableOpacity``;
