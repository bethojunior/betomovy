import { FC } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { AvatarProps } from './types';
import { Photo, Fallback } from './styles';

const DEFAULT_SIZE = 44;

export const Avatar: FC<AvatarProps> = ({
  photoUrl,
  size = DEFAULT_SIZE,
  accessibilityLabel,
}) => {
  const theme = useTheme();

  if (photoUrl) {
    return (
      <Photo
        source={{ uri: photoUrl }}
        size={size}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  return (
    <Fallback size={size} accessibilityLabel={accessibilityLabel}>
      <MaterialIcons name="person" size={RFValue(size * 0.46)} color={theme.colors.white} />
    </Fallback>
  );
};
