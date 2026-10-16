import { useState } from 'react';
import { Pressable, RefreshControl } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import Preload from '../../../../client/components/Preload';
import { FaceDetectorScreen } from '../../../../client/components/FaceDetector';
import { translate } from '../../../../client/locales';
import { resizeImage } from '../../../../utils/image';
import { AvatarProfile } from '../../../../components/AvatarProfile';
import { Button } from '../../components/Button';
import { IconInfoRow } from '../../../../common/components/IconInfoRow';
import { IconBadge } from '../../../../common/components/IconBadge';
import { StatusBadge } from '../../../../common/components/TripDetail/StatusBadge';
import { ConfirmSignOutModal } from '../../components/ConfirmSignOutModal';
import { resolveDocStatusInfo } from '../../../../common/services/documents/docStatus';
import { useStoragePictures } from '../../hooks/useStoragePictures';
import { getProfileImageUrl } from '../../utils/imageUrl';
import { buildApp } from '../../../../constantBuild/config';
import { useUserDriver } from '../../context/userDriver';
import { useStatusPendingData } from './useStatusPendingData';
import {
  Container,
  TopBar,
  ScrollContent,
  AvatarSection,
  AvatarWrapper,
  CameraBadge,
  Card,
  SectionTitle,
  DocumentsRow,
  DocumentsTextGroup,
  DocumentsLabel,
  DocumentsPendingText,
  StatusRow,
  StatusLabel,
  Divider,
  Footer,
} from './styles';

export function StatusPending() {
  const theme = useTheme();
  const { EditProfileImage } = useUserDriver();
  const { getStoragePictureSpecific } = useStoragePictures();
  const [modalFaceDetector, setModalFaceDetector] = useState(false);
  const [capturedImage, setCapturedImage] = useState<{ uri: string } | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  const {
    loading,
    refreshing,
    userDriverFind,
    email,
    statusInfo,
    hasPendingDocuments,
    onContactSupport,
    onRefresh,
    onTrackStatus,
    showSignOutConfirm,
    requestSignOut,
    cancelSignOut,
    confirmSignOut,
  } = useStatusPendingData();

  const photoStatusInfo = resolveDocStatusInfo(userDriverFind?.profileImageStatusId as any);

  async function sendPhotoRecognition(uri: string) {
    setModalFaceDetector(false);
    setUploadingPhoto(true);

    const manipulatedImage = await resizeImage(uri, 512, 512);
    const filename = manipulatedImage.uri?.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : 'image';

    await EditProfileImage(manipulatedImage.uri, type, filename);
    setImageKey(Date.now());
    setUploadingPhoto(false);
  }

  if (!userDriverFind) return null;

  return (
    <Container>
      <Preload visible={loading} />

      <TopBar>
        <Ionicons name="arrow-back" size={RFValue(28)} color={theme.colors.primary} onPress={requestSignOut} />
      </TopBar>

      <ScrollContent
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        <AvatarSection>
          <Pressable onPress={() => setModalFaceDetector(true)}>
            <AvatarWrapper>
              <AvatarProfile
                key={`driver-photo-${imageKey}`}
                uri={getProfileImageUrl(
                  userDriverFind.profileImage,
                  getStoragePictureSpecific('driver'),
                  buildApp().HOST_IMAGE_DRIVER,
                )}
                loading={uploadingPhoto}
                showPreloadOverlay
                size={RFValue(96)}
                borderColor={theme.colors.primary}
                borderWidth={RFValue(1.5)}
              />
              {!uploadingPhoto && (
                <CameraBadge>
                  <Feather name="camera" size={RFValue(12)} color={theme.colors.primaryText} />
                </CameraBadge>
              )}
            </AvatarWrapper>
          </Pressable>
        </AvatarSection>

        <Card>
          <SectionTitle>{translate('statusPending.personal_info_title')}</SectionTitle>
          <IconInfoRow
            icon={color => <MaterialCommunityIcons name={photoStatusInfo.icon as any} size={RFValue(18)} color={color} />}
            label={translate('driverStatus.text_statu_image')}
            value={userDriverFind.profileImageStatus}
            color={theme.colors.primary}
            valueVariant={photoStatusInfo.variant}
          />
          <IconInfoRow
            icon={color => <Feather name="user" size={RFValue(18)} color={color} />}
            label={translate('driverStatus.label_name')}
            value={userDriverFind.name}
            color={theme.colors.primary}
          />
          <IconInfoRow
            icon={color => <Feather name="credit-card" size={RFValue(18)} color={color} />}
            label={translate('driverStatus.label_document')}
            value={userDriverFind.document}
            color={theme.colors.primary}
          />
          <IconInfoRow
            icon={color => <Feather name="phone" size={RFValue(18)} color={color} />}
            label={translate('driverStatus.label_phone')}
            value={userDriverFind.phone}
            color={theme.colors.primary}
          />
          <IconInfoRow
            icon={color => <Feather name="mail" size={RFValue(18)} color={color} />}
            label={translate('driverStatus.label_email')}
            value={email || ''}
            color={theme.colors.primary}
            showDivider={false}
          />
        </Card>

        {!!userDriverFind.car?.model && (
          <Card>
            <SectionTitle>{translate('statusPending.vehicle_info_title')}</SectionTitle>
            <IconInfoRow
              icon={color => <Feather name="tag" size={RFValue(18)} color={color} />}
              label={translate('statusPending.vehicle_brand')}
              value={userDriverFind.car.brand}
              color={theme.colors.primary}
            />
            <IconInfoRow
              icon={color => <Feather name="truck" size={RFValue(18)} color={color} />}
              label={translate('statusPending.vehicle_model')}
              value={userDriverFind.car.model}
              color={theme.colors.primary}
            />
            <IconInfoRow
              icon={color => <MaterialCommunityIcons name="card-text-outline" size={RFValue(18)} color={color} />}
              label={translate('statusPending.vehicle_plate')}
              value={userDriverFind.car.plate}
              color={theme.colors.primary}
              showDivider={false}
            />
          </Card>
        )}

        <Card>
          <StatusRow>
            <StatusLabel>{translate('statusPending.status_section_title')}</StatusLabel>
            <StatusBadge label={translate(statusInfo.titleKey)} variant={statusInfo.variant} />
          </StatusRow>

          <Divider />

          <DocumentsRow activeOpacity={0.8} onPress={onTrackStatus}>
            <IconBadge
              color={theme.colors.primary}
              icon={color => <Feather name="folder" size={RFValue(20)} color={color} />}
            />
            <DocumentsTextGroup>
              <DocumentsLabel>{translate('statusPending.documents_card_title')}</DocumentsLabel>
              {hasPendingDocuments && (
                <DocumentsPendingText>{translate('driverStatus.label_documents_pending')}</DocumentsPendingText>
              )}
            </DocumentsTextGroup>
            <Feather name="chevron-right" size={RFValue(22)} color={theme.colors.grayLight} />
          </DocumentsRow>
        </Card>
      </ScrollContent>

      {!!onContactSupport && (
        <Footer>
          <Button
            title={translate('support.button_label')}
            onPress={onContactSupport}
            icon={<Ionicons name="logo-whatsapp" size={RFValue(20)} color={theme.colors.primaryText} />}
          />
        </Footer>
      )}

      <FaceDetectorScreen
        visible={modalFaceDetector}
        onClose={() => setModalFaceDetector(false)}
        sendPhoto={() => sendPhotoRecognition(capturedImage!.uri)}
        setImage={setCapturedImage}
      />

      <ConfirmSignOutModal
        visible={showSignOutConfirm}
        onCancel={cancelSignOut}
        onConfirm={confirmSignOut}
      />
    </Container>
  );
}
