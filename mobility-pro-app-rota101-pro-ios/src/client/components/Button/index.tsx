import { ReactNode } from 'react';
import { TouchableOpacityProps } from 'react-native';
import { ButtonVariant, CustomButton, IconWrapper, Spinner, Title } from './styles';

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  onPress?: () => void;
  enabled?: boolean;
  inverted?: boolean;
  colorText?: string;
  color?: string;
  textSize?: number;
  variant?: ButtonVariant;
  icon?: ReactNode;
}

export function Button({
  title,
  onPress,
  enabled = true,
  loading = false,
  colorText,
  color,
  textSize,
  variant = 'solid',
  icon,
  ...rest
}: Props) {
  return (
    <CustomButton
      disabled={!enabled}
      enabled={enabled}
      onPress={onPress}
      activeOpacity={0.8}
      color={color}
      variant={variant}
      {...rest}
    >
      {loading ? (
        <Spinner color={colorText} />
      ) : (
        <>
          {icon ? <IconWrapper>{icon}</IconWrapper> : null}
          <Title textSize={textSize} enabled={enabled} variant={variant} color={colorText}>
            {title}
          </Title>
        </>
      )}
    </CustomButton>
  );
}
