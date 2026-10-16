import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
`;

export const RatingText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const TripsCountText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.grayLight};
`;
