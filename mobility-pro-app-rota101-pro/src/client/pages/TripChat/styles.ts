// @ts-nocheck

import { StyleSheet } from 'react-native';
import {shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';
import { cardShadow } from '../../../common/theme/cardShadow';

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
// pra usar um valor fixo, o número de chips varia com as favoritas do passageiro.
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

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const RowText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  color: ${({theme}) => theme.colors.grayLight};
`;

export const PlateBadge = styled.View`
  background-color: ${({theme}) => theme.colors.background_white_light};
  border-radius: ${({theme}) => theme.borderRadius.small}px;
  padding: 2px ${({theme}) => theme.spacing.small}px;
  align-self: flex-start;
  margin-top: ${RFValue(4)}px;
`;

export const PlateBadgeText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-weight: 600;
  color: ${({theme}) => theme.colors.secondary};
`;

export const FavoriteDivider = styled.View`
  height: 1px;
  background-color: ${({theme}) => theme.colors.border};
  margin-top: ${({theme}) => theme.spacing.small}px;
`;

export const FavoriteButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(6)}px;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const FavoriteButtonText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-weight: 600;
  color: ${({theme}) => theme.colors.black};
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

export const FooterContent = styled.View`
background-color: ${({theme}) => theme.colors.background_white};
  border-radius: 30px;
  padding: 5px 15px;
  margin: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  /* Adicionar uma borda leve ajuda a separar visualmente do teclado */
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};`;

export const SendIconButton = styled.TouchableOpacity.attrs((props) => ({
  ...props,
  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 }
}))``;

export const FooterInput = styled.TextInput.attrs({
  placeholderTextColor: '#000000',
})`
  flex: 1;
  padding: 10px 5px;
  color: #000000;
  max-height: 100px;
`;

export const RecordingButtonContainer = styled.View`
  ${({recording}) =>
    recording &&
    css`
      width: 50px;
      align-items: center;
      justify-content: center;
      height: 180px;
      position: absolute;
      right: 0;
    `}
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

export const KeyboardWrapper = styled.View`
  background-color: ${({theme}) => theme.colors.background_white};
`;


export const ArrowContainer = styled.View`
  background-color: rgba(0,0,0,0.72);
  border-radius: 18px;
  padding: 8px 12px;
  flex-direction: row;
  align-items: center;
`;

export const ArrowText = styled.Text`
  color: white;
  font-size: 10px;
  margin-left: 5px;
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

export const FlexView = styled.View`
  flex: 1;
`;

export const footerLayoutStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
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
