import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 100px;
  flex-direction: row;
  align-items: center;
`;

export const SimpleTitleContainer = styled.View`
  margin-left: ${RFValue(15)}px;
`;

export const SimpleTitle = styled.Text`
  font-family: MavenPro_600SemiBold;
  color: ${({theme}) => theme.colors.primaryText};
  font-size: ${RFValue(20)}px;
`;
