import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

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
  text-transform: capitalize;
  padding-horizontal: ${RFValue(36)}px;
`;

export const Content = styled.ScrollView.attrs(({ theme }) => ({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: theme.spacing.large,
    gap: theme.spacing.large,
  },
}))``;

export const HeroSection = styled.View`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

export const PageTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
`;

/** Separa as áreas da página quando o documento pede mais de um tipo ao mesmo tempo (ex.: texto + arquivo). */
export const SectionDivider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;

export const CameraFallback = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.black};
  gap: ${({ theme }) => theme.spacing.large}px;
`;

export const CameraFallbackText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.large}px;
`;
