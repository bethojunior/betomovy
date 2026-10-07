import {Text} from '../ModalTransference/styles';

interface TextProps {
  color?: string;
  size?: 'small' | 'smalls' | 'medium' | 'large';
  children: React.ReactNode;
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | string;
}

export const TextEdit = ({color, size, children, transform}: TextProps) => {
  return (
    <Text color={color} transform={transform} size={size}>
      {children}
    </Text>
  );
};
