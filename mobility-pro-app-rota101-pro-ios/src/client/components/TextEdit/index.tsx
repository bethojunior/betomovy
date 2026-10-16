import {Text} from '../ModalTransference/styles';

interface TextProps {
  color?: string;
  size?: 'small' | 'smalls' | 'medium' | 'large' | 'xlarge';
  children: React.ReactNode;
  change?: 'uppercase' | 'lowercase' | 'capitalize' | string;
  numberOfLines?: number;
  fontWeight?: 'bold' | 'normal';
}

export const TextEdit = ({ color, size, children, change, numberOfLines, fontWeight }: TextProps) => {
  return (
    <Text color={color} change={change} size={size} numberOfLines={numberOfLines} fontWeight={fontWeight}>
      {children}
    </Text>
  );
};
