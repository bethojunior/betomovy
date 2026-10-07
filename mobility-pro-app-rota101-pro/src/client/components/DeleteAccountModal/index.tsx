import React, { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { BottomSheetModal } from '../BottomSheetModal';
import {
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
  ContentButton,
  FieldLabel,
  FieldLabelRow,
  Input,
  ScrollContent,
  Subtitle,
  TextArea,
  Title,
  TitleRow,
} from './styles';
import { translate } from '../../locales';
import theme from '../../styles/theme';
import { useKeyboardHeight } from '../../../common/hooks/useKeyboardHeight';
import { DeleteAccountModalProps } from './types';

/**
 * Bottom sheet de exclusão de conta, compartilhado entre cliente e motorista.
 * A confirmação destrutiva e a UI ficam aqui; cada app injeta a chamada de
 * API real via onConfirm.
 */
const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const keyboardHeight = useKeyboardHeight();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const canSubmit = !!reason && !!details && !loading;

  const handleClose = () => {
    onClose();
    setReason('');
    setDetails('');
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    Alert.alert(
      translate('exclude.text_dialog_delete'),
      translate('exclude.text_dialog_delete_message'),
      [
        { text: translate('exclude.text_dialog_delete_cancel'), style: 'cancel' },
        {
          text: translate('exclude.text_dialog_delete_confirm'),
          style: 'destructive',
          onPress: () => onConfirm(reason, details),
        },
      ],
    );
  };

  return (
    <BottomSheetModal visible={visible} onRequestClose={handleClose}>
      <ScrollContent keyboardHeight={keyboardHeight}>
        <TitleRow>
          <Feather name="trash-2" size={18} color={theme.colors.red} />
          <Title>{translate('exclude.delete_account')}</Title>
        </TitleRow>
        <Subtitle>{translate('exclude.delete_account_subtitle')}</Subtitle>

        <FieldLabelRow>
          <Feather name="help-circle" size={16} color={theme.colors.secondary} />
          <FieldLabel>{translate('exclude.reason_label')}</FieldLabel>
        </FieldLabelRow>
        <Input value={reason} onChangeText={setReason} />

        <FieldLabelRow>
          <Feather name="file-text" size={16} color={theme.colors.secondary} />
          <FieldLabel>{translate('exclude.details_label')}</FieldLabel>
        </FieldLabelRow>
        <TextArea value={details} onChangeText={setDetails} />

        <ContentButton>
          <CancelButton onPress={handleClose} activeOpacity={0.7}>
            <Feather name="x" size={16} color={theme.colors.secondary} />
            <CancelButtonText>{translate('buttonModal.cancel')}</CancelButtonText>
          </CancelButton>

          <ConfirmButton onPress={handleSubmit} disabled={!canSubmit} activeOpacity={0.7}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.primaryText} />
            ) : (
              <>
                <Feather name="trash-2" size={16} color={theme.colors.primaryText} />
                <ConfirmButtonText>{translate('exclude.delete_account')}</ConfirmButtonText>
              </>
            )}
          </ConfirmButton>
        </ContentButton>
      </ScrollContent>
    </BottomSheetModal>
  );
};

export default DeleteAccountModal;
