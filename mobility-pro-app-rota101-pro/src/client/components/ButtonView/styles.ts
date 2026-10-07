import styled from 'styled-components/native';
import {AlignIconProps} from './types';
import theme from '../../styles/theme';

export interface IButtonProps {
  backgroundColor: string;
  padding: number;
  alignIcons: AlignIconProps;
  borderRadius: number;
  transparent: boolean;
  isLoading: boolean;
  fullWidth?: boolean;
  widthButton?: string;
}

export interface ITextButtonProps {
  textColor: string;
  fontSize: number;
}

export const Button = styled.TouchableOpacity<IButtonProps>`
  width: ${({fullWidth, widthButton}) => (fullWidth ? '100%' : widthButton)};
  background-color: ${({backgroundColor, transparent, isLoading, disabled}) =>
    transparent
      ? 'transparent'
      : isLoading || disabled
      ? theme.colors.grayLight
      : backgroundColor};
  padding: ${props => props.padding}px;
  border-radius: ${({borderRadius}) => `${borderRadius}px`};
  display: flex;
  flex-direction: ${({alignIcons}) =>
    alignIcons === 'left' ? 'row' : 'row-reverse'};
  align-items: center;
  justify-content: center;
`;

export const TextButton = styled.Text<ITextButtonProps>`
  color: ${props => props.textColor};
  font-size: ${props => props.fontSize}px;
  font-weight: bold;
`;
