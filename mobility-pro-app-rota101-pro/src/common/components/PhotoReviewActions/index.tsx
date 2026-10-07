import { ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { translate } from '../../../client/locales';
import { Container, ButtonColumn, ActionButton, ActionLabel } from './styles';
import { PhotoReviewActionsProps } from './types';

/** Barra de ações pós-captura (refazer/usar foto) — compartilhada entre CapturePicture e FaceDetectorScreen. */
export function PhotoReviewActions({ onRetake, onConfirm, loading, bottomInset = 0 }: PhotoReviewActionsProps) {
  const theme = useTheme();

  return (
    <Container bottomInset={bottomInset}>
      <ButtonColumn>
        <ActionButton onPress={onRetake} disabled={loading} activeOpacity={0.8}>
          <Feather name="rotate-ccw" size={RFValue(24)} color={theme.colors.red} />
        </ActionButton>
        <ActionLabel>{translate('documents.retake_photo')}</ActionLabel>
      </ButtonColumn>

      <ButtonColumn>
        <ActionButton onPress={onConfirm} disabled={loading} activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color={theme.colors.border_green} />
          ) : (
            <Feather name="check" size={RFValue(24)} color={theme.colors.border_green} />
          )}
        </ActionButton>
        <ActionLabel>{translate('documents.use_photo')}</ActionLabel>
      </ButtonColumn>
    </Container>
  );
}
