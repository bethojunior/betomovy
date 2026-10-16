import { FC, useState } from 'react';
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import { validateFileSize } from '../../../../utils/fileValidation';
import { sanitizeFilename, getMimeType } from '../../../../utils/fileSecurity';
import { customToast } from '../../../../utils/FlashMessage';
import { translate } from '../../../../client/locales';
import { DocumentUploadZone } from '../../../../common/components/DocumentUploadZone';
import { VehicleDocumentUploadProps } from './types';
import { Container, Label } from './styles';

export const VehicleDocumentUpload: FC<VehicleDocumentUploadProps> = ({
  label,
  title,
  value,
  onChange,
}) => {
  const [loading, setLoading] = useState(false);

  const handleImageAsset = (uri: string, fallbackName: string, fileSize?: number) => {
    const sizeValidation = validateFileSize(fileSize || 0, 'image');
    if (!sizeValidation.isValid) {
      customToast(translate('errors.file_size_exceeded', { limitMB: sizeValidation.limitMB }), 'danger');
      return;
    }

    const filename = sanitizeFilename(uri?.split('/').pop() || fallbackName, fallbackName);
    onChange({ uri, name: filename, type: getMimeType(filename, 'image/jpeg') });
  };

  const handleOpenGallery = async () => {
    setLoading(true);
    try {
      const permission = await requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        customToast(translate('errors.image_select_error'), 'danger');
        return;
      }

      const response = await launchImageLibraryAsync({ mediaTypes: 'images', allowsEditing: false, quality: 0.7 });
      if (response.canceled || !response.assets?.[0]) return;

      const asset = response.assets[0];
      handleImageAsset(asset.uri, 'document.jpg', asset.fileSize);
    } catch {
      customToast(translate('errors.image_select_error'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCamera = async () => {
    setLoading(true);
    try {
      const permission = await requestCameraPermissionsAsync();
      if (!permission.granted) {
        customToast(translate('errors.image_select_error'), 'danger');
        return;
      }

      const response = await launchCameraAsync({ mediaTypes: 'images', allowsEditing: false, quality: 0.7 });
      if (response.canceled || !response.assets?.[0]) return;

      const asset = response.assets[0];
      handleImageAsset(asset.uri, 'document.jpg', asset.fileSize);
    } catch {
      customToast(translate('errors.image_select_error'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFilePicker = async () => {
    setLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', copyToCacheDirectory: true });
      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      const sizeValidation = validateFileSize(asset.size || 0, 'pdf');
      if (!sizeValidation.isValid) {
        customToast(translate('errors.file_size_exceeded', { limitMB: sizeValidation.limitMB }), 'danger');
        return;
      }

      onChange({ uri: asset.uri, name: asset.name || 'documento.pdf', type: asset.mimeType || 'application/pdf' });
    } catch {
      customToast(translate('errors.pdf_select_error'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Label>{label}</Label>

      <DocumentUploadZone
        file={value}
        loading={loading}
        translate={translate}
        title={title}
        onOpenCamera={handleOpenCamera}
        onOpenGallery={handleOpenGallery}
        onOpenFilePicker={handleOpenFilePicker}
        onRemove={() => onChange(null)}
      />
    </Container>
  );
};
