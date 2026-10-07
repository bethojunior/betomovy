import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface BallProps {
  color: string | undefined;
}

export const ContainerCard = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({theme}) => theme.spacing.xxlarge}px;
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

export const ContainerValue = styled.View`
  flex-direction: column;
  align-items: flex-end;
`;

export const Ball = styled.View<BallProps>`
  background-color: ${({color}) => color || '#000'};
  border-radius: 100px;
  width: 10px;
  height: 10px;
  align-self: center;
`;
