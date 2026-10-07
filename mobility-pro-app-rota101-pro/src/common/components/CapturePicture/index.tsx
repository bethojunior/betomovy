import { ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { PermissionDeniedScreen } from '../PermissionDeniedScreen';
import { PhotoReviewActions } from '../PhotoReviewActions';
import { useTheme } from 'styled-components';
import {
  ButtonAlter,
  ButtonCapture,
  ButtonClose,
  Container,
  ContainerPreview,
  Preview,
  TopBar,
  BottomBar,
} from './styles';
import { resizeImage } from '../../../utils/image';
import * as FileSystem from 'expo-file-system/legacy';
import { customToast } from '../../../utils/FlashMessage';
import { translate } from '../../../client/locales';
import { sanitizeFilename, getMimeType } from '../../../utils/fileSecurity';
import { FILE_SIZE_LIMITS } from '../../../utils/fileValidation';
import { UploadFile } from '../../services/documents/types';

interface CamProps {
  savePicture: (photo: UploadFile) => void;
  setVisibleCamera: (visible: boolean) => void;
}

export default function CapturePicture({
  savePicture,
  setVisibleCamera,
}: CamProps) {
  // Só funciona porque quem abre o Modal desta tela envolve com <SafeAreaProvider initialMetrics={initialWindowMetrics}> — o app não tem provider na raiz.
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<{ uri: string } | null>(null);
  const [type, setType] = useState<'front' | 'back'>('back');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!permission) await requestPermission();
    })();
  }, []);

  if (!permission) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Container>
    );
  }

  if (!permission.granted) {
    return (
      <PermissionDeniedScreen
        visible
        useModal={false}
        onClose={() => setVisibleCamera(false)}
        title={translate('selectPhotoModal.permissionDeniedTitle')}
        message={translate('selectPhotoModal.cameraPermissionMessage')}
        iconName="camera-outline"
      />
    );
  }

  const takePic = async () => {
    try {
      const newPhoto = await cameraRef.current?.takePictureAsync({
        quality: 0.1,
        base64: false,
      });
      if (newPhoto) setPhoto(newPhoto);
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
    }
  };

  if (photo) {
    const savePhoto = async () => {
      if (saving) return;

      setSaving(true);
      try {
        const manipulatedImage = await resizeImage(photo.uri, 512, 512);

        const fileInfo = await FileSystem.getInfoAsync(manipulatedImage.uri);

        if (fileInfo.exists && !fileInfo.isDirectory && fileInfo.size > FILE_SIZE_LIMITS.IMAGE) {
          customToast(translate('errors.file_size_exceeded', { limitMB: FILE_SIZE_LIMITS.IMAGE / (1024 * 1024) }), 'danger');
          setSaving(false);
          return;
        }

        const filename = manipulatedImage.uri?.split('/').pop();
        const sanitizedFilename = sanitizeFilename(filename, 'image.jpg');
        const typeImage = getMimeType(sanitizedFilename, 'image/jpeg');

        savePicture({
          uri: manipulatedImage.uri,
          type: typeImage,
          name: sanitizedFilename,
        });
      } catch (error) {
        console.error('Erro ao salvar foto:', error);
      } finally {
        setSaving(false);
      }
    };

    return (
      <ContainerPreview>
        <Preview source={{ uri: photo.uri }}>
          <PhotoReviewActions
            onRetake={() => setPhoto(null)}
            onConfirm={savePhoto}
            loading={saving}
            bottomInset={insets.bottom}
          />
        </Preview>
      </ContainerPreview>
    );
  }

  return (
    <CameraView
      key={type}
      style={styles.container}
      ref={cameraRef}
      facing={type}
      pointerEvents="box-none"
    >
      <TopBar insetTop={insets.top}>
        <ButtonClose onPress={() => setVisibleCamera(false)}>
          <Feather name="x" size={20} color={colors.white} />
        </ButtonClose>

        <ButtonAlter
          onPress={() => {
            setType(type === 'back' ? 'front' : 'back');
          }}
        >
          <Feather name="refresh-cw" size={20} color={colors.white} />
        </ButtonAlter>
      </TopBar>

      <BottomBar insetBottom={insets.bottom}>
        <ButtonCapture onPress={takePic}>
          <Feather name="camera" size={28} color={colors.primary} />
        </ButtonCapture>
      </BottomBar>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
