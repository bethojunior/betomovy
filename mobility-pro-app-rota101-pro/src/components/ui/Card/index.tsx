import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Card = styled.View`
  width: 100%;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  shadow-color: ${({ theme }) => theme.shadows.small.color};
  shadow-offset: ${({ theme }) =>
    `${theme.shadows.small.offset.width}px ${theme.shadows.small.offset.height}px`};
  shadow-opacity: ${({ theme }) => theme.shadows.small.opacity};
  shadow-radius: ${({ theme }) => theme.shadows.small.radius}px;
  elevation: ${({ theme }) => theme.shadows.small.elevation};
`;

export const CardContent = styled.View`
  padding: ${RFValue(20)}px;
`;

export const CardTitle = styled.Text`
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const CardDescription = styled.Text`
  font-size: ${RFValue(14)}px;
  line-height: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.text_gray};
  font-family: ${({ theme }) => theme.fonts.regular};
  margin-top: ${RFValue(8)}px;
`;
