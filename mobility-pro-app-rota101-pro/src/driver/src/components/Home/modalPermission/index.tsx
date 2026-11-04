import React, { useState, useEffect } from 'react';
import { Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { RFValue } from 'react-native-responsive-fontsize';
import { translate } from '../../../../../client/locales';
import theme from '../../../styles/theme';
import {
  AlertButton,
  AlertButtonText,
  AlertContainer,
  AnimationContainer,
  ButtonsContainer,
  CloseButton,
  Container,
  FoxImage,
  LoadingOverlay,
  PermissionsList,
  PermissionText,
  SubTitle,
  Title,
} from './styles';
import { ModalPermissionProps } from './types';
import { useNavigation } from '@react-navigation/native';
import * as Battery from 'expo-battery';
import Constants from 'expo-constants';
import apiMainDriver from '../../../api/apiMain';
import { useAuth } from '../../../../../context/auth';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { customToast } from '../../../../../utils/FlashMessage';

const statusPermission = {
  foreground: 'false',
  background: 'false',
  media: 'false',
  camera: 'false',
  audio: 'false',
  notifications: 'false',
};

export const getDisabledPermissions = async () => {
  const [foregroundRes, backgroundRes, cameraRes, audioRes, notificationsRes] = await Promise.all([
    Location.getForegroundPermissionsAsync().catch(() => ({ status: 'granted' })),
    Location.getBackgroundPermissionsAsync().catch(() => ({ status: 'granted' })),
    Camera.getCameraPermissionsAsync().catch(() => ({ status: 'granted' })),
    Audio.getPermissionsAsync().catch(() => ({ granted: true, status: 'granted' })),
    Notifications.getPermissionsAsync().catch(() => ({ status: 'granted' })),
  ]);

  const isAudioGranted = (audioRes as any)?.granted === true || (audioRes as any)?.status === 'granted';

  const disabledPermissions = [];
  if (foregroundRes.status !== 'granted') disabledPermissions.push('foreground');
  if (backgroundRes.status !== 'granted') disabledPermissions.push('background');
  if (cameraRes.status !== 'granted') disabledPermissions.push('camera');
  if (!isAudioGranted) disabledPermissions.push('audio');
  if (notificationsRes.status !== 'granted') disabledPermissions.push('notifications');

  return disabledPermissions;
};

export const ModalPermission: React.FC<ModalPermissionProps> = ({ onPress, open }) => {
  const [disabledPermissions, setDisabledPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { userDriver } = useAuth();
  const { checkPermission } = useBubbleButton();

  useEffect(() => {
    if (open) {
      const fetchPermissions = async () => {
        const permissions = await getDisabledPermissions();
        setDisabledPermissions(permissions);
      };

      fetchPermissions();
    }
  }, [open]);

  const getPermissionText = () => {
    if (disabledPermissions.length === 0) {
      return <PermissionText>{translate('modalPermission.allPermissionsGranted')}</PermissionText>;
    }

    return disabledPermissions.map((permission, index) => {
      let permissionText = '';
      switch (permission) {
        case 'foreground':
          permissionText = translate('modalPermission.foregroundPermission');
          break;
        case 'background':
          permissionText = translate('modalPermission.backgroundPermission');
          break;
        // case 'media':
        //   permissionText = translate('modalPermission.mediaPermission');
        //   break;
        case 'camera':
          permissionText = translate('modalPermission.cameraPermission');
          break;
        case 'audio':
          permissionText = translate('modalPermission.audioPermission');
          break;
        case 'notifications':
          permissionText = translate('modalPermission.notificationsPermission');
          break;
      }
      return (
        <PermissionText key={index}>
          {index + 1} - {permissionText}
        </PermissionText>
      );
    });
  };

  const handleSendAppInfo = async () => {
    try {
      setLoading(true);
      const batteryIsOptmization = await Battery.isBatteryOptimizationEnabledAsync();
      const isOverlay = await checkPermission();

      const payload = {
        driverId: Number(userDriver?.idDriver),
        version: Constants.expoConfig?.version || '1.0.0',
        permissionLocationBackground: statusPermission.background === 'granted',
        permissionGps: statusPermission.foreground === 'granted',
        permissionWriteExternalStorage: statusPermission.media === 'granted',
        permissionSystemOverlay: isOverlay,
        permissionIgnoreBatteryOptimization: batteryIsOptmization,
        name: userDriver?.nickname,
        userId: Number(userDriver?.idUser),
      };

      const url = 'DriverAppInfo/SendDriverAppInfo';

      console.log("URL:", url);
      console.log("Payload:", payload);

      const response = await apiMainDriver.post(url, payload);

      const data = response.data;

      if (data.status) {
        customToast(data.message, 'success');
      } else {
        customToast(data.message, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      customToast(translate('toast.text_send_data_error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    onPress();
    handleSendAppInfo().catch((error) =>
      console.error('Falha ao enviar informações do app:', error),
    );
  };

  const handleAdjustPress = () => {
    onPress();
    (navigation.navigate as any)('Config');
  };

  return (
    <Modal visible={open} transparent animationType="fade">
      <Container>
        <AlertContainer>
          <CloseButton onPress={handleCloseModal}>
            <Ionicons name="close" size={RFValue(16)} color={theme.colors.secondary} />
          </CloseButton>

          <AnimationContainer>
            <FoxImage source={require('../../../../../assets/fox-permission.webp')} />
          </AnimationContainer>

          <Title>{translate('modalPermission.title')}</Title>
          <SubTitle>{translate('modalPermission.subtitle')}</SubTitle>

          <PermissionsList>
            {getPermissionText()}
          </PermissionsList>

          <ButtonsContainer>
            <AlertButton onPress={handleAdjustPress}>
              <AlertButtonText>{translate('modalPermission.adjust')}</AlertButtonText>
            </AlertButton>
          </ButtonsContainer>
        </AlertContainer>

        {loading && (
          <LoadingOverlay>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </LoadingOverlay>
        )}
      </Container>
    </Modal>
  );
};
