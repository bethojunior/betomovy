import React from "react";
import { StyledText } from "./styles";
import theme from '~/client/styles/theme';
import { TextProps } from "react-native";

export interface IText extends TextProps {
  children: React.ReactNode;
  font?: keyof typeof theme['fonts'];
  size?: keyof typeof theme['fontSizes'];
  color?: keyof typeof theme['colors'];
  align?: 'left' | 'center' | 'right';
}

export const Text: React.FC<IText> = (props) => {
  return <StyledText {...props} />;
};
