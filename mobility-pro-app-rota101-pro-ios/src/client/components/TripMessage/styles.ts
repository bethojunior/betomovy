// @ts-nocheck

import {lighten} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Message = styled.Text`
  font-size: 40px;
  font-weight: bold;
  color: ${({messageReceived, theme}) =>
    messageReceived ? theme.colors.black : theme.colors.white};
`;

export const MessageReceivedContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin: 10px 0;
`;

export const MessageSentContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin: 10px 0;
  opacity: ${({preview}) => (preview ? '0.75' : 1)};
`;

export const MesssageContent = styled.View`
  max-width: 80%;
  padding: 5px;
  min-width: 150px;
  margin: 0 10px;
  background-color: ${({messageReceived, theme}) =>
    messageReceived ? theme.colors.primaryText : theme.colors.primary};
  border-radius: 10px;
`;

export const ShippingDateText = styled.Text`
  font-size: ${RFValue(10)}px;
  color: ${({messageReceived, theme}) =>
    messageReceived ? theme.colors.primary : theme.colors.primaryText};
  padding: 8px;
`;

export const ButtonSend = styled.TouchableOpacity`
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
  border-radius: ${RFValue(30)}px;
  background-color: ${({theme}) => theme.colors.primary};
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
    messageReceived ? theme.colors.primary : theme.colors.primaryText};
`;

export const ControlButtonAudio = styled.Pressable`
  margin-right: 14px;
`;
