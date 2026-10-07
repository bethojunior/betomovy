import React from 'react';
import {ActivityIndicator} from 'react-native';
import theme from '../../styles/theme';

interface Props {
  loading: boolean;
  children: any;
  color?: string;
  size?: number;
  marginLeft?: number;
}
export const IfLoaderInsideScreen = ({
  children,
  loading,
  color,
  size,
  marginLeft,
}: Props) => {
  return loading ? (
    <ActivityIndicator
      size={size || 20}
      style={{
        marginVertical: 10,
        marginLeft: marginLeft ?? 0,
      }}
      color={color || theme.colors.primary}
    />
  ) : (
    <>{children}</>
  );
};
