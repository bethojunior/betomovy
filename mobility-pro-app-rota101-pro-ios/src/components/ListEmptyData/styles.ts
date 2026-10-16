import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const EmptyContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
`;

export const EmptyIconCircle = styled.View`
  width: ${RFValue(60)}px;
  height: ${RFValue(60)}px;
  border-radius: ${RFValue(30)}px;
  background-color: ${({ theme }) => theme.colors.blue_water};
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const EmptyTitle = styled.Text`
  font-size: ${RFValue(15)}px;
  font-family: MavenPro_600SemiBold;
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  margin-bottom: 6px;
`;
