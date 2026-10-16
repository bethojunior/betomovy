import { Text } from './styles';

interface TextProps {
  color?: string;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  change?: 'uppercase' | 'lowercase' | 'capitalize' | string;
}

export const TextEdit = ({ color, size, children, change }: TextProps) => {
  return (
    <Text color={color} change={change} size={size}>
      {children}
    </Text>
  );
};
