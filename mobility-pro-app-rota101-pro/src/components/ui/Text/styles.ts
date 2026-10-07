import styled from 'styled-components/native';
import { IText } from '.';

export const StyledText = styled.Text<IText>`
  flex: 1;
  text-align: ${({ align }) => align ?? 'left'};
  font-family: ${({theme, font}) => theme.fonts[font ?? 'regular']};
  font-size: ${({theme, size}) => theme.fontSizes[size ?? 'smalls']}px;
  color: ${({theme, color}) => theme.colors[color ?? 'secondary']};
`;
