import {BarCodeScanner} from 'expo-barcode-scanner';
import {Platform} from 'react-native';
import styled from 'styled-components/native';

export const CameraBarCode = styled(BarCodeScanner)`
  flex: 1;
`;

export const ContainerModal = styled.View`
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
  top: ${Platform.OS === 'ios' ? 5 : 0}%;
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
