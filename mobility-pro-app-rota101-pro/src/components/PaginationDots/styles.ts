import styled from 'styled-components/native';

interface ContainerProps {
  spacing: number;
}

interface DotProps {
  size: number;
  color: string;
}

export const Container = styled.View<ContainerProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ spacing }) => spacing}px;
`;

export const Dot = styled.View<DotProps>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${({ color }) => color};
`;
