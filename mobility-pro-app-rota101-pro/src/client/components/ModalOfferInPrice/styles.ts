import {TextInputMask} from 'react-native-masked-text';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ContainerContent = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
  align-items: center;
`;

export const ContainerOffers = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const ContainerText = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const Image = styled.Image`
  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;
`;

export const ContainerInput = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
  width: 100%;
`;

export const InputMask = styled(TextInputMask)<{disabled: boolean}>`
  border: 1px solid
    ${({theme, disabled}) =>
      disabled ? theme.colors.red : theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.small}px;
  padding: 10px;
`;

export const Content = styled.View`
  padding: 20px 10px;
  background-color: ${({theme}) => theme.colors.background_global};
  height: 60%;
  width: 100%;
  border-top-left-radius: ${({theme}) => theme.borderRadius.small}px;
  border-top-right-radius: ${({theme}) => theme.borderRadius.small}px;
  border-bottom-left-radius: ${({theme}) => theme.borderRadius.small}px;
  border-bottom-right-radius: ${({theme}) => theme.borderRadius.small}px;
`;

export const ContainerColumn = styled.View`
  flex-direction: column;
`;

export const ContainerTextColumn = styled.View`
  margin: ${({theme}) => theme.spacing.small}px 0;
  align-items: center;
  justify-content: center;
`;
