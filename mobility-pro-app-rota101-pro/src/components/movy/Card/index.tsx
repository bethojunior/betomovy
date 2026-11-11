import React from 'react';
import styled from 'styled-components/native';
import { movy } from '../theme';

const Wrap = styled.View<{ $dark?: boolean }>`
  width: 100%;
  background-color: ${({ theme, $dark }) =>
    $dark ? movy.navyCard(theme) : theme.colors.white ?? '#FFFFFF'};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ theme, $dark }) =>
    $dark ? movy.darkBorder(theme) : movy.border(theme)};
  padding: ${({ theme }) => theme.spacing.xlarge}px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  elevation: 4;
`;

export interface MovyCardProps {
  dark?: boolean;
  children: React.ReactNode;
  style?: any;
}

export function MovyCard({ dark = false, children, style }: MovyCardProps) {
  return <Wrap $dark={dark} style={style}>{children}</Wrap>;
}
