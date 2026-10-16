import { FC } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { StatusBadgeProps, StatusBadgeVariant } from './types';
import { Badge, BadgeText, textColorByVariant } from './styles';

const ICON_BY_VARIANT: Record<StatusBadgeVariant, string> = {
  primary: 'info-circle',
  success: 'check-circle',
  error: 'times-circle',
  warning: 'clock',
  neutral: 'info-circle',
};

export const StatusBadge: FC<StatusBadgeProps> = ({ label, variant }) => {
  const theme = useTheme();

  return (
    <Badge variant={variant}>
      <FontAwesome5
        name={ICON_BY_VARIANT[variant]}
        solid
        size={RFValue(10)}
        color={textColorByVariant(theme, variant)}
      />
      <BadgeText variant={variant}>{label}</BadgeText>
    </Badge>
  );
};
