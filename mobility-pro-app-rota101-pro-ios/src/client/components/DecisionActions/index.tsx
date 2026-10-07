import React, {useState} from 'react';
import {View} from 'react-native';
import {Container, ContainerRow, MarginLeft, Title} from './styles';
import {Ionicons} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';
import {If} from '../If';
import {useTrip} from '../../contexts/Trip';
import theme from '../../styles/theme';

interface DecisionsActionsProps {
  text: string;
  onPressAction?: (value?: string) => void;
  noActions?: boolean;
}

export const DecisionsActions = ({
  onPressAction,
  text,
  noActions,
}: DecisionsActionsProps) => {
  const [localServiceFinishDecision, setLocalServiceFinishDecision] =
    useState('');

  return (
    <Container>
      <Title>{text}</Title>
      <If condition={!noActions}>
        <ContainerRow>
          <MarginLeft
            onPress={() => {
              if (localServiceFinishDecision === 'yes') {
                setLocalServiceFinishDecision('');
                onPressAction && onPressAction('none');
                return;
              }
              onPressAction && onPressAction('none');
              setLocalServiceFinishDecision('yes');
            }}
          >
            <Ionicons
              name="ios-checkmark-circle-outline"
              size={RFValue(30)}
              color={
                localServiceFinishDecision === 'yes'
                  ? 'green'
                  : theme.colors.primary
              }
            />
          </MarginLeft>
          <MarginLeft
            onPress={() => {
              if (localServiceFinishDecision === 'no') {
                setLocalServiceFinishDecision('');
                onPressAction && onPressAction('none');
                return;
              }
              onPressAction && onPressAction('reproved');
              setLocalServiceFinishDecision('no');
            }}
          >
            <Ionicons
              name="ios-close-circle-outline"
              size={RFValue(30)}
              color={
                localServiceFinishDecision === 'no'
                  ? 'red'
                  : theme.colors.primary
              }
            />
          </MarginLeft>
        </ContainerRow>
      </If>
    </Container>
  );
};
