// @ts-nocheck

import React from 'react';
import {Button, ButtonText} from './styles';

export function ButtonCall({onPress, title, loading}) {
  return (
    <Button onPress={onPress} disabled={loading} activeOpacity={0.8}>
      <ButtonText>{title}</ButtonText>
    </Button>
  );
}
