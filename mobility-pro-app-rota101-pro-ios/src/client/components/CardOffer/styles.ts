import {Button} from 'react-native-paper';
import styled from 'styled-components/native';

export const ContainerCardOffer = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  padding: ${({theme}) => theme.spacing.medium}px;
  margin-bottom: ${({theme}) => theme.spacing.medium}px;
  border-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
`;
export const ContainerHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const ImageDriver = styled.Image`
  border-radius: 50px;
  margin-right: ${({theme}) => theme.spacing.medium}px;
  width: 50px;
  height: 50px;
`;

export const ContainerDriver = styled.View`
  flex-direction: row;
`;

export const ContainerInfo = styled.View`
  flex-direction: column;
`;

export const ContainerPrice = styled.View``;

export const ContainerFooter = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

export const ButtonRefused = styled(Button).attrs((props) => ({
  ...props,
  textColor: props.theme.colors.red,
}))`
  border: 1px solid ${({theme}) => theme.colors.red};
  border-radius: 50px;
  width: 48%;
`;
export const ButtonAccept = styled(Button).attrs({
  textColor: 'white',
})`
  background: ${({theme}) => theme.colors.border_green};
  margin-left: 10px;
  width: 48%;
  padding: 3px;
  border-radius: 50px;
`;
