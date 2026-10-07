import styled from 'styled-components/native';

interface ColorProps {
  color?: string;
}

export const ContainerInfo = styled.View`
  flex-direction: column;
`;

export const TextSmall = styled.Text<ColorProps>`
  color: ${({color, theme}) => color || theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const TextTitle = styled.Text`
  color: ${({theme}) => theme.colors.black};
  font-weight: bold;
  font-size: ${({theme}) => theme.fontSizes.small}px;
`;

export const Text = styled.Text`
  flex: 1;
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;
