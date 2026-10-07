import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useForm, FieldValues } from 'react-hook-form';
import { Modal } from 'react-native';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from 'styled-components/native';
import { DocumentUploadZone } from '../DocumentUploadZone';
import { InfoBanner } from '../InfoBanner';
import { IconBadge } from '../IconBadge';
import { UploadFile } from '../../services/documents/types';
import {
  Container,
  Header,
  BackButton,
  Title,
  Content,
  HeroSection,
  PageTitle,
  SectionDivider,
  CameraFallback,
  CameraFallbackText,
} from './styles';
import { DocumentSendProps } from './types';

export default function DocumentSend({
  route,
  uiKit: { Button, Input, InputContainer, CapturePicture },
  fileHandlers: { validateFileSize, sanitizeFilename, getMimeType, resizeImage },
  schema,
  sendDocument,
  translate,
  customToast,
  onDocumentSent,
}: DocumentSendProps) {
  const { goBack } = useNavigation();
  const { doc, docConfig } = route.params;
  const { colors } = useTheme();

  // Pdf e imagem são áreas independentes (um documento pode pedir os 2 ao mesmo tempo, ex.: CNH) — nunca um union só.
  const [pdfFile, setPdfFile] = useState<UploadFile | null>(null);
  const [imageFile, setImageFile] = useState<UploadFile | null>(null);
  const [showMissingFileError, setShowMissingFileError] = useState(false);
  const [loadingPick, setLoadingPick] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  // Um documento pode aceitar mais de um tipo ao mesmo tempo (ex.: CNH pede texto + pdf + foto) — não é mutuamente exclusivo.
  const isTextEnabled = docConfig.text === '1';
  const isPdfEnabled = docConfig.pdf === '1';
  const isImageEnabled = docConfig.image === '1';
  const isUploadEnabled = isPdfEnabled || isImageEnabled;
  const buttonLabel = translate(doc.hasDocument ? 'documents.resend_button' : 'documents.send_button');

  const openFilePicker = async () => {
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

      setPdfFile({ uri: asset.uri, name: asset.name || 'documento.pdf', type: asset.mimeType || 'application/pdf' });
      setShowMissingFileError(false);
    } catch {
      customToast(translate('errors.pdf_select_error'), 'danger');
    }
  };

  const handlePhotoCapture = async (photo: UploadFile) => {
    setShowCamera(false);
    if (!photo?.uri) return;

    try {
      const manipulated = await resizeImage(photo.uri, 400, 400);
      setImageFile({ uri: manipulated.uri, type: photo.type || 'image/jpeg', name: photo.name || 'photo.jpg' });
    } catch {
      setImageFile(photo);
    }
    setShowMissingFileError(false);
  };

  const openGallery = async () => {
    setLoadingPick(true);
    try {
      const permission = await requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        customToast(translate('errors.image_select_error'), 'danger');
        return;
      }

      const response = await launchImageLibraryAsync({ mediaTypes: 'images', allowsEditing: false, quality: 0.7 });
      if (response.canceled || !response.assets?.[0]) return;

      const asset = response.assets[0];
      const sizeValidation = validateFileSize(asset.fileSize || 0, 'image');
      if (!sizeValidation.isValid) {
        customToast(translate('errors.file_size_exceeded', { limitMB: sizeValidation.limitMB }), 'danger');
        return;
      }

      const filename = sanitizeFilename(asset.uri?.split('/').pop() || 'image.jpg', 'image.jpg');
      setImageFile({ uri: asset.uri, type: getMimeType(filename, 'image/jpeg'), name: filename });
      setShowMissingFileError(false);
    } catch {
      customToast(translate('errors.image_select_error'), 'danger');
    } finally {
      setLoadingPick(false);
    }
  };

  const submitDocument = async (data: FieldValues) => {
    const documentText = isTextEnabled ? (data.document || '').trim() : '';
    // Documento com mais de um tipo pede todos ao mesmo tempo (ex.: CNH = número + foto) — não basta preencher só um.
    const isMissingSomething =
      (isTextEnabled && !documentText) || (isPdfEnabled && !pdfFile) || (isImageEnabled && !imageFile);

    if (isMissingSomething) {
      if (isUploadEnabled) setShowMissingFileError(true);
      else customToast(translate('errors.document_text_required'), 'warning');
      return;
    }
    setShowMissingFileError(false);

    setLoadingSend(true);
    try {
      await sendDocument({ docId: doc.docId, text: documentText || undefined, image: imageFile, pdf: pdfFile });
      customToast(translate('documentSend.text_sent_success'), 'success');
      setPdfFile(null);
      setImageFile(null);
      onDocumentSent?.();
    } catch (error: any) {
      // mantém texto/arquivos preenchidos pro usuário tentar de novo, sem precisar reescolher
      customToast(error.message || translate('errors.document_send_error'), 'danger');
    } finally {
      setLoadingSend(false);
    }
  };

  useEffect(() => {
    setValue('document', doc.text || '');
  }, [doc.text, setValue]);

  return (
    <Container>
      <Header activeOpacity={1} onPress={goBack}>
        <BackButton>
          <Ionicons name="chevron-back" size={RFValue(28)} color={colors.primary} />
        </BackButton>
        <Title numberOfLines={1}>{doc.label}</Title>
      </Header>

      <Content>
        <HeroSection>
          <IconBadge
            color={colors.primary}
            size={RFValue(56)}
            icon={color => <Feather name={isUploadEnabled ? 'upload-cloud' : 'edit-3'} size={RFValue(26)} color={color} />}
          />
          <PageTitle>{translate('documents.send_title')}</PageTitle>
        </HeroSection>

        {isTextEnabled && (
          <InputContainer label={doc.label}>
            <Input
              name="document"
              control={control}
              error={errors.document?.message as string}
              placeholder={translate('driverStatus.label_input_document')}
            />
          </InputContainer>
        )}

        {isTextEnabled && isUploadEnabled && <SectionDivider />}

        {isPdfEnabled && (
          <DocumentUploadZone
            file={pdfFile}
            translate={translate}
            title={isImageEnabled ? translate('documents.upload_zone_title_pdf') : undefined}
            onOpenFilePicker={openFilePicker}
            onRemove={() => setPdfFile(null)}
          />
        )}

        {isPdfEnabled && isImageEnabled && <SectionDivider />}

        {isImageEnabled && (
          <DocumentUploadZone
            file={imageFile}
            loading={loadingPick}
            translate={translate}
            title={isPdfEnabled ? translate('documents.upload_zone_title_image') : undefined}
            onOpenCamera={() => setShowCamera(true)}
            onOpenGallery={openGallery}
            onRemove={() => setImageFile(null)}
          />
        )}

        {isUploadEnabled && showMissingFileError && (
          <InfoBanner
            variant="error"
            icon={color => <Ionicons name="alert-circle" size={RFValue(20)} color={color} />}
            title={translate('documents.upload_zone_missing_file')}
          />
        )}

        {isUploadEnabled && (
          <InfoBanner
            variant="neutral"
            icon={color => <Ionicons name="bulb-outline" size={RFValue(20)} color={color} />}
            title={translate('documents.tip_title')}
            description={translate('documents.tip_description')}
          />
        )}

        <Button
          title={buttonLabel}
          onPress={handleSubmit(submitDocument)}
          enabled={!loadingSend}
          loading={loadingSend}
        />
      </Content>

      {/* App não tem SafeAreaProvider na raiz — mesmo padrão comprovado do TripTypePickerModal/TripFinishModal: provider local com initialMetrics estático. */}
      <Modal visible={showCamera} transparent statusBarTranslucent>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          {CapturePicture ? (
            <CapturePicture savePicture={handlePhotoCapture} setVisibleCamera={setShowCamera} />
          ) : (
            <CameraFallback>
              <CameraFallbackText>{translate('documents.camera_unavailable')}</CameraFallbackText>
              <Button title={translate('documents.close_button')} onPress={() => setShowCamera(false)} />
            </CameraFallback>
          )}
        </SafeAreaProvider>
      </Modal>
    </Container>
  );
}

export { DocumentSend };
