// @ts-nocheck

import {lighten, rgba} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const MessageReceivedContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin: 6px 0;
`;

export const MessageSentContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin: 6px 0;
  opacity: ${({preview}) => (preview ? '0.75' : 1)};
`;

export const MesssageContent = styled.View`
  max-width: 80%;
  padding: 8px 10px;
  min-width: 100px;
  margin: 0 10px;
  background-color: ${({messageReceived, theme}) =>
    messageReceived ? rgba(theme.colors.primary, 0.12) : theme.colors.primary};
  border-radius: 10px;
  gap: ${RFValue(8)}px;
`;

export const ShippingDateText = styled.Text`
  font-size: ${RFValue(9)}px;
  color: ${({messageReceived, theme}) =>
    messageReceived ? theme.colors.secondary : theme.colors.primaryText};
  padding: 2px 0;
  opacity: 0.7;
`;

export const DeliveryStatusText = styled.Text`
  font-size: ${RFValue(9)}px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.primaryText};
`;
export const ButtonSend = styled.TouchableOpacity`
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
  border-radius: ${RFValue(30)}px;
  background-color: ${({theme}) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const HeaderSentContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ButtonSendStar = styled.TouchableOpacity`
  border-radius: 25px;
  align-items: center;
  justify-content: center;
`;

export const MessageAudioContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const AudioTimeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const AudioTime = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({messageReceived, theme}) =>
    messageReceived ? theme.colors.secondary : theme.colors.primaryText};
`;

export const ControlButtonAudio = styled.Pressable`
  margin-right: 14px;
`;
