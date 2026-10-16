import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import theme from '../../styles/theme';

interface BallProps {
  color: string | undefined;
}

interface ContainerCardProps {
  background: string;
}

export const ContainerCard = styled.View<ContainerCardProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${({background}) => background ? background : '#fff'};
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
`;

export const ContainerCardLeft = styled.View`
  flex-direction: row;
  flex: 1;
`;

export const ContainerTypeAndDate = styled.View`
  flex-direction: column;
  margin-left: 10px;
  flex: 1;
`;

export const P = styled.Text`
  font-size: ${RFValue(12)}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const TextTitle = styled.Text`
  font-size: ${RFValue(12)}px;
  text-transform: uppercase;
  text-align: left;
  margin-right: 10px;
`;

export const TextAddress = styled.Text`
  font-size: ${RFValue(12)}px;
  text-align: left;
  margin-right: 10px;
`;

export const TextObservation = styled.Text`
  font-size: ${RFValue(11)}px;
  text-align: left;
  margin-right: 10px;
  margin-top: 4px;
  font-style: italic;
  color: ${({theme}) => theme.colors.text_gray};
`;

export const ContainerValue = styled.View`
  flex-direction: column;
  align-items: flex-end;
`;

export const Ball = styled.View<BallProps>`
  background-color: ${({color}) => color || theme.colors.black};
  border-radius: 100px;
  width: 10px;
  height: 10px;
  align-self: center;
`;
