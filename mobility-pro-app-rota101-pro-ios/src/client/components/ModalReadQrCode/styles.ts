// import {BarCodeScanner} from 'expo-barcode-scanner';
import { CameraView } from 'expo-camera';
import {Platform, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const ANDROID_STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? 24;

export const CameraBarCode = styled(CameraView)`
  flex: 1;
`;

export const ContainerModal = styled(SafeAreaView)`
  position: relative;
  flex: 1;
  background-color: #000;
`;

export const ContainerCentralize = styled.View`
  position: absolute;
  top: 50%;
  left: 45%;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  z-index: 1;
`;

export const HeaderBack = styled.TouchableOpacity`
  position: absolute;
  top: ${Platform.OS === 'ios' ? '5%' : `${ANDROID_STATUS_BAR_HEIGHT + 16}px`};
  left: 5%;
  z-index: 1;
`;

export const ContainerTextUpper = styled.View`
  position: absolute;
  top: 25%;
  left: 0%;
  z-index: 2;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const QrCodeCamera = styled.View`
  width: 350px;
  height: 350px;
  border: 1px solid ${({theme}) => theme.colors.primary};
  border-radius: 10px;

  border-style: dashed;
`;

export const Button = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  padding: ${({theme}) => theme.spacing.large}px;
  align-items: center;
  justify-content: center;
`;
