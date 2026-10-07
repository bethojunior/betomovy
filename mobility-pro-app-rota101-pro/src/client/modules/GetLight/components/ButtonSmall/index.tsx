import React from 'react';
import {ConfirmButton, ConfirmButtonText} from './styles';

interface ButtonSmallProps {
  title: string;
  onPress: () => void;
  loading: boolean;
}

export function ButtonSmall({title, loading, onPress}: ButtonSmallProps) {
  return (
    <ConfirmButton onPress={onPress} disabled={loading} activeOpacity={0.8}>
      <ConfirmButtonText>{title}</ConfirmButtonText>
    </ConfirmButton>
  );
}
