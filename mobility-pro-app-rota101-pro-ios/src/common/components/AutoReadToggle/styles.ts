import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { rgba } from 'polished';

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const IconWrapper = styled.View`
  width: ${RFValue(44)}px;
  height: ${RFValue(44)}px;
  border-radius: ${RFValue(22)}px;
  background-color: ${({ theme }) => rgba(theme.colors.primary, 0.12)};
  align-items: center;
  justify-content: center;
`;

export const TextColumn = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Description = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.grayLight};
  margin-top: ${RFValue(2)}px;
`;
