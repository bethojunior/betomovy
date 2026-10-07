import {MotiView} from 'moti';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface CardProps {
  selected?: boolean;
}

interface ContainerHeaderProps {
  centralized?: boolean;
}

export const Container = styled(MotiView)`
  align-items: center;
  height: ${RFValue(310)}px;

  width: 100%;
  position: absolute;
  bottom: 0;
  elevation: 6;
  border: 0.1px solid black;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.1;
  shadow-radius: 2px;
  border-radius: 2px;

  padding: 0 ${({theme}) => theme.spacing.large}px;
  background-color: ${({theme}) => theme.colors.background_global};

  z-index: 2;
`;

export const ContainerHeader = styled.View<ContainerHeaderProps>`
  margin: ${({theme}) => theme.spacing.large}px 0;
  align-items: ${({centralized}) => (centralized ? 'center' : 'flex-start')};
  justify-content: ${({centralized}) =>
    centralized ? 'center' : 'flex-start'};
`;

export const ContainerCard = styled.View`
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  margin-bottom: 0;
  margin-top: 0;
  width: 100%;
  flex-direction: row;
`;

export const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
`;

export const Card = styled.TouchableOpacity<CardProps>`
  align-items: center;
  justify-content: space-around;
  background-color: ${({theme, selected}) =>
    selected ? theme.colors.primary : theme.colors.background_global};
  border: 1px solid ${({theme}) => theme.colors.primary};
  flex: 1;
  height: ${RFValue(170)}px;
  margin-right: 5px;
  margin-left: 5px;
  border-radius: 10px;
  max-width: 35%;
`;

export const Image = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 100px;
`;

export const ButtonConfirm = styled.TouchableOpacity`
  width: 100%;
  padding: ${RFValue(15)}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

export const ContainerButton = styled.View`
  width: 100%;
  padding: 0 5px;

  margin-bottom: 20px;
`;
