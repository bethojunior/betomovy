import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  background-color: ${({theme}) => theme.colors.background_black_light};
`;

export const Content = styled.View`
  padding: 15px 10px;
  background-color: ${({theme}) => theme.colors.background_global};
  height: ${RFValue(390)}px;
  width: 100%;
  border-top-left-radius: ${({theme}) => theme.borderRadius.small}px;
  border-top-right-radius: ${({theme}) => theme.borderRadius.small}px;
`;

export const ContainerContent = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
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
