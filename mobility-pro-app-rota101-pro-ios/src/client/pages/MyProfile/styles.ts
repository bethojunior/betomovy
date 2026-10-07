import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import themeCss from '../../styles/theme';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Content = styled.View`
  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(10)}px;
  padding: ${RFValue(10)}px;
`;

export const ContentSwitch = styled.View`
  border-bottom-width: ${({theme}) => theme.borderWidth.small}px;
  border-bottom-color: ${({theme}) => theme.colors.border};
  align-items: center;
`;

export const ContentPhoto = styled.View`
  padding-top: ${RFValue(10)}px;
  padding-bottom: ${RFValue(10)}px;
  flex-direction: row;
  align-items: center;
`;

export const ButtonPhoto = styled.TouchableOpacity``;

export const CameraButton = styled.TouchableOpacity`
  background-color: ${themeCss.colors.primary};
  width: ${RFValue(60)}px;
  height: ${RFValue(60)}px;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
`;

export const Photo = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const PhotoProfile = styled.Image`
  width: ${RFValue(90)}px;
  height: ${RFValue(90)}px;
  border-radius: ${RFValue(50)}px;
`;

export const ContentUser = styled.View`
  margin-left: ${RFValue(13)}px;
`;

export const UserName = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

export const UserDocument = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
`;

export const ContentTerms = styled.View`
  align-self: center;
  margin-top: 50%;
  margin-bottom: 50%;
`;

export const ButtonTerms = styled.TouchableOpacity``;

export const ButtonTextTerms = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
`;

export const Item = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
`;
export const ContainerItem = styled.View`
  flex-direction: column;
  margin-top: 10px;
  margin-left: 10px;
`;
