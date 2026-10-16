import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { USE_DARK_PRIMARY_VARIANT } from '~/constantBuild/config';

interface Props {
  size?: number;
  borderColor?: string;
  borderWidth?: number;
}

const isDarkPrimary = USE_DARK_PRIMARY_VARIANT ?? false;

export const Container = styled.View<Props>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const AvatarImage = styled.Image<Props>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-width: ${({ borderWidth }) => borderWidth ?? RFValue(2)}px;
  border-color: ${({ borderColor, theme }) => borderColor ?? theme.colors.primary};
  border-radius: ${({ size }) => size / 2}px;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const LoadingOverlay = styled.View<Props>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  align-items: center;
  justify-content: center;
  border-radius: ${({ size }) => size / 2}px;
`;

export const MenuIconBadge = styled.View<Props>`
  position: absolute;
  bottom: -${RFValue(2)}px;
  right: -${RFValue(2)}px;
  width: ${({ size }) => size * 0.42}px;
  height: ${({ size }) => size * 0.42}px;
  border-radius: ${({ size }) => (size * 0.42) / 2}px;
  background-color: ${({ theme }) => theme.colors.white};
  border-width: ${RFValue(1)}px;
  border-color: ${({ theme }) => theme.colors.border};
  align-items: center;
  justify-content: center;
`;
