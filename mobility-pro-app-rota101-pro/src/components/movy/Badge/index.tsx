import React from 'react';
import styled from 'styled-components/native';
import { movy } from '../theme';

export type MovyBadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const toneColor = (tone: MovyBadgeTone, theme: any): string => {
  switch (tone) {
    case 'success':
      return movy.success(theme);
    case 'warning':
      return movy.warning(theme);
    case 'danger':
      return movy.danger(theme);
    case 'info':
      return movy.cyan(theme);
    default:
      return movy.muted(theme);
  }
};

const Wrap = styled.View<{ $tone: MovyBadgeTone }>`
  align-self: flex-start;
  border-radius: 999px;
  padding-horizontal: ${({ theme }) => theme.spacing.large}px;
  padding-vertical: ${({ theme }) => theme.spacing.small}px;
  background-color: ${({ theme, $tone }) => toneColor($tone, theme)};
`;

const Label = styled.Text<{ $tone: MovyBadgeTone }>`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme, $tone }) =>
    $tone === 'info' || $tone === 'warning' || $tone === 'neutral'
      ? movy.navy(theme)
      : '#FFFFFF'};
`;

export interface MovyBadgeProps {
  tone?: MovyBadgeTone;
  label: string;
}

export function MovyBadge({ tone = 'neutral', label }: MovyBadgeProps) {
  return (
    <Wrap $tone={tone}>
      <Label $tone={tone}>{label}</Label>
    </Wrap>
  );
}
