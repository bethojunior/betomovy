import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button} from '../../client/components/Button';
import {Card, CardDescription, CardTitle} from '../../components/ui/Card';

export const Container = styled.View`
  width: 100%;
  height: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: #00000070;
  padding: 0px ${RFValue(20)}px;
`;

export const ContentModal = styled(Card)`
  align-items: center;
  justify-content: center;
  gap: ${RFValue(6)}px;
  padding: ${RFValue(20)}px;
  border-radius: ${RFValue(24)}px;
  background-color: ${({theme}) => theme.colors.background_white};
`;

export const ContentIcon = styled.View`
  text-align: center;
  margin-bottom: ${RFValue(8)}px;
`;

export const Title = styled(CardTitle)`
  text-align: center;
`;

export const Body = styled(CardDescription)`
  text-align: center;
`;

export const ButtonCloseModal = styled(Button)`
  min-width: 100%;
  border-radius: ${RFValue(12)}px;
  margin-top: ${RFValue(16)}px;
`;

export const ButtonAccept = styled(Button)`
  min-width: 100%;
  border-radius: ${RFValue(12)}px;
  margin-top: ${RFValue(16)}px;
`;

export const TextButtonCloseModal = styled.Text`
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.primaryText};
`;
