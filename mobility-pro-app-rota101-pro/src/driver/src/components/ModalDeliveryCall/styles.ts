import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Header = styled.View`
  align-items: center;
  justify-content: center;
  height: 80px;
  border-bottom-width: 0.5px;
  padding-top: ${RFValue(10)}px;
  margin-top: ${RFValue(10)}px;
`;

export const HeaderTitle = styled.Text<{color?: string; size?: number}>`
  font-size: ${({size}) => RFValue(size || 22)}px;
  font-family: MavenPro_600SemiBold;
  color: ${({color}) => color || '#000'};
`;

export const ContainersButton = styled.View`
  flex-direction: row;
  justify-content: space-around;
  border-top-width: 0.5px;
  align-items: center;
  height: 10%;
`;

export const Ball = styled.View<any>`
  background-color: ${({theme, color}) =>
    color === 'primary' ? theme.colors.primary : theme.colors.secondary};
  border-radius: 100px;
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

export const Logo = styled.Image`
  position: absolute;
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;
  border-radius: ${RFValue(25)}px;
  top: ${RFValue(40)}px;
  left: ${RFValue(10)}px;
  z-index: 10;
`;

export const ContainerAddress = styled.View`
  margin-left: 10px;
  width: 90%;
`;

export const AddressTitle = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: MavenPro_600SemiBold;
`;

export const Address = styled.Text`
  color: ${({theme}) => theme.colors.text_gray};
  margin-left: 5px;
`;
