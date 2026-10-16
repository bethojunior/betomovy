import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

/** bottomInset já vem resolvido de fora do Modal (SafeAreaView não mede certo lá dentro). */
export const Container = styled.View<{ bottomInset: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xsslarge}px;
  padding-top: ${({ theme }) => theme.spacing.xxxlarge}px;
  padding-bottom: ${({ bottomInset, theme }) => bottomInset + theme.spacing.large}px;
`;

export const ButtonColumn = styled.View`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small}px;
`;

/** Mesmo componente pros dois botões — precisam ter o mesmo tamanho pra ficarem alinhados na mesma linha. */
export const ActionButton = styled.TouchableOpacity`
  width: ${RFValue(60)}px;
  height: ${RFValue(60)}px;
  border-radius: ${RFValue(30)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
`;

/** Fundo aqui é sempre foto/câmera (escuro e imprevisível) — branco com sombra garante leitura, diferente das telas de cards claros. */
export const ActionLabel = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  text-shadow-color: rgba(0, 0, 0, 0.6);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 3px;
`;
