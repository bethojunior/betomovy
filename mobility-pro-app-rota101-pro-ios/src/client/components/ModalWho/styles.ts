import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  align-items: center;
`;

export const Content = styled.View`
  padding: 0px 10px;
  background-color: ${({theme}) => theme.colors.background_global};
  width: 100%;
  border-top-left-radius: ${({theme}) => theme.borderRadius.small}px;
  border-top-right-radius: ${({theme}) => theme.borderRadius.small}px;
`;

export const ContainerContent = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
  flex-direction: column;
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

export const Button = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  margin-top: ${({theme}) => theme.spacing.large}px;
  margin-left: 5px;
  height: ${RFValue(60)}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.small}px;
`;