import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { Badge } from './styles';
import { IconBadgeProps } from './types';

export function IconBadge({ icon, variant = 'neutral', size = RFValue(40), shape = 'circle', background, color }: IconBadgeProps) {
  const theme = useTheme();

  return (
    <Badge variant={variant} size={size} shape={shape} background={background}>
      {icon(color ?? theme.colors.black)}
    </Badge>
  );
}
