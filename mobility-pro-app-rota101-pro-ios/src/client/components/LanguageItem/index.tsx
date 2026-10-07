import React from 'react';
import {ButtonView, Container, Text} from './styles';

interface Props {
  name: string;
  children: React.ReactNode;
  onPress: () => void;
  selected: boolean;
}

export function LanguageItem({name, children, onPress, selected}: Props) {
  return (
    <Container>
      <ButtonView onPress={onPress} selected={selected} activeOpacity={0.9}>
        {children}
        <Text selected={selected}>{name}</Text>
      </ButtonView>
    </Container>
  );
}
