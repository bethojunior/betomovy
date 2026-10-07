import React, { useEffect, useRef } from 'react';
import { Modal, Image, ScrollView, BackHandler, Platform } from 'react-native';
import { usePermissionsContext } from './PermissionsProvider';
import { PermissionType, PermissionModalProps } from './types';
import { MODAL_SUCCESS_DISPLAY_TIME_MS } from './constants';
import { getMissingRequiredPermissions } from './utils';
import { useAuth } from '../../context/auth';
import {
  Container,
  AlertContainer,
  AnimationContainer,
  Title,
  SubTitle,
  PermissionsList,
  PermissionItem,
  ButtonsContainer,
  AlertButton,
  SuccessText,
  PermissionText,
  ButtonText,
} from './styles';

export const PermissionModal: React.FC<PermissionModalProps> = ({ translate }) => {
  const { signed, tokenDriver } = useAuth();
  const isAuthenticated = Boolean(signed || tokenDriver);

  const {
    showPermissionModal,
    setShowPermissionModal,
    disabledPermissions,
    openSettings,
  } = usePermissionsContext();

  const missingRequired = getMissingRequiredPermissions(disabledPermissions);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android' || !showPermissionModal) return;
    const currentMissingRequired = getMissingRequiredPermissions(disabledPermissions);
    if (currentMissingRequired.length === 0) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, [showPermissionModal, disabledPermissions]);

  useEffect(() => {
    if (missingRequired.length === 0 && showPermissionModal) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setShowPermissionModal(false);
        }
      }, MODAL_SUCCESS_DISPLAY_TIME_MS);
    } else if (missingRequired.length > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [disabledPermissions, showPermissionModal, setShowPermissionModal, missingRequired.length]);

  const getPermissionText = (permission: PermissionType): string => {
    switch (permission) {
      case 'foreground':
        return translate('modalPermission.foregroundPermission');
      case 'camera':
        return translate('modalPermission.cameraPermission');
      case 'audio':
        return translate('modalPermission.audioPermission');
      case 'notifications':
        return translate('modalPermission.notificationsPermission');
      default:
        return '';
    }
  };

  const handleAdjustPress = () => {
    openSettings();
  };

  const handleRequestClose = () => {
    const currentMissingRequired = getMissingRequiredPermissions(disabledPermissions);
    if (currentMissingRequired.length > 0) {
      return;
    }
    setShowPermissionModal(false);
  };

  const renderPermissionsList = () => {
    if (missingRequired.length === 0 && showPermissionModal) {
      return (
        <PermissionItem>
          <SuccessText>
            ✓ {translate('modalPermission.allPermissionsGranted')}
          </SuccessText>
        </PermissionItem>
      );
    }

    return missingRequired.map((permission, index) => (
      <PermissionItem key={permission}>
        <PermissionText>
          {index + 1}. {getPermissionText(permission)}
        </PermissionText>
      </PermissionItem>
    ));
  };

  if (!isAuthenticated || !showPermissionModal) {
    return null;
  }

  return (
    <Modal
      visible={showPermissionModal}
      transparent
      animationType="fade"
      onRequestClose={handleRequestClose}
    >
      <Container>
        <AlertContainer>
          <AnimationContainer>
            <Image
              source={require('../../assets/fox-permission.webp')}
              style={{ width: 120, height: 120 }}
            />
          </AnimationContainer>

          <Title>{translate('modalPermission.title')}</Title>
          <SubTitle>{translate('modalPermission.subtitle')}</SubTitle>

          <ScrollView
            style={{ maxHeight: 200, width: '100%' }}
            showsVerticalScrollIndicator={false}
          >
            <PermissionsList>
              {renderPermissionsList()}
            </PermissionsList>
          </ScrollView>

          {missingRequired.length > 0 && (
            <PermissionText style={{ marginTop: 12, fontStyle: 'italic' }}>
              {translate('modalPermission.permissionsHint')}
            </PermissionText>
          )}

          <ButtonsContainer>
            <AlertButton onPress={handleAdjustPress}>
              <ButtonText>
                {translate('modalPermission.adjust')}
              </ButtonText>
            </AlertButton>
          </ButtonsContainer>
        </AlertContainer>
      </Container>
    </Modal>
  );
};
