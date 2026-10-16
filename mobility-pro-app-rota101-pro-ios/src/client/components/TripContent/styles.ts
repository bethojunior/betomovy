import {MotiView} from 'moti';
import styled from 'styled-components/native';

interface ContainerProps {
  bottomInset?: number;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const LoadingContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: ${({theme}) => theme.spacing.xsslarge}px 0;
`;
