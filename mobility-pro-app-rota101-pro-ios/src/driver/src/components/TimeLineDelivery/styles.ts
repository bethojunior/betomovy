import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';

export const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`;

export const InfoText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-left: 10px;
  font-family: MavenPro_400Regular;
  flex: 1;
`;

export const StatusIndicator = styled(Animated.View)<{status?: number}>`
  height: 10px;
  width: 10px;
  border-radius: 5px;
  background-color: ${({status}) => (status === 5 ? 'green' : 'red')};
  margin-left: 10px;
  align-self: flex-end;
`;
