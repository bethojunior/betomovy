import {Dimensions, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Image = styled.Image`
  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;
  margin: ${RFValue(20)}px;
  padding: 0px;
  border-radius: ${({theme}) => theme.borderRadius.small}px;
`;

export const ImageBackground = styled.ImageBackground`
  flex: 1;
`;

export const Content = styled.View`
  position: absolute;
  padding-left: ${({theme}) => theme.spacing.xxlarge}px;
  padding-right: ${({theme}) => theme.spacing.xxlarge}px;
  padding-top: ${({theme}) => theme.spacing.medium}px;
  padding-bottom: ${({theme}) => theme.spacing.medium}px;
  background-color: ${({theme}) => theme.colors.background_global};
  width: ${windowWidth}px;
  height: ${windowHeight / 4}px;
  bottom: 0px;
`;

export const ViewGuest = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Label = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
  margin-top: ${RFValue(8)}px;
`;

export const ButtonGuest = styled(TouchableOpacity)`
  align-items: center;
  margin-top: ${RFValue(20)}px;
`;

export const TextButtonGuest = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
  margin-right: ${RFValue(8)}px;
`;