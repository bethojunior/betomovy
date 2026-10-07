import {shade} from 'polished';
import {Button} from 'react-native-paper';
import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView`
  
  width: 100%;
  height: 100%;
  background: ${({theme}) => theme.colors.background_global};
`;

export const Header = styled.View`
    width: 100%;
    height: 100px;
    padding: 0 10px;
    background-color: ${({theme}) => theme.colors.primary};
    flex-direction: row;
    align-items: center;
`

export const TitleHeader = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${({theme}) => theme.colors.background_global};
    flex: 1;
    text-align: center;
`

export const ButtonBack = styled.TouchableOpacity``

export const Content = styled.View`
  flex: 1;
  margin-top: ${({theme}) => theme.spacing.large}px;
  flex-direction: column;
`;

export const ListAddress = styled.View`
  flex-direction: column;
  padding: ${({theme}) => theme.spacing.medium}px;
  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.spacing.small}px;
  background: ${({theme}) => shade(0.05, theme.colors.background_global)};
`;

export const Address = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TextAddress = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
`;

export const ContainerAddress = styled.ScrollView`
  max-height: 250px;
  margin-top: -${({theme}) => theme.spacing.large}px;
  padding: 0px ${({theme}) => theme.spacing.large}px;
  margin-bottom: 40px;
`;

export const ButtonConfirm = styled(Button)`
  background-color: ${({theme}) => theme.colors.primary};
  margin-top: ${({theme}) => theme.spacing.large}px;
  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;

export const TextConfirm = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.background_global};
`;
