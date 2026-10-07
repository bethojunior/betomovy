import {shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  margin-top: 10px;
  background-color: ${({theme}) => theme.colors.white};
  padding: ${({theme}) => theme.spacing.medium}px;
  border-radius: ${({theme}) => theme.spacing.small}px;
  width: 100%;
  position: relative;
`;

export const NameUser = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.black};
  font-family: MavenPro_400Regular;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ContainerImage = styled.View`
  position: relative;
  width: ${RFValue(80)}px;
  height: ${RFValue(80)}px;
  border-radius: ${RFValue(80)}px;
  margin-top: ${RFValue(-20)}px;
`;

export const ImageProfile = styled.Image`
  width: ${RFValue(80)}px;
  height: ${RFValue(80)}px;
  border-radius: ${RFValue(80)}px;
  position: absolute;
  left: ${RFValue(-20)}px;
  object-fit: contain;
`;

export const DriverRatingContainer = styled.View`
  flex-direction: row;
  bottom: 0;
  left: -10px;
  position: absolute;
  background-color: ${({theme}) => shade(0.1, theme.colors.white)};
  align-items: center;
  justify-content: center;
  width: 68px;
  elevation: 1;
  border-radius: 10px;
`;

export const DriverRating = styled.Text`
  margin-right: 4px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
`;

export const TextButton = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-size: ${({theme}) => theme.spacing.large}px;
  font-family: MavenPro_400Regular;
`;

export const CommentBox = styled.TextInput`
  border: 2px solid;
  min-height: 60px;
  border-color: ${({theme}) => theme.colors.primary};
  color: ${({theme}) => theme.colors.secondary};
  margin: 10px 0;
  width: 100%;
  border-radius: 10px;
  padding: 2px 6px;
`;

export const ContainerButtons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ButtonAction = styled.TouchableOpacity<{bg?: string}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 5px;
  width: 45%;
  flex: 1;
  border-radius: 10px;
  margin-right: 5px;
  background-color: ${({theme, bg, disabled}) =>
    bg ? (disabled ? shade(0.4, bg) : bg) : theme.colors.primary};
`;

export const BackgroundTip = styled.View`
  margin-bottom: 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  border-top-left-radius: 10px;
  width: 100%;

  border-top-right-radius: 10px;
  z-index: -1;
`;
