import {ReactNode} from 'react';
import {TouchableOpacityProps} from 'react-native';

export type SizeButtonProps = 'small' | 'medium' | 'large';

export type AlignIconProps = 'left' | 'right';

export interface IButtonViewProps extends TouchableOpacityProps {
  fullWidth?: boolean;
  widthButton?: string;
  children: ReactNode;
  colorButton?: string;
  transparent?: boolean;
  sizeButton?: SizeButtonProps | undefined;
  iconButton?: ReactNode;
  alignIcon?: AlignIconProps;
  borderRadius?: number;
  backgroundColor?: string;
  textColor?: string;
  isLoading?: boolean;
}
