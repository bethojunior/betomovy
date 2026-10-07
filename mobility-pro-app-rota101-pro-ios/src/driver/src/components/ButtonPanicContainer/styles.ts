import {MotiView} from 'moti';
import {lighten} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ContainerPanic = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.2;
  shadow-radius: 6.27px;
`;

export const ButtonPanic = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  width: 50px;
  height: 50px;
  border-radius: 45px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const ContainerAlertPanic = styled(MotiView)`
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  background-color: ${({theme}) => lighten(0.4, theme.colors.primary)};
  width: 70%;
  right: -15px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const ViewPanic = styled.View`
  align-items: center;
  position: absolute;
  bottom: 0;
  height: 60%;
  width: 100%;
`;
