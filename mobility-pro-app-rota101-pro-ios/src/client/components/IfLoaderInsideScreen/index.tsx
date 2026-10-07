import React from 'react';
import {ActivityIndicator} from 'react-native';
import theme from '../../styles/theme';

interface Props {
  loading: boolean;
  children: any;
  size?: number;
}
export const IfLoaderInsideScreen = ({children, loading, size}: Props) => {
  return loading ? (
    <ActivityIndicator
      size={size ? size : 20}
      style={{marginVertical: 10}}
      color={theme.colors.primary}
    />
  ) : (
    <>{children}</>
  );
};
