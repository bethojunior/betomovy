import {shade} from 'polished';
import {Platform} from 'react-native';
import styled from 'styled-components/native';

interface ButtonProps{
  backgroundColor?: string;
}

export const ContainerModal = styled.KeyboardAvoidingView`
  flex: 1;
  position: relative;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ContentModal = styled.ScrollView`
  padding: ${({theme}) => theme.spacing.medium}px;
  flex: 1;
  margin-top: ${Platform.OS === 'ios' ? '10%' : '0'};
  position: relative;
`;

export const ContainerContent = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const ContainerCards = styled.ScrollView`
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const Input = styled.TextInput`
  width: 100%;
  min-height: 50px;
  max-height: 120px;
  border-radius: 10px;
  background-color: ${({theme}) => shade(0.05, theme.colors.background_global)};
  padding: ${({theme}) => theme.spacing.small}px;
  margin-top: ${({theme}) => theme.spacing.small}px;
`;

export const ContainerDetailsDelivery = styled.View`
  padding: ${({theme}) => theme.spacing.xlarge}px 0;
  border-bottom-color: ${({theme}) => theme.colors.primary};
  border-bottom-width: 1px;
`;

export const TextError = styled.Text`
  color: ${({theme}) => theme.colors.red};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;

export const ContentDelivery = styled.View`
  margin-top: ${({theme}) => theme.spacing.small}px;
`;

export const ContainerInput = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const ContainerButton = styled.View`
  flex: 1;
  margin-top: ${({theme}) => theme.spacing.large}px;

  justify-content: flex-end;
`;

export const Button = styled.TouchableOpacity<ButtonProps>`
  width: 100%;
  background-color: ${props => props.backgroundColor ? props.backgroundColor : ({theme}) => theme.colors.primary};
  padding: ${({theme}) => theme.spacing.small}px;
  border-radius: 10px;
  align-items: center;
`;
