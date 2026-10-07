import Animated from 'react-native-reanimated';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ContainerModal = styled(Animated.View)`
  align-self: center;
  padding: 5px;
  z-index: 1;
  width: 100%;
  position: absolute;

  elevation: 5;
  shadow-color: #000;
`;

export const TextModal = styled.Text`
  font-size: ${RFValue(10)}px;
  text-align: center;
  font-family: MavenPro_600SemiBold;
  color: #fffafa;
`;
