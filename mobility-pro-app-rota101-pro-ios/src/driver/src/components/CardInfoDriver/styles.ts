import Animated from 'react-native-reanimated';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled(Animated.View)`
  flex: 1;
  position: absolute;
  width: 100%;
  background-color: ${({theme}) => theme.colors.background_global};
  z-index: 2;
  align-items: center;
  justify-content: center;

  padding: 20px;

  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  bottom: 0;
`;

export const ContainerClose = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: ${({theme}) => theme.spacing.medium}px;
`;

export const ImageClient = styled.Image`
  width: ${RFValue(75)}px;
  height: ${RFValue(75)}px;
  border-radius: ${RFValue(75)}px;
  margin-bottom: ${({theme}) => theme.spacing.medium}px;
`;

export const TextClient = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.secondary};
`;

export const AddressContent = styled.View`
  flex-direction: row;
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 0 10px;
`;

export const Ball = styled.View`
  width: 13px;
  height: 13px;
  border-radius: 100px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const Line = styled.View`
  height: auto;
  border-left-width: 0.5px;
  border-color: ${({theme}) => theme.colors.primary};
  flex: 1;
`;

export const Square = styled.View`
  width: 10px;
  height: 10px;
  background-color: ${({theme}) => theme.colors.primary};
  margin-bottom: 5px;
`;

export const Origin = styled.Text`
  font-size: 17px;

  margin-left: 10px;
  font-family: MavenPro_500Medium;
`;

export const Destination = styled.Text`
  font-size: 15px;
  margin-top: 10px;

  margin-left: 10px;
  font-family: MavenPro_400Regular;
`;

export const Address = styled.Text<any>`
  font-family: ${({selected}) =>
    selected ? 'MavenPro_500Medium' : 'MavenPro_400Regular'};
  margin-left: 10px;
  font-size: ${({selected}) => (selected ? '17px' : '15px')};
  color: ${({theme}) => theme.colors.secondary};
`;

export const ContainerPrice = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ContainerRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Price = styled.Text`
  font-size: ${RFValue(20)}px;
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.primary};
`;

export const SimpleTitle = styled.Text`
  font-family: MavenPro_400Regular;
  color: ${({theme}) => theme.colors.secondary};
`;

export const SimpleText = styled.Text`
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.secondary};
  font-size: 17px;
`;
