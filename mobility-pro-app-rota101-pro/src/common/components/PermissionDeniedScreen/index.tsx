import React, { useMemo } from 'react';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { openAppSettings } from '../../../utils/permissions';
import {
  PermissionContainer,
  PermissionTitle,
  PermissionText,
  ButtonsContainer,
  PrimaryButton,
  SecondaryButton,
  ButtonText,
} from './styles';

interface PermissionDeniedScreenProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  useModal?: boolean;
}

export const PermissionDeniedScreen: React.FC<PermissionDeniedScreenProps> = ({
  visible,
  onClose,
  title,
  message,
  iconName = 'alert-circle-outline',
  useModal = true,
}) => {
  const theme = useTheme();

  const content = useMemo(
    () => (
      <PermissionContainer>
        <Ionicons
          name={iconName}
          size={80}
          color={theme.colors.text_gray}
          style={{ marginBottom: 20 }}
        />
        <PermissionTitle>{title}</PermissionTitle>
        <PermissionText>{message}</PermissionText>

        <ButtonsContainer>
          <PrimaryButton onPress={openAppSettings}>
            <ButtonText primary>Abrir Configurações</ButtonText>
          </PrimaryButton>

          <SecondaryButton onPress={onClose}>
            <ButtonText>Fechar</ButtonText>
          </SecondaryButton>
        </ButtonsContainer>
      </PermissionContainer>
    ),
    [iconName, message, onClose, theme.colors.text_gray, title],
  );

  if (!visible) {
    return null;
  }

  if (!useModal) {
    return content;
  }

  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      {content}
    </Modal>
  );
};

