import { FC } from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components/native';
import { translate } from '../../client/locales';
import { LoadingContainer, LoadingSubtitle, LoadingTitle } from './styles';

interface PixLoadingStateProps {
  title?: string;
  subtitle?: string;
}

export const PixLoadingState: FC<PixLoadingStateProps> = ({ title, subtitle }) => {
  const theme = useTheme();

  return (
    <LoadingContainer>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <LoadingTitle>{title ?? translate('paymentPage.pix_generating')}</LoadingTitle>
      <LoadingSubtitle>
        {subtitle ?? translate('paymentPage.pix_generating_subtitle')}
      </LoadingSubtitle>
    </LoadingContainer>
  );
};

export default PixLoadingState;
