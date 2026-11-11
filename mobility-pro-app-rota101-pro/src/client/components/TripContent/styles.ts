import {MotiView} from 'moti';
import styled from 'styled-components/native';

interface ContainerProps {
  bottomInset?: number;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  border-top-right-radius: ${({theme}) => theme.borderRadius.xxxlarge ?? 24}px;
  border-top-left-radius: ${({theme}) => theme.borderRadius.xxxlarge ?? 24}px;
  background-color: ${({theme}) => theme.colors.white ?? '#FFFFFF'};
  shadow-color: #000;
  shadow-offset: 0px -4px;
  shadow-opacity: 0.1;
  shadow-radius: 16px;
  elevation: 8;
`;

export const LoadingContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: ${({theme}) => theme.spacing.xsslarge}px 0;
`;
