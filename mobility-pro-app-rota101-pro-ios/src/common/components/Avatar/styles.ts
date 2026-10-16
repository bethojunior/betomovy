import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

interface SizeProps {
  size: number;
}

export const Photo = styled.Image<SizeProps>`
  width: ${({ size }) => RFValue(size)}px;
  height: ${({ size }) => RFValue(size)}px;
  border-radius: ${({ size }) => RFValue(size / 2)}px;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const Fallback = styled.View<SizeProps>`
  width: ${({ size }) => RFValue(size)}px;
  height: ${({ size }) => RFValue(size)}px;
  border-radius: ${({ size }) => RFValue(size / 2)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;
