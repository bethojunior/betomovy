import { DefaultTheme } from 'styled-components/native';
import {CityConfig} from '~/context/auth/types';

export type BubbleValidationResult = {
  valid: boolean;
  missing: string[];
};

export type BubbleConfigOptions = {
  driverId?: string | number | null;
  session?: {token: string; user: string} | null;
  cityConfig?: CityConfig | null;
  apiBaseUrl?: string | null;
  theme?: DefaultTheme | null;
};

export const bubbleValidateConfig = ({
  driverId,
  session,
  theme,
  cityConfig,
  apiBaseUrl,
}: BubbleConfigOptions): BubbleValidationResult => {
  const missing: string[] = [];

  if (!driverId) missing.push('driverId');
  if (!session?.token) missing.push('token');
  if (!session?.user) missing.push('user');
  if (!theme?.colors) missing.push('theme.colors');
  if (!apiBaseUrl) missing.push('apiBaseUrl');
  if (!cityConfig) missing.push('cityConfig');

  return {
    valid: missing.length === 0,
    missing,
  };
};
