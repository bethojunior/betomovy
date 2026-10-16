import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MarginLeft = styled.TouchableOpacity`
  margin-left: 5px;
`;

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  color: #0f172a;
  font-family: MavenPro_500Medium;
  max-width: 70%;
`;

export const ContainerRow = styled.View`
  flex-direction: row;
  align-items: center;
`;
