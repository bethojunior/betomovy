import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { BottomSheetModal } from '../../../client/components/BottomSheetModal';
import { IconBadge } from '../IconBadge';
import {
  DropZone,
  DropZoneTitle,
  DropZoneInstruction,
  PreviewWrapper,
  PreviewImage,
  PreviewFileRow,
  PreviewFileName,
  RemoveButton,
  PickerContent,
  PickerTitle,
  PickerOption,
  PickerOptionText,
} from './styles';
import { DocumentUploadZoneProps } from './types';

/** Zona de upload única — decide sozinha se abre direto uma fonte ou um seletor, conforme o que está disponível. */
export function DocumentUploadZone({
  file,
  onOpenCamera,
  onOpenGallery,
  onOpenFilePicker,
  onRemove,
  loading,
  translate,
  title,
}: DocumentUploadZoneProps) {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const availableSources = [onOpenCamera, onOpenGallery, onOpenFilePicker].filter(Boolean) as (() => void)[];

  const instructionKey = onOpenFilePicker && !onOpenCamera && !onOpenGallery
    ? 'documents.upload_zone_instruction_file'
    : !onOpenFilePicker && (onOpenCamera || onOpenGallery)
      ? 'documents.upload_zone_instruction_camera_gallery'
      : 'documents.upload_zone_instruction_all';

  const handlePress = () => {
    if (availableSources.length <= 1) {
      availableSources[0]?.();
      return;
    }
    setShowPicker(true);
  };

  const selectSource = (source: () => void) => {
    setShowPicker(false);
    source();
  };

  const isImage = file?.type?.startsWith('image/');

  if (file) {
    return (
      <PreviewWrapper>
        {isImage ? (
          <PreviewImage source={{ uri: file.uri }} />
        ) : (
          <PreviewFileRow>
            <Feather name="file-text" size={RFValue(28)} color={colors.primary} />
            <PreviewFileName numberOfLines={1}>{file.name}</PreviewFileName>
          </PreviewFileRow>
        )}

        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <RemoveButton onPress={onRemove}>
            <Ionicons name="close-circle" size={RFValue(24)} color={colors.red} />
          </RemoveButton>
        )}
      </PreviewWrapper>
    );
  }

  return (
    <>
      <DropZone activeOpacity={0.8} onPress={handlePress} disabled={loading}>
        <IconBadge color={colors.primary} icon={color => <Feather name="upload" size={RFValue(24)} color={color} />} />
        <DropZoneTitle>{title ?? translate('documents.upload_zone_title')}</DropZoneTitle>
        <DropZoneInstruction>{translate(instructionKey)}</DropZoneInstruction>
        {loading && <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: RFValue(8) }} />}
      </DropZone>

      <BottomSheetModal visible={showPicker} onRequestClose={() => setShowPicker(false)}>
        <PickerContent>
          <PickerTitle>{translate('documents.picker_title')}</PickerTitle>

          {onOpenCamera && (
            <PickerOption onPress={() => selectSource(onOpenCamera)} isLast={!onOpenGallery && !onOpenFilePicker}>
              <IconBadge color={colors.primary} size={RFValue(36)} icon={color => <Feather name="camera" size={RFValue(18)} color={color} />} />
              <PickerOptionText>{translate('documents.picker_camera')}</PickerOptionText>
              <Feather name="chevron-right" size={RFValue(20)} color={colors.grayLight} />
            </PickerOption>
          )}
          {onOpenGallery && (
            <PickerOption onPress={() => selectSource(onOpenGallery)} isLast={!onOpenFilePicker}>
              <IconBadge color={colors.primary} size={RFValue(36)} icon={color => <Feather name="image" size={RFValue(18)} color={color} />} />
              <PickerOptionText>{translate('documents.picker_gallery')}</PickerOptionText>
              <Feather name="chevron-right" size={RFValue(20)} color={colors.grayLight} />
            </PickerOption>
          )}
          {onOpenFilePicker && (
            <PickerOption onPress={() => selectSource(onOpenFilePicker)} isLast>
              <IconBadge color={colors.primary} size={RFValue(36)} icon={color => <Feather name="file" size={RFValue(18)} color={color} />} />
              <PickerOptionText>{translate('documents.picker_file')}</PickerOptionText>
              <Feather name="chevron-right" size={RFValue(20)} color={colors.grayLight} />
            </PickerOption>
          )}
        </PickerContent>
      </BottomSheetModal>
    </>
  );
}
