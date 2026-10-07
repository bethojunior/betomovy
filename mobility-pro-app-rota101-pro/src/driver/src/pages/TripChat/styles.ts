// @ts-nocheck

import {shade} from 'polished';
import {Button} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';
import { StyleSheet } from 'react-native';
import { cardShadow } from '../../../../common/theme/cardShadow';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => shade(0.04, theme.colors.background_global)};
`;

export const InnerContainer = styled.View`
  flex: 1;
  padding-bottom: ${({keyboardOffset}) => keyboardOffset}px;
`;

export const Content = styled.ScrollView`
  flex: 1;
`;

export const MessagesContent = styled.View`
  padding-bottom: ${RFValue(16)}px;
`;

// offsetBottom vem da altura real medida do rodapé (chips + input) — não dá
// pra usar um valor fixo, o número de chips varia com as favoritas do motorista.
export const ScrollToBottomButton = styled.TouchableOpacity`
  position: absolute;
  bottom: ${({offsetBottom}) => offsetBottom}px;
  right: ${RFValue(16)}px;
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  background-color: ${({theme}) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  elevation: 10;
  z-index: 10;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
`;

export const FooterContent = styled.View`
  background-color: ${({theme}) => theme.colors.background_white};
  border-radius: 30px;
  padding: 5px 15px;
  margin: 0 10px 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
`;


// absolute: entrar/sair não pode redimensionar o ScrollView embaixo — isso
// desloca o conteúdo já visível sem mudar o scroll (parece "quebrar").
export const AutoReadCard = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
  background-color: ${({theme}) => theme.colors.white};
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  margin: ${({theme}) => theme.spacing.large}px ${({theme}) => theme.spacing.xlarge}px;
  padding: ${({theme}) => theme.spacing.medium}px ${({theme}) => theme.spacing.large}px;
  ${cardShadow}
`;

export const FooterInput = styled.TextInput`
  flex: 1;
  padding: 6px;
`;

export const RecordingButtonContainer = styled.View`
  width: ${RFValue(44)}px;
  height: ${RFValue(44)}px;
  align-items: center;
  justify-content: center;
`;

export const RecordingButton = styled.View`
  ${({recording, theme}) =>
    recording &&
    css`
      background-color: ${theme.colors.secondary};
    `}
  color: ${({theme}) => theme.colors.white};
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
`;

export const TrashIconContainer = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 50px;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
`;

export const ButtonSend = styled.TouchableOpacity`
  width: 35px;
  height: 35px;
  border-radius: 25px;
  background-color: ${({theme}) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const SendIconButton = styled.TouchableOpacity.attrs((props) => ({
  ...props,
  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 }
}))`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;


export const DragContainer = styled.View`
  position: absolute;
  bottom: 140px;
  right: 30px;
  background-color: rgba(0,0,0,0.8);
  border-radius: 15px;
  padding: 10px;
  flex-direction: row;
  align-items: center;
`;

export const DragText = styled.Text`
  color: white;
  font-size: 12px;
  margin-left: 5px;
`;

export const footerLayoutStyles = StyleSheet.create({
  arrowHint: {
    position: 'absolute',
    right: 64,
    bottom: 72,
    zIndex: 2,
  },
  fill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
