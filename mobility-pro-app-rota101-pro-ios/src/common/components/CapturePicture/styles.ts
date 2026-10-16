import {TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {rgba} from 'polished';
import styled from 'styled-components/native';

interface CamProps {
  type?: 'front' | 'back' | string | null;
}

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`;

export const ButtonCapture = styled(TouchableOpacity)`
  background: ${({theme}) => theme.colors.white};
  justify-content: center;
  align-items: center;
  height: ${RFValue(72)}px;
  width: ${RFValue(72)}px;
  border-radius: ${RFValue(36)}px;
  border-width: ${RFValue(4)}px;
  border-color: ${({theme}) => rgba(theme.colors.white, 0.4)};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  elevation: 4;
`;

export const Content = styled.View`
  flex: 1;
`;

/** insetTop/insetBottom já vêm resolvidos de fora do Modal (SafeAreaView não mede certo lá dentro). */
export const TopBar = styled.View<{insetTop: number}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  flex-direction: row;
  justify-content: space-between;
  padding: ${({theme}) => theme.spacing.large}px;
  padding-top: ${({insetTop, theme}) => insetTop + theme.spacing.large}px;
`;

export const BottomBar = styled.View<{insetBottom: number}>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  align-items: center;
  padding-bottom: ${({insetBottom, theme}) => insetBottom + theme.spacing.large}px;
`;

export const ButtonClose = styled(TouchableOpacity)`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => rgba(theme.colors.black, 0.4)};
`;

export const ButtonAlter = styled(TouchableOpacity)`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => rgba(theme.colors.black, 0.4)};
`;

export const ContainerPreview = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
`;

export const Preview = styled.ImageBackground<CamProps>`
  flex: 1;
  justify-content: flex-end;
  align-self: stretch;
  transform: ${({type}) => (type === 'front' ? 'scaleX(-1)' : 'scaleX(1)')};
`;

export const Image = styled.Image`
  width: 100%;
  height: 90%;
`;
