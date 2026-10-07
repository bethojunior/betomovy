import Feather from '@expo/vector-icons/Feather';
import { useTheme } from 'styled-components/native';
import { BottomSheetModal } from '../../../../client/components/BottomSheetModal';
import { translate } from '../../../../client/locales';
import {
  ScrollContent,
  TitleRow,
  IconBadge,
  TitleColumn,
  Title,
  Subtitle,
  ContentButton,
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
} from './styles';
import { ConfirmSignOutModalProps } from './types';

export function ConfirmSignOutModal({ visible, onCancel, onConfirm }: ConfirmSignOutModalProps) {
  const theme = useTheme();

  return (
    <BottomSheetModal visible={visible} onRequestClose={onCancel}>
      <ScrollContent>
        <TitleRow>
          <IconBadge>
            <Feather name="log-out" size={20} color={theme.colors.red} />
          </IconBadge>
          <TitleColumn>
            <Title>{translate('statusPending.sign_out_confirm_title')}</Title>
            <Subtitle>{translate('statusPending.sign_out_confirm_message')}</Subtitle>
          </TitleColumn>
        </TitleRow>

        <ContentButton>
          <CancelButton onPress={onCancel} activeOpacity={0.7}>
            <Feather name="x" size={16} color={theme.colors.secondary} />
            <CancelButtonText>{translate('driver_buttonModal.cancel')}</CancelButtonText>
          </CancelButton>

          <ConfirmButton onPress={onConfirm} activeOpacity={0.7}>
            <Feather name="log-out" size={16} color={theme.colors.primaryText} />
            <ConfirmButtonText>{translate('statusPending.sign_out')}</ConfirmButtonText>
          </ConfirmButton>
        </ContentButton>
      </ScrollContent>
    </BottomSheetModal>
  );
}
