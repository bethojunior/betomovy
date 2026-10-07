import { useState } from 'react';
import { Linking, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import {
  Ball,
  AvatarRow,
  AvatarWrapper,
  CameraBadge,
  Card,
  Container,
  CountBadgeText,
  DangerRow,
  DangerSubtitle,
  DangerTextGroup,
  DangerTitle,
  DriverName,
  ItemTripType,
  ListTypeContent,
  ScrollContent,
  SectionTitle,
  SectionTitleRow,
  SimpleText,
  SupportLinkText,
  SupportRow,
  SupportText,
  SupportTextGroup,
  TripTypesList,
  UserInfo,
} from './styles';
import apiMainDriver from '../../api/apiMain';
import { useUserDriver } from '../../context/userDriver';
import { useAuth } from '../../../../context/auth';
import { buildApp } from '../../../../constantBuild/config';
import { customToast } from '../../../../utils/FlashMessage';
import Helper from '../../utils/Helper';

import { translate } from '../../../../client/locales';
import { resizeImage } from '../../../../utils/image';
import { useStoragePictures } from '../../hooks/useStoragePictures';
import { useKeyboardHeight } from '../../../../common/hooks/useKeyboardHeight';
import { formatPhone } from '../../../../client/utils/formatPhone';
import { getProfileImageUrl } from '../../utils/imageUrl';
import { ModalSelectPhotoProfile } from '../../../../components/ModalSelectPhotoProfile';
import { AvatarProfile } from '../../../../components/AvatarProfile';
import { EditableItemProfile } from '../../../../client/components/EditableItemProfile';
import ChangePasswordModal from '../../../../client/components/ChangePasswordModal';
import DeleteAccountModal from '../../../../client/components/DeleteAccountModal';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import { useSupportNumber } from '../../../../hooks/useSupportNumber';
import { RFValue } from 'react-native-responsive-fontsize';

export default function Profile() {
  const [modalEdit, setModalEdit] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  const { userDriverFind, setUserDriverFind } = useUserDriver();
  const { userDriver, setUserDriver } = useAuth();
  const { getSupportNumberFormatted } = useSupportNumber();
  const supportNumber = getSupportNumberFormatted();
  const theme = useTheme();
  const { getStoragePictureSpecific } = useStoragePictures();
  const keyboardHeight = useKeyboardHeight();
  const { postExcludeAccount, loading: deleteLoading } = useDeleteAccount();

  const IMAGE_RULES = {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'],
    minWidth: 100,
    minHeight: 100,
    maxWidth: 5000,
    maxHeight: 5000
  };

  async function validateImage(asset) {
    const errors = [];

    if (asset.size > IMAGE_RULES.maxSizeBytes) {

      errors.push(`Imagem muito grande. Máximo: ${IMAGE_RULES.maxSizeBytes / (1024 * 1024)}MB`);
    }

    if (!IMAGE_RULES.allowedTypes.includes(asset.mimeType)) {
      errors.push('Formato não suportado. Use: JPG, JPEG ou PNG');
    }

    if (asset.width && asset.height) {
      if (asset.width < IMAGE_RULES.minWidth || asset.height < IMAGE_RULES.minHeight) {
        errors.push(`Imagem muito pequena. Mínimo: ${IMAGE_RULES.minWidth}x${IMAGE_RULES.minHeight}px`);
      }
      if (asset.width > IMAGE_RULES.maxWidth || asset.height > IMAGE_RULES.maxHeight) {
        errors.push(`Imagem muito grande. Máximo: ${IMAGE_RULES.maxWidth}x${IMAGE_RULES.maxHeight}px`);
      }
    }

    return errors;
  }

  async function sendPhotoRecognition(uri: string, asset: any) {
    setModalEdit(false);
    setUploadingPhoto(true);

    try {
      const validationErrors = await validateImage(asset);
      if (validationErrors.length > 0) {
        customToast(validationErrors.join('\n'), 'danger');
        return;
      }

      const result = await resizeImage(uri, 200, 200);
      await updatePhoto(result);
    } catch (error) {
      customToast(translate('toast.text_photo_processing_error'), 'danger');
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function updatePhoto(result) {
    try {
      const locaUri = result.uri;
      const filename = locaUri?.split('/').pop();

      // Infer the type of the image
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('driverId', userDriverFind.idDriver);
      // @ts-ignore
      formData.append('photo', {
        uri: result.uri,
        type,
        name: filename,
      });

      const response = await apiMainDriver.post(
        'Driver/EditProfileImage',
        formData,
        { timeout: 120000 },
      );

      const { data } = response;
      const { status } = data;

      if (status) {
        setImageKey(Date.now());

        customToast(translate('toast.text_photo_change_request_sent'), 'success');
      } else {
        throw new Error(data.message || 'Upload falhou');
      }
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);

      if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
        customToast(translate('toast.text_image_too_large_or_slow_connection'), 'danger');
      } else if (error.response?.status === 413) {
        customToast(translate('toast.text_image_too_large'), 'danger');
      } else {
        customToast(translate('toast.text_photo_update_error'), 'danger');
      }

      throw error;
    }
  }

  const handleEditPhoto = () => {
    setModalEdit(true);
  };

  const tripTypes = userDriverFind?.tripTypes || [];

  return (
    <>
      <Container>
        <ScrollContent showsVerticalScrollIndicator={false} keyboardHeight={keyboardHeight}>
          <Card>
            <AvatarRow>
              <Pressable onPress={handleEditPhoto}>
                <AvatarWrapper>
                  <AvatarProfile
                    key={`driver-photo-${imageKey}`}
                    uri={getProfileImageUrl(
                      userDriverFind?.profileImage,
                      getStoragePictureSpecific('driver'),
                      buildApp().HOST_IMAGE_DRIVER
                    )}
                    loading={uploadingPhoto}
                    showPreloadOverlay
                    size={RFValue(88)}
                    borderColor={theme.colors.primary}
                    borderWidth={RFValue(1.5)}
                  />
                  {!uploadingPhoto && (
                    <CameraBadge>
                      <Feather name="camera" size={RFValue(11)} color={theme.colors.primaryText} />
                    </CameraBadge>
                  )}
                </AvatarWrapper>
              </Pressable>

              <UserInfo>
                <DriverName>
                  {Helper.maskNames(userDriverFind?.name?.trim())}
                </DriverName>
                <SimpleText>{userDriverFind.document || ''}</SimpleText>
              </UserInfo>
            </AvatarRow>
          </Card>

          <Card>
            <SectionTitleRow>
              <SectionTitle>{translate('driverProfile.account_data')}</SectionTitle>
            </SectionTitleRow>

            <EditableItemProfile
              icon="mail-outline"
              label={translate('myProfile.text_email')}
              value={userDriver?.email || ''}
              keyboardType="email-address"
              validate={value => {
                if (!value) return translate('driverProfile.text_empty_field');
                if (!Helper.isEmailValid(value)) return translate('changeEmail.text_invalid');
                return null;
              }}
              onSave={async email => {
                const result = await apiMainDriver.post('driver/edit', {
                  stdObject: [{ email, driverId: userDriverFind.idDriver, idUser: userDriverFind.userId }],
                });
                return { status: result.data.status, message: result.data.message };
              }}
              onSaved={email => setUserDriver({ ...userDriver, email })}
            />

            <EditableItemProfile
              icon="call-outline"
              label={translate('myProfile.text_phone')}
              value={formatPhone(userDriverFind.phone || '')}
              keyboardType="phone-pad"
              formatValue={text => formatPhone(text, true)}
              parseInput={masked => formatPhone(masked, false)}
              validate={raw => {
                if (!raw) return translate('driverProfile.text_empty_field');
                if (raw.length < 11) return translate('changePhone.text_min_size');
                return null;
              }}
              onSave={async phone => {
                const result = await apiMainDriver.post('driver/edit', {
                  stdObject: [{ phone, driverId: userDriverFind.idDriver, idUser: userDriverFind.userId }],
                });
                return { status: result.data.status, message: result.data.message };
              }}
              onSaved={phone => setUserDriverFind({ ...userDriverFind, phone })}
            />

            <EditableItemProfile
              variant="reveal"
              icon="lock-closed-outline"
              label={translate('myProfile.text_password')}
              maskedValue="********"
              onReveal={async () => {
                try {
                  const lastLogin = await AsyncStorage.getItem('lastLogin');
                  if (!lastLogin) return '********';
                  const { email: loginEmail, password } = JSON.parse(lastLogin);
                  return loginEmail === userDriver?.email ? password || '********' : '********';
                } catch (error) {
                  return '********';
                }
              }}
              secondaryAction={{
                label: translate('viewPassword.edit_password'),
                onPress: () => setPasswordModalVisible(true),
              }}
            />
          </Card>

          {tripTypes.length > 0 && (
            <Card>
              <SectionTitleRow>
                <SectionTitle>{translate('myProfile.title_trip_type')}</SectionTitle>
                <CountBadgeText>{tripTypes.length}</CountBadgeText>
              </SectionTitleRow>

              <TripTypesList>
                {tripTypes.map((type, index) => (
                  <ListTypeContent key={type.tripTypeId} isLast={index === tripTypes.length - 1}>
                    <Ball />
                    <ItemTripType>{type.tripType}</ItemTripType>
                  </ListTypeContent>
                ))}
              </TripTypesList>
            </Card>
          )}

          <Card>
            <DangerRow
              activeOpacity={0.8}
              onPress={() => setDeleteModalVisible(true)}
            >
              <Feather name="trash-2" size={RFValue(20)} color={theme.colors.red} />
              <DangerTextGroup>
                <DangerTitle>{translate('exclude.delete_account')}</DangerTitle>
                <DangerSubtitle>{translate('exclude.delete_account_subtitle')}</DangerSubtitle>
              </DangerTextGroup>
              <Feather name="chevron-right" size={RFValue(18)} color={theme.colors.grayLight} />
            </DangerRow>
          </Card>

          {!!supportNumber && (
            <Card>
              <SupportRow
                activeOpacity={0.8}
                onPress={() => Linking.openURL(`https://wa.me/${supportNumber}/`)}
              >
                <Feather name="headphones" size={RFValue(20)} color={theme.colors.icon_gray} />
                <SupportTextGroup>
                  <SupportText>
                    {translate('support.text_support_before')}
                    <SupportLinkText>
                      {' '}{translate('support.text_support_link')}
                    </SupportLinkText>
                    {translate('support.text_support_after')}
                  </SupportText>
                </SupportTextGroup>
              </SupportRow>
            </Card>
          )}
        </ScrollContent>

        <ChangePasswordModal
          visible={passwordModalVisible}
          setVisible={setPasswordModalVisible}
          onCheckCurrentPassword={async currentPassword => {
            const result = await apiMainDriver.post('Driver/CheckPassword', {
              password: currentPassword,
            });
            return !!result.data.status;
          }}
          onUpdatePassword={async newPassword => {
            const result = await apiMainDriver.post('driver/edit', {
              stdObject: [
                {
                  password: newPassword,
                  driverId: userDriverFind.idDriver,
                  idUser: userDriverFind.userId,
                },
              ],
            });

            if (result.data.status) {
              AsyncStorage.setItem(
                'lastLogin',
                JSON.stringify({ email: userDriver?.email, password: newPassword }),
              );
            }

            return { status: result.data.status, message: result.data.message };
          }}
        />

        <DeleteAccountModal
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={postExcludeAccount}
          loading={deleteLoading}
        />

        <ModalSelectPhotoProfile
          visible={modalEdit}
          setVisible={() => setModalEdit(false)}
          sendPhoto={(asset) => sendPhotoRecognition(asset?.uri, asset)}
          configKey="enable_driver_open_gallery"
        />
      </Container>
    </>
  );
}
