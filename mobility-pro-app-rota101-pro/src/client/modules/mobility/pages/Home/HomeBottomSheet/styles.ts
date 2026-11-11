import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const DetailsContent = styled.View`
  width: 100%;
  border-top-left-radius: ${({theme}) => theme.borderRadius.xxxlarge}px;
  border-top-right-radius: ${({theme}) => theme.borderRadius.xxxlarge}px;
  padding: ${({theme}) => theme.spacing.medium}px
    ${({theme}) => theme.spacing.xlarge}px ${({theme}) => theme.spacing.medium}px;
  background-color: ${({theme}) => theme.colors.white};

  shadow-color: #000;
  shadow-offset: 0 -2px;
  shadow-opacity: 0.12;
  shadow-radius: 12px;
  elevation: 10;
`;

// Área de toque maior que o Handle visual, pra facilitar pegar o gesto de arrastar.
export const HandleArea = styled.View`
  align-self: stretch;
  align-items: center;
  padding-top: ${({theme}) => theme.spacing.small}px;
  padding-bottom: ${({theme}) => theme.spacing.medium}px;
`;

export const Handle = styled.View`
  align-self: center;
  width: ${RFValue(40)}px;
  height: ${RFValue(4)}px;
  border-radius: ${RFValue(2)}px;
  background-color: ${({theme}) => theme.colors.gray_border ?? '#E2E8F0'};
`;

export const MyLocationViewer = styled.TouchableOpacity<{
  backgroundColor: string;
}>`
  background-color: ${props =>
    props.backgroundColor
      ? props.backgroundColor
      : ({theme}) => theme.colors.primary};
  z-index: 2;
  width: 45px;
  height: 45px;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -${() => RFValue(60)}px;

  border-radius: 45px;
  padding: ${({theme}) => theme.spacing.small}px;

  margin-left: 20px;
`;

export const ContentScroll = styled.View``;

// Sem margin-bottom: o espaço até a próxima seção é sempre o margin-top dela, não daqui.
export const ContentAddress = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
  padding: 0;
  border-radius: 5px;
`;

export const PublicityWrapper = styled.View`
  margin-top: ${({theme}) => theme.spacing.xlarge}px;
  margin-horizontal: -${RFValue(25)}px;
`;
