import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

interface ButtonProps {
  btnYes?: boolean;
}

export const Content = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_black_light};
  align-items: center;
  justify-content: flex-end;
`;

export const ModalContent = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
  align-self: center;
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: ${RFValue(16)}px;
  font-family: MavenPro_600SemiBold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const SubTitle = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.secondary};
  margin: 10px 0 20px 0;
`;

export const ContentButton = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-self: center;
`;

export const Button = styled.TouchableOpacity<ButtonProps>`
  border: ${({theme}) => `0.7px solid ${theme.colors.secondary}`};
  width: 47%;
  align-items: center;
  border-radius: 5px;
  height: 55px;
  justify-content: center;
  align-items: center;
  background-color: ${({theme, btnYes}) => btnYes && theme.colors.primary};
`;

export const TextButton = styled.Text<ButtonProps>`
  font-size: ${RFValue(17)}px;
  font-family: MavenPro_400Regular;
  padding: 10px;
  color: ${({theme, btnYes}) =>
    btnYes ? theme.colors.primaryText : theme.colors.secondary};
`;
