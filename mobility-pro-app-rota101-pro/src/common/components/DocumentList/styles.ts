import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { cardShadow } from '../../theme/cardShadow';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const Header = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.medium}px;
  height: ${RFValue(45)}px;
`;

export const BackButton = styled.View`
  position: absolute;
  left: ${({ theme }) => theme.spacing.medium}px;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

export const ScrollContent = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    padding: theme.spacing.large,
    gap: theme.spacing.large,
  },
}))``;

export const Subtitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: ${({ theme }) => theme.colors.text_gray};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  ${cardShadow}
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xxxlarge}px;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const EmptyTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xlarge}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
`;

export const EmptyText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: ${({ theme }) => theme.colors.text_gray};
  text-align: center;
`;

export const Footer = styled.View`
  padding: ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.background_global};
`;
