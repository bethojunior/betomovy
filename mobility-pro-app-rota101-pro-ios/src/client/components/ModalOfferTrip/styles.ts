import {MotiView} from 'moti';
import {shade} from 'polished';
import {Platform} from 'react-native';
import {Button} from 'react-native-paper';
import styled from 'styled-components/native';

interface BallProps {
  color?: string;
}

export const ContainerModal = styled.View`
  flex: 1;
  width: 100%;
  position: relative;
  height: 100%;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ContentModal = styled.View`
  padding: ${({theme}) => theme.spacing.large}px;
  flex: 1;
  margin-top: ${Platform.OS === 'ios' ? '10%' : '0'};
`;

export const ContainerAddress = styled.View`
  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
`;

export const MapContent = styled.View`
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.background_global};
  height: 150px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
`;

export const Address = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  margin-bottom: 10px;
`;

export const AddressContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px 10px 20px 0;
  margin-top: 10px;
  border-top-width: 0.5px;
  border-top-color: ${({theme}) => theme.colors.primary};
`;

export const Ball = styled.View<BallProps>`
  background-color: ${({theme, color}) =>
    color === 'primary' ? theme.colors.primary : theme.colors.secondary};
  border-radius: 100px;
  width: 10px;
  height: 10px;
  align-self: center;
`;

export const Destiny = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const Square = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  width: 10px;
  height: 10px;
  align-self: center;
`;

export const Line = styled.View`
  border-width: 0.8px;
  border-color: ${({theme}) => theme.colors.primary};
  flex: 1;
  width: 1px;
  align-self: center;
  border-style: dashed;
  min-height: 20px;
`;

export const ButtonOffer = styled(Button)``;
export const ButtonCancel = styled(Button)`
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${({theme}) => theme.colors.primary};
`;
export const ContainerReceivedOffers = styled.ScrollView`
  margin-top: 10px;
  flex: 1;
`;
export const TitleOffer = styled.View`
  width: 100%;
  justify-content: center;
`;

export const ContainerDot = styled.View`
  position: absolute;
  top: -10px;
`;

export const Dot = styled(MotiView)`
  width: 40px;
  height: 2px;
  border-radius: 5px;
  background-color: ${({theme}) => theme.colors.primary};
  margin: 0 20px;
`;

export const Searching = styled(MotiView)``;
