import {useTheme} from 'styled-components';
import {SizeButtonProps} from './types';

export const useButtonView = () => {
  const theme = useTheme();

  const switchSizeButton = (sizeButton: SizeButtonProps | undefined) => {
    switch (sizeButton) {
      case 'small':
        return {
          padding: 8,
          fontSize: theme.fontSizes.medium,
        };
      case 'medium':
        return {
          padding: 12,
          fontSize: theme.fontSizes.large,
        };
      case 'large':
        return {
          padding: 16,
          fontSize: theme.fontSizes.xlarge,
        };
      default:
        return {
          padding: 12,
          fontSize: theme.fontSizes.large,
        };
    }
  };

  return {
    switchSizeButton,
  };
};
