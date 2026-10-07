import { Animated } from 'react-native';
import styled from 'styled-components/native';

export const Wrapper = styled(Animated.View)`
  position: absolute;
  right: ${({ theme }) => theme.spacing.large}px;
  bottom: ${({ theme }) => theme.spacing.large}px;
`;

export const Button = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
  elevation: 4;
`;
