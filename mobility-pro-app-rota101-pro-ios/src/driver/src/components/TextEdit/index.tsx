import {Text} from './styles';

interface TextProps {
  color?: string;
  size?: 'small' | 'medium' | 'large';
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
