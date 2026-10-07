import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
  align-items: center;
  padding: 0px 20px 0px 20px;
  justify-content: flex-end;
  background-color: ${({theme}) => theme.colors.background_black_light};
`;

export const Content = styled.View`
  padding: 20px 10px;
  position: relative;
  background-color: ${({theme}) => theme.colors.background_global};
  height: ${RFValue(290)}px;
  width: 100%;
  border-top-left-radius: ${({theme}) => theme.borderRadius.small}px;
  border-top-right-radius: ${({theme}) => theme.borderRadius.small}px;
`;

export const ContainerContent = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
  flex-direction: column;
  flex: 1;
  justify-content: space-around;
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
  margin-top: ${({theme}) => theme.spacing.large}px;
  bottom: 0;
  align-items: center;
  width: 100%;
  padding: ${({theme}) => theme.spacing.large}px;
  justify-content: center;
  height: ${RFValue(40)}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.small}px;
`;
