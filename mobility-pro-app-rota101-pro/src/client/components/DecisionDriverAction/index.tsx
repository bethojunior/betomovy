import { useState } from 'react';
import { Container, ContainerRow, MarginLeft, Title } from './styles';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { If } from '../If';

interface DecisionsActionsProps {
  text: string;
  onPressAction?: (value?: string) => void;
  noActions?: boolean;
}

export const DecisionDriverAction = ({
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
              name="checkmark-circle-outline"
              size={RFValue(30)}
              color={
                localServiceFinishDecision === 'yes'
                  ? '#16a34a'
                  : '#64748b'
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
              name="close-circle-outline"
              size={RFValue(30)}
              color={
                localServiceFinishDecision === 'no'
                  ? '#dc2626'
                  : '#64748b'
              }
            />
          </MarginLeft>
        </ContainerRow>
      </If>
    </Container>
  );
};
