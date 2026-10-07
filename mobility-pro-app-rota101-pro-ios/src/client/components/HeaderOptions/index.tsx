import React from 'react';
import {TouchableOpacityProps} from 'react-native';
import {useAuth} from '../../../context/auth';
import {If} from '../If';

import {
  ButtonOptionList,
  ButtonOptionMap,
  Container,
  TextButtonList,
  TextButtonMap,
} from './styles';

interface Props extends TouchableOpacityProps {
  onPress: () => void;
  active?: boolean;
  optionOne: string;
  optionTwo: string;
}

export function HeaderOptions({onPress, active, optionOne, optionTwo}: Props) {
  return (
    <Container>
      <ButtonOptionList
        onPress={active ? onPress : () => {}}
        active={active}
        onlyButton={false}
        activeOpacity={0.7}
      >
        <TextButtonList active={active}>{optionOne}</TextButtonList>
      </ButtonOptionList>

      <ButtonOptionMap
        onPress={active === false ? onPress : () => {}}
        active={active}
      >
        <TextButtonMap active={active}>{optionTwo}</TextButtonMap>
      </ButtonOptionMap>
    </Container>
  );
}
