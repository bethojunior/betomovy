// @ts-nocheck

import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {rgba} from 'polished';

export const MessageReceivedContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin: 6px 0;
`;

export const ContainerAudio = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MessageSentContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin: 6px 0;
  opacity: ${({preview}) => (preview ? '0.75' : 1)};
`;

export const HeaderSentContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  font-size: 10px;
  font-weight: bold;
  color: ${({messageReceived, theme}) =>
    messageReceived ? theme.colors.secondary : theme.colors.primaryText};
  padding: 8px 0;
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
    messageReceived ? theme.colors.primary : theme.colors.primaryText};
`;

export const ControlButtonAudio = styled.Pressable`
  margin-right: 14px;
`;

export const MessageContentFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const DeliveryStatusText = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.primaryText};
`;
