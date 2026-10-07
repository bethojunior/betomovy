import {darken} from 'polished';
import {TextInputMask} from 'react-native-masked-text';
import styled from 'styled-components/native';

interface CardProps {
  disabled: boolean;
}

interface ButtonProps {
  selected?: boolean;
}

interface BallProps {
  color: string;
}

export const Content = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const SimpleText = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colors.background_global};
  font-family: MavenPro_400Regular;
`;

export const Card = styled.TouchableOpacity<CardProps>`
  flex-direction: row;
  background-color: ${({theme}) =>
    darken(0.03, theme.colors.background_global)};
  justify-content: space-between;
  border-radius: 5px;
  opacity: ${({disabled}) => (disabled ? 0.7 : 1)};
  elevation: 8;
  margin-top: 10px;
  width: 100%;
`;

export const DataContent = styled.View`
  padding: 15px 0 15px 15px;
  width: 60%;
`;

export const RouteName = styled.Text`
  font-size: 17px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_500Medium;
`;

export const Info = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
`;

export const TitleModal = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_400Regular;
  margin-bottom: 5px;
`;

export const InfoModal = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_500Medium;
  text-align: justify;
`;

export const Line = styled.View`
  width: 100%;
  border-top-color: ${({theme}) => theme.colors.primary};
  border-top-width: 0.5px;
  margin-top: 5px;
  margin-bottom: 5px;
`;

export const Ball = styled.View<BallProps>`
  width: 7px;
  height: 7px;
  border-radius: 50px;
  background-color: ${({color}) => color};
  margin-right: 5px;
  margin-top: 2px;
`;

export const Section = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PriceSection = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  padding: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  justify-content: space-evenly;
  width: 38%;
  align-items: center;
`;

export const TitlePrice = styled.Text`
  font-size: 16px;
  align-self: center;
  color: ${({theme}) => theme.colors.background_global};
  font-family: MavenPro_400Regular;
  margin-bottom: 10px;
`;

export const Price = styled.Text`
  color: ${({theme}) => theme.colors.background_global};
  font-family: MavenPro_500Medium;
`;

export const ButtonContent = styled.View`
  flex-direction: row;
  position: absolute;
  bottom: 0;
  justify-content: space-between;
  width: 95%;
  align-self: center;
  padding-bottom: 5px;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Button = styled.TouchableOpacity`
  align-items: center;
`;

export const CardContent = styled.View`
  width: 90%;
  align-self: center;
  height: 95%;
  padding-bottom: 10px;
`;

export const TextButton = styled.Text<ButtonProps>`
  font-family: ${({selected}) =>
    selected ? 'MavenPro_500Medium' : 'MavenPro_400Regular'};
  font-size: 15px;
  border-top-width: ${({selected}) => (selected ? 1 : 0)}px;
  border-top-color: ${({theme}) => theme.colors.primary};
  color: ${({theme}) => theme.colors.secondary};
  padding: 10px;
`;

export const ModalSection = styled.View`
  margin-top: 10px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
  border-bottom-width: 0.5px;
  padding-bottom: 10px;
`;

export const ItemOfferedButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

export const Input = styled(TextInputMask)`
  height: 30px;
  border-color: ${({theme}) => theme.colors.primary};
  border-width: 0.5px;
  border-radius: 5px;
  width: 30%;
  text-align: center;
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.secondary};
`;

export const VacanciesButton = styled.View`
  border-color: ${({theme}) => theme.colors.primary};
  border-width: 0.5px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  padding: 5px;
  width: 35%;
`;

export const VacanciesText = styled.Text`
  text-align: center;
  font-size: 18px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: MavenPro_500Medium;
`;
