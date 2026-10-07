import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import {BottomSheetModal} from '../BottomSheetModal';
import {
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
  ContentButton,
  EyeButton,
  FieldLabel,
  Input,
  InputContainer,
  ScrollContent,
  TextError,
  Title,
  TitleRow,
} from './styles';
import {translate} from '../../locales';
import theme from '../../styles/theme';
import {customToast} from '../../../utils/FlashMessage';
import {useKeyboardHeight} from '../../../common/hooks/useKeyboardHeight';
import {ChangePasswordModalProps} from './types';

const MIN_PASSWORD_LENGTH = 6;

/**
 * Bottom sheet de troca de senha, compartilhado entre cliente e motorista.
 * A validação e a UI ficam aqui; cada app injeta suas próprias chamadas
 * de API via onCheckCurrentPassword/onUpdatePassword.
 */
const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  setVisible,
  onCheckCurrentPassword,
  onUpdatePassword,
}) => {
  const keyboardHeight = useKeyboardHeight();
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const [textError, setTextError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(false);
  };

  const handleClose = () => {
    setVisible(false);
    resetFields();
  };

  const handleConfirm = async () => {
    if (loading) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setTextError(translate('changePassword.text_empty'));
      return setError(true);
    }

    if (newPassword !== confirmPassword) {
      setTextError(translate('changePassword.text_dont_match'));
      return setError(true);
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setTextError(translate('driverProfile.text_min_password'));
      return setError(true);
    }

    setError(false);
    setLoading(true);

    const isCurrentPasswordValid = await onCheckCurrentPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      setLoading(false);
      setTextError(translate('changePassword.text_invalid'));
      return setError(true);
    }

    const result = await onUpdatePassword(newPassword);
    setLoading(false);

    if (!result?.status) {
      customToast(
        result?.message || translate('changePassword.text_status_error'),
        'danger',
      );
      return;
    }

    handleClose();
    customToast(translate('changePassword.text_status_success'), 'success');
  };

  return (
    <BottomSheetModal visible={visible} onRequestClose={handleClose}>
      <ScrollContent keyboardHeight={keyboardHeight}>
        <TitleRow>
          <Feather name="lock" size={18} color={theme.colors.primary} />
          <Title>{translate('changePassword.title')}</Title>
        </TitleRow>

        {error && <TextError>{textError}</TextError>}

        <FieldLabel>{translate('changePassword.text_current_password')}</FieldLabel>
        <InputContainer>
          <Input
            autoCapitalize="none"
            secureTextEntry={!showCurrentPassword}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <EyeButton onPress={() => setShowCurrentPassword(current => !current)}>
            <Feather
              name={showCurrentPassword ? 'eye-off' : 'eye'}
              size={18}
              color={theme.colors.grayLight}
            />
          </EyeButton>
        </InputContainer>

        <FieldLabel>{translate('changePassword.text_new_password')}</FieldLabel>
        <InputContainer>
          <Input
            autoCapitalize="none"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <EyeButton onPress={() => setShowNewPassword(current => !current)}>
            <Feather
              name={showNewPassword ? 'eye-off' : 'eye'}
              size={18}
              color={theme.colors.grayLight}
            />
          </EyeButton>
        </InputContainer>

        <FieldLabel>{translate('changePassword.text_confirm_new_password')}</FieldLabel>
        <InputContainer>
          <Input
            autoCapitalize="none"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <EyeButton onPress={() => setShowConfirmPassword(current => !current)}>
            <Feather
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={18}
              color={theme.colors.grayLight}
            />
          </EyeButton>
        </InputContainer>

        <ContentButton>
          <CancelButton onPress={handleClose} activeOpacity={0.7}>
            <Feather name="x" size={16} color={theme.colors.secondary} />
            <CancelButtonText>{translate('buttonModal.cancel')}</CancelButtonText>
          </CancelButton>

          <ConfirmButton onPress={handleConfirm} disabled={loading} activeOpacity={0.7}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <>
                <Feather name="check" size={16} color={theme.colors.white} />
                <ConfirmButtonText>{translate('buttonModal.confirm')}</ConfirmButtonText>
              </>
            )}
          </ConfirmButton>
        </ContentButton>
      </ScrollContent>
    </BottomSheetModal>
  );
};

export default ChangePasswordModal;
