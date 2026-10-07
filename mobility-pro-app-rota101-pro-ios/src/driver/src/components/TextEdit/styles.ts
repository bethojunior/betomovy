import styled from 'styled-components/native';
import themeCss from '../../styles/theme';

interface TextProps {
  color?: string;
  size?: 'small' | 'medium' | 'large';
  transform?: string;
}

export const Text = styled.Text<TextProps>`
  text-transform: ${props => props.transform || 'none'};
  font-size: ${({size}) => {
    switch (size) {
      case 'small':
        return `${themeCss.fontSizes.small}px`;
      case 'medium':
        return `${themeCss.fontSizes.medium}px`;
      case 'large':
        return `${themeCss.fontSizes.large}px`;
      default:
        return `${themeCss.fontSizes.medium}px`;
    }
  }};
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({color, theme}) => color || theme.colors.secondary};
`;
