import styled from 'styled-components/native';
import {rgba} from 'polished';

export const Card = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({theme}) => theme.spacing.medium}px;
  padding: ${({theme}) => theme.spacing.large}px;
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  border-width: ${({theme}) => theme.borderWidth.small}px;
  border-color: ${({theme}) => rgba(theme.colors.primary, 0.12)};
  background-color: ${({theme}) => rgba(theme.colors.primary, 0.04)};
`;

export const IconWrapper = styled.View`
  align-items: center;
  justify-content: center;
  margin-right: ${({theme}) => theme.spacing.large}px;
`;

export const TextContent = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-weight: 600;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Description = styled.Text`
  margin-top: ${({theme}) => theme.spacing.small}px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.text_gray};
`;
