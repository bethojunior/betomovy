import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import {RFValue} from 'react-native-responsive-fontsize';
import { useAuth } from '../../context/auth';
import { useTranslation } from '../../hooks/useTranslation';
import { useEffect, useMemo, useState } from 'react';
import { customToast } from '../../utils/FlashMessage';
import { PermissionDeniedScreen } from '../../common/components/PermissionDeniedScreen';
import { BottomSheetModal } from '../../client/components/BottomSheetModal';
import theme from '../../client/styles/theme';

import {
  Content,
  Title,
  Subtitle,
  OptionCard,
  OptionIconBadge,
  OptionTextColumn,
  OptionTitle,
  OptionDescription,
  CancelCard,
  CancelText,
} from './styles';

type PermissionTypeError = 'camera' | 'gallery';

interface ModalSelectPhotoProfileProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  sendPhoto: (asset: ImagePicker.ImagePickerAsset) => void;
  configKey?: string;
}

export const ModalSelectPhotoProfile = ({
  visible,
  setVisible,
  sendPhoto,
  configKey = 'enable_customer_open_gallery',
}: ModalSelectPhotoProfileProps) => {
  const [permissionTypeError, setPermissionTypeError] = useState<PermissionTypeError | null>(null);
  const [pressedCamera, setPressedCamera] = useState(false);
  const [pressedGallery, setPressedGallery] = useState(false);

  const { generalSettings } = useAuth();
  const { t } = useTranslation();

  const handleCloseModal = () => {
    setVisible(false);
    setPermissionTypeError(null);
  };

  useEffect(() => {
    if (visible) {
      setPressedCamera(false);
      setPressedGallery(false);
    }
  }, [visible]);

  const pickerOptions: ImagePicker.ImagePickerOptions = useMemo(() => ({
    mediaTypes: 'images',
    allowsEditing: true,
    quality: 1,
    aspect: [1, 1],
  }), []);

  const handleOpenGallery = async () => {
    setPressedGallery(false);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "denied") {
        setPermissionTypeError("gallery");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);

      if (result.canceled) {
        setVisible(false);
        return;
      }

      const asset = result.assets[0];
      sendPhoto(asset);
      setVisible(false);
    } catch (error) {
      customToast(t('selectPhotoModal.errorOpeningGallery'), 'danger');
      setVisible(false);
    }
  };

  const handleCaptureImage = async () => {
    setPressedCamera(false);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status === "denied") {
        setPermissionTypeError("camera");
        return;
      }

      const result = await ImagePicker.launchCameraAsync(pickerOptions);

      if (result.canceled) {
        setVisible(false);
        return;
      }

      const asset = result.assets[0];
      sendPhoto(asset);
      setVisible(false);
    } catch (error) {
      customToast(t('selectPhotoModal.errorOpeningCamera'), 'danger');
      setVisible(false);
    }
  }

  const selectGallery = generalSettings.find(
    data => data.key === configKey,
  );

  const getPermissionMessage = () => {
    switch (permissionTypeError) {
      case 'camera':
        return t('selectPhotoModal.cameraPermissionMessage');
      case 'gallery':
        return t('selectPhotoModal.galleryPermissionMessage');
      default:
        return '';
    }
  }

  if (permissionTypeError) {
    return (
      <PermissionDeniedScreen
        visible={visible}
        onClose={handleCloseModal}
        title={t('selectPhotoModal.permissionDeniedTitle')}
        message={getPermissionMessage()}
        iconName={permissionTypeError === 'camera' ? 'camera' : 'images-outline'}
      />
    );
  }

  return (
    <BottomSheetModal visible={visible} onRequestClose={handleCloseModal}>
      <Content>
        <Title>{t("selectPhotoModal.title")}</Title>
        <Subtitle>{t("selectPhotoModal.subtitle")}</Subtitle>

        <OptionCard
          onPress={handleCaptureImage}
          onPressIn={() => setPressedCamera(true)}
          onPressOut={() => setPressedCamera(false)}
          $pressed={pressedCamera}
        >
          <OptionIconBadge>
            <Feather name="camera" size={RFValue(20)} color={theme.colors.secondary} />
          </OptionIconBadge>
          <OptionTextColumn>
            <OptionTitle>{t("selectPhotoModal.takePhoto")}</OptionTitle>
            <OptionDescription>{t("selectPhotoModal.takePhotoDescription")}</OptionDescription>
          </OptionTextColumn>
          <Feather name="chevron-right" size={RFValue(20)} color={theme.colors.secondary} />
        </OptionCard>

        {selectGallery.value === '1' && (
          <OptionCard
            onPress={handleOpenGallery}
            onPressIn={() => setPressedGallery(true)}
            onPressOut={() => setPressedGallery(false)}
            $pressed={pressedGallery}
          >
            <OptionIconBadge>
              <Feather name="image" size={RFValue(20)} color={theme.colors.secondary} />
            </OptionIconBadge>
            <OptionTextColumn>
              <OptionTitle>{t("selectPhotoModal.selectFromDevice")}</OptionTitle>
              <OptionDescription>{t("selectPhotoModal.selectFromDeviceDescription")}</OptionDescription>
            </OptionTextColumn>
            <Feather name="chevron-right" size={RFValue(20)} color={theme.colors.secondary} />
          </OptionCard>
        )}

        <CancelCard onPress={handleCloseModal} activeOpacity={0.7}>
          <CancelText>{t("selectPhotoModal.cancel")}</CancelText>
        </CancelCard>
      </Content>
    </BottomSheetModal>
  );
};
