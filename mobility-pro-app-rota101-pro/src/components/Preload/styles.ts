import styled from 'styled-components/native';
import theme from '~/client/styles/theme';
import { rgba } from 'polished';

export const Container = styled.View<{ transparent?: boolean }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ transparent }) =>
    transparent ? rgba('black', 0.45) : theme.colors.background_global};
`;

export const Content = styled.View`
  width: 200px;
  height: 200px;
  align-items: center;
  justify-content: center;
  position: relative;
  transform: scale(0.5);
`;

export const Splash = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: #070A1A;
`;

export const LogoImage = styled.Image`
  width: 500px;
  height: 500px;
  resize-mode: contain;
`;

export const SplashImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

export const VersionText = styled.Text`
  color: black;
  font-size: 12px;
  font-weight: bold;
  position: absolute;
  bottom: 50px;
  align-self: center;
  padding: 10px;
  z-index: 999;
`;

export const SpinnerContainer = styled.View`
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
