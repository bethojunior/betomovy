import { RFValue } from 'react-native-responsive-fontsize';
import { rgba } from 'polished';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.black};
  align-items: center;
  justify-content: center;
`;

/** insetTop/insetBottom já vêm resolvidos de fora do Modal (SafeAreaView não mede certo lá dentro). */
export const TopBar = styled.View<{ insetTop: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  flex-direction: row;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.large}px;
  padding-top: ${({ insetTop, theme }) => insetTop + theme.spacing.large}px;
`;

export const BottomBar = styled.View<{ insetBottom: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  align-items: center;
  padding-bottom: ${({ insetBottom, theme }) => insetBottom + theme.spacing.large}px;
`;

export const CloseButton = styled.TouchableOpacity`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => rgba(theme.colors.black, 0.4)};
`;

export const ShutterButton = styled.TouchableOpacity`
  width: ${RFValue(72)}px;
  height: ${RFValue(72)}px;
  border-radius: ${RFValue(36)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white};
  border-width: ${RFValue(4)}px;
  border-color: ${({ theme }) => rgba(theme.colors.white, 0.4)};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  elevation: 4;
`;

/** align-self: stretch é obrigatório aqui — o Container pai usa align-items: center (pra centralizar o spinner/permissão),
 * o que faz esse flex:1 encolher pra largura de conteúdo (0) sem isso, colapsando a imagem do preview. */
export const PreviewContainer = styled.View`
  flex: 1;
  align-self: stretch;
`;

export const PreviewImage = styled.Image`
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
`;
