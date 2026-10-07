import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const Content = styled.View`
  padding: 20px 10px;
  background-color: ${({theme}) => theme.colors.background_global};
  width: 90%;
  border-radius: ${({theme}) => theme.borderRadius.small}px;
`;

export const ContainerContent = styled.View`
  margin-top: ${({theme}) => theme.spacing.large}px;
  flex-direction: column;
  justify-content: space-around;
`;

export const Button = styled.TouchableOpacity`
  margin-top: ${({theme}) => theme.spacing.large}px;
  align-items: center;
  width: 100%;
  padding: ${({theme}) => theme.spacing.large}px;
  justify-content: center;
  height: ${RFValue(40)}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.small}px;
`;
