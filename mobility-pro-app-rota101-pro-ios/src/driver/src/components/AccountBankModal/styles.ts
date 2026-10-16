import { TextInputMask } from 'react-native-masked-text';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface TitleProps {
  modeEdit: boolean;
}

interface ButtonModeProps{
  backgroundColor?: string;
}

interface TextButtonModeProps{
  textColor?: string;
}

export const Title = styled.Text<TitleProps>`
  font-size: 12px;
  color: ${({theme}) => theme.colors.secondary};
  margin-bottom: ${({modeEdit}) => (modeEdit ? 0 : '-10px')};
`;

export const Input = styled(TextInputMask)`
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.secondary};
  color: ${({theme}) => theme.colors.secondary};
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 5px;
`;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: -5px;
  margin-bottom: 10px;
  justify-content: space-between;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ButtonMode = styled.TouchableOpacity<ButtonModeProps>`
  padding: 6px;
  border-radius: 5px;
  background-color: ${props => props.backgroundColor ? props.backgroundColor : ({theme}) => theme.colors.primary};
  margin-bottom: ${RFValue(15)}px;
`;

export const TextButtonMode = styled.Text<TextButtonModeProps>`
  font-size: 11px;
  color: ${({theme}) => theme.colors.primaryText};
`;

export const Section = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;