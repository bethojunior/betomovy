import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

export const Modal = styled(Animated.View)`
  background-color: ${({theme}) => theme.colors.background_global};
  width: 100%;
  align-self: center;
  position: absolute;
  bottom: 0;
  border-radius: 8px;
  z-index: 10;
  elevation: 5;
  min-height: 350px;
  border-radius: 10px;
`;
