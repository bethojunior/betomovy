import {MotiView} from 'moti';
import {lighten} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ContainerPanicProps {
  hasPublicity: boolean;
}

export const ContainerPanic = styled.View<ContainerPanicProps>`
  flex-direction: row-reverse;
  elevation: 5;

  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.2;
  shadow-radius: 6.27px;
  position: absolute;
  top: -100px;
  right: 5px
`;

export const ButtonPanic = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  width: 80px;
  height: 100px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const ContainerAlertPanic = styled(MotiView)`
  border-radius: 25px;
  background-color: ${({theme}) => lighten(0.4, theme.colors.primary)};
  width: 75%;
  padding-left: 15px;
  padding-right: 15%;
  margin-right: -15%;
  justify-content: center;
`;

export const ViewPanic = styled.View`
  align-items: center;
  position: absolute;
  bottom: 0;
  height: 60%;
  width: 100%;
`;
