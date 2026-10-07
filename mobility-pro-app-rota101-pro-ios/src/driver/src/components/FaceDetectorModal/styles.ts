import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import {Camera} from 'expo-camera';

export const Container = styled.View`
  flex: 1;
  padding: ${({theme}) => theme.spacing.xsslarge}px 0;
  background-color: ${({theme}) => theme.colors.background_global};
  position: relative;
  z-index: 15;
`;

export const Image = styled.Image`
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
`;

export const ContainerButton = styled.View`
  position: absolute;
  bottom: 60px;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
  z-index: 10;
`;

export const CameraButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  width: ${RFValue(60)}px;
  height: ${RFValue(60)}px;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  z-index: 10;
`;

export const CloseButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 50px;
  width: ${RFValue(35)}px;
  height: ${RFValue(35)}px;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

export const Cam = styled(Camera)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Faces = styled.View`
  align-self: stretch;
  align-items: center;
  justify-content: center;
  margin: 16px;
`;

export const FaceDesc = styled.Text`
  font-size: ${RFValue(10)}px;
  color: ${({theme}) => theme.colors.red};
  font-family: MavenPro_600SemiBold;
`;
