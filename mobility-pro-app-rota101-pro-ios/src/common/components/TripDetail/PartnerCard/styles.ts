import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const ProfileRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(12)}px;
`;

export const Photo = styled.Image`
  width: ${RFValue(52)}px;
  height: ${RFValue(52)}px;
  border-radius: ${RFValue(26)}px;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const AvatarFallback = styled.View`
  width: ${RFValue(52)}px;
  height: ${RFValue(52)}px;
  border-radius: ${RFValue(26)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const Info = styled.View`
  flex: 1;
`;

export const Label = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.grayLight};
`;

export const Name = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${RFValue(2)}px;
`;

export const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
  margin-top: ${RFValue(4)}px;
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
