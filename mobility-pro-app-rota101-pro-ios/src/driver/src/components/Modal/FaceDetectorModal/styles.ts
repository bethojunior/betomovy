import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import {Camera} from 'expo-camera';

export const Container = styled.View`
  flex: 1;
  padding: ${({theme}) => theme.spacing.xsslarge}px 0;
  background-color: ${({theme}) => theme.colors.background_global};
  position: relative;
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
`;

export const CameraButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  width: ${RFValue(60)}px;
  height: ${RFValue(60)}px;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
`;

export const CloseButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 50px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

export const Cam = styled(Camera)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Faces = styled.View`
  background-color: ${({theme}) => theme.colors.black};
  align-self: stretch;
  align-items: center;
  justify-content: center;
  margin: 16px;
`;

export const FaceDesc = styled.Text`
  font-size: 20px;
`;
