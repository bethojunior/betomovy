import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { initialWindowMetrics, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { PermissionDeniedScreen } from '../../../common/components/PermissionDeniedScreen';
import { PhotoReviewActions } from '../../../common/components/PhotoReviewActions';
import { Mask } from '../../../driver/src/components/Mask';
import { translate } from '../../locales';
import { Container, TopBar, BottomBar, CloseButton, ShutterButton, PreviewContainer, PreviewImage } from './styles';
import { CapturedPhoto, FaceDetectorScreenProps } from './types';

/** App não tem SafeAreaProvider na raiz — mesmo padrão comprovado do TripTypePickerModal/TripFinishModal: provider local com initialMetrics estático (não depende de nenhum contexto ou evento nativo). */
export const FaceDetectorScreen = ({ visible, onClose, sendPhoto, setImage }: FaceDetectorScreenProps) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <FaceDetectorContent onClose={onClose} sendPhoto={sendPhoto} setImage={setImage} />
      </SafeAreaProvider>
    </Modal>
  );
};

function FaceDetectorContent({ onClose, sendPhoto, setImage }: Omit<FaceDetectorScreenProps, 'visible'>) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<CapturedPhoto | null>(null);
  const [sending, setSending] = useState(false);
  const camera = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission) requestPermission();
  }, []);

  const takePicture = async () => {
    const photo = await camera.current?.takePictureAsync();
    if (!photo) return;
    setImage(photo);
    setCapturedImage(photo);
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setImage(null);
  };

  const confirmPicture = async () => {
    if (!capturedImage) return;
    setSending(true);
    await sendPhoto?.(capturedImage.uri);
    setSending(false);
    setCapturedImage(null);
    onClose?.();
  };

  return (
    <Container>
      {!permission && <ActivityIndicator size="large" color={theme.colors.primary} />}

      {!!permission && !permission.granted && (
        <PermissionDeniedScreen
          visible
          useModal={false}
          onClose={onClose}
          title={translate('selectPhotoModal.permissionDeniedTitle')}
          message={translate('selectPhotoModal.cameraPermissionMessage')}
          iconName="camera-outline"
        />
      )}

      {!!permission?.granted && capturedImage && (
        <PreviewContainer>
          <PreviewImage source={{ uri: capturedImage.uri }} />
          <PhotoReviewActions
            onRetake={retakePicture}
            onConfirm={confirmPicture}
            loading={sending}
            bottomInset={insets.bottom}
          />
        </PreviewContainer>
      )}

      {!!permission?.granted && !capturedImage && (
        <CameraView ref={camera} facing="front" style={StyleSheet.absoluteFill}>
          <Mask />

          <TopBar insetTop={insets.top}>
            <CloseButton onPress={onClose} activeOpacity={0.8}>
              <Feather name="x" size={RFValue(20)} color={theme.colors.white} />
            </CloseButton>
          </TopBar>

          <BottomBar insetBottom={insets.bottom}>
            <ShutterButton onPress={takePicture} activeOpacity={0.8}>
              <Feather name="camera" size={RFValue(28)} color={theme.colors.primary} />
            </ShutterButton>
          </BottomBar>
        </CameraView>
      )}
    </Container>
  );
}
