import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ConfirmBtn = styled.TouchableOpacity<{ selected: boolean }>`
  height: ${RFValue(52)}px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  background-color: ${({ theme, selected }) => (selected ? theme.colors.primary : '#e2e8f0')};
`;

export const ConfirmBtnText = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: MavenPro_600SemiBold;
  color: #ffffff;
`;
