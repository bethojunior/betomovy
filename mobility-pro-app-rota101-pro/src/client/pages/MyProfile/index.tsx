import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import apiMain from '../../api/apiMain';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import DeleteAccountModal from '../../components/DeleteAccountModal';
import { DocumentsStatusCard } from '../../../common/components/DocumentsStatusCard';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import { useRefreshCustomerData } from '../../hooks/useRefreshCustomerData';
import { useSupportNumber } from '../../../hooks/useSupportNumber';

import { translate } from '../../locales';
import {
  AvatarRow,
  AvatarWrapper,
  ButtonPhoto,
  CameraBadge,
  Card,
  Container,
  ContainerItem,
  ContentTerms,
  ButtonTerms,
  ButtonTextTerms,
  DangerRow,
  DangerSubtitle,
  DangerTextGroup,
  DangerTitle,
  RequiredText,
  ScrollContent,
  StatusText,
  SupportLinkText,
  SupportRow,
  SupportText,
  SupportTextGroup,
  UserDocument,
  UserInfo,
  UserName,
} from './styles';
import { BiometriaSwitch } from '../../components/BiometriaSwitch';
import { ItemProfile } from '../../components/ItemProfile';
import { EditableItemProfile } from '../../components/EditableItemProfile';
import { useAuth } from '../../../context/auth';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Helper from '../../utils/Helper';
import { useStoragePictures } from '../../../driver/src/hooks/useStoragePictures';
import { useKeyboardHeight } from '../../../common/hooks/useKeyboardHeight';
import { formatPhone } from '../../utils/formatPhone';
import { validateCPF } from '../../utils/cpfValidator';
import { cpfMask } from '../../../driver/src/utils/format';
import { ModalSelectPhotoProfile } from '../../../components/ModalSelectPhotoProfile';
import { customToast } from '../../../utils/FlashMessage';
import { mapCustomerStatus, CUSTOMER_STATUS } from '../../../utils/mapCustomerStatus';
import { hasDefaultProfilePhoto, validateUserData } from '../../../utils/validateProfileFields';
import { areAllDocumentsApproved } from '../../../utils/validateProfileDocuments';
import { useProfilePhotoUpload } from '../../hooks/useProfilePhotoUpload';
import { AvatarProfile } from '../../../components/AvatarProfile';
import { resizeImage } from '../../../utils/image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

export default function MyProfile() {
  const { navigate } = useNavigation<any>();

  const { user, setUser, userData, setUserData, generalSettings } = useAuth();
  const { uploadProfileImage } = useProfilePhotoUpload();
  const keyboardHeight = useKeyboardHeight();

  const [userDocs, setUserDocs] = useState([]);
  const [configuredDocs, setConfiguredDocs] = useState([]);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isBr, setIsBr] = useState<boolean>(false);
  useStoragePictures();
  const [showModalSelectPhoto, setShowModalSelectPhoto] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { postExcludeAccount, loading: deleteLoading } = useDeleteAccount();
  const { getSupportNumberFormatted } = useSupportNumber();

  const wasIncompleteRef = useRef<boolean | null>(null);

  const theme = useTheme();

  const isDefaultProfilePhoto = hasDefaultProfilePhoto(user);

  const IMAGE_RULES = {
    maxSizeBytes: 10 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'],
    minWidth: 100,
    minHeight: 100,
    maxWidth: 5000,
    maxHeight: 5000
  };

  async function validateImage(asset) {
    const errors = [];

    if (asset.fileSize && asset.fileSize > IMAGE_RULES.maxSizeBytes) {
      errors.push(`Imagem muito grande. Máximo: ${IMAGE_RULES.maxSizeBytes / (1024 * 1024)}MB`);
    }

    if (asset.mimeType && !IMAGE_RULES.allowedTypes.includes(asset.mimeType)) {
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

  const getLanguageApp = async () => {
    try {
      const responseLanguage = await AsyncStorage.getItem('@language');
      if (responseLanguage === 'pt_BR') {
        setIsBr(true);
      }
    } catch (error) {
    }
  };

  async function sendPhotoRecognition(uri: string | null, asset: any = null) {
    setUploadingPhoto(true);

    try {
      if (asset) {
        const validationErrors = await validateImage(asset);
        if (validationErrors.length > 0) {
          customToast(validationErrors.join('\n'), 'danger');
          setUploadingPhoto(false);
          return;
        }
      }

      const result = await resizeImage(uri, 200, 200);
      await updatePhoto(result.uri);
    } catch (error) {
      customToast(translate('toast.text_photo_processing_error'), 'danger');
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function updatePhoto(uri: string) {
    try {
      await uploadProfileImage(uri, {
        onSuccess: () => {
          customToast(translate('toast.text_photo_updated_success'), 'success');
        },
      });
    } catch (error) {
      if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
        customToast(translate('toast.text_image_too_large_or_slow_connection'), 'danger');
      } else if (error.response?.status === 413) {
        customToast(translate('toast.text_image_too_large'), 'danger');
      } else {
        customToast(error.message || translate('toast.text_photo_update_error'), 'danger');
      }

      throw error;
    }
  }

  const getUserDocs = async (userSentDocs: any = []) => {
    try {
      try {
        const configResponse = await apiMain.get('DocUserType/FindByUserType?userTypeId=5');
        const configured = configResponse?.data?.data || [];
        setConfiguredDocs(configured);

        try {
          if (configured.length === 0) {
            setUserDocs([]);
          } else {
            const mappedDocs = configured.map(configDoc => {
              const sentDoc = userSentDocs.find(doc => doc.docId === configDoc.docId);
              return sentDoc || {
                docId: configDoc.docId,
                docStatus: 'NAO_ENVIADO',
                docStatusId: '0'
              };
            });

            setUserDocs(mappedDocs);
          }
        } catch (userError) {
          console.log('Erro na API Customer/Find:', userError?.response?.status, userError?.message);
          setUserDocs([]);
        }
      } catch (configError) {
        console.log('Erro na API DocUserType/FindByUserType:', configError?.response?.status, configError?.message);
        setConfiguredDocs([]);
        setUserDocs([]);
      }
    } catch (error) {
      console.log('Erro geral getUserDocs:', error);
      setUserDocs([]);
      setConfiguredDocs([]);
    }
  };

  useEffect(() => {
    getLanguageApp();
  }, []);

  const { refreshCustomerData } = useRefreshCustomerData();

  useFocusEffect(
    useCallback(() => {
      if (!user?.idUser) return;

      refreshCustomerData().then(freshUserData => {
        if (freshUserData?.docsUser) {
          getUserDocs(freshUserData.docsUser);
        }
      });
    }, [user?.idUser, refreshCustomerData]),
  );

  useEffect(() => {
    if (!userData) return;

    const hasRequiredFields = !validateUserData(userData, user);
    const isAccountActive =
      String(userData?.customerRegisterStatusId) === CUSTOMER_STATUS.ACTIVE;
    const hasNoDocsRequired = configuredDocs.length === 0;
    const hasAllDocsApproved = hasNoDocsRequired || areAllDocumentsApproved(userDocs);

    const isProfileComplete = hasRequiredFields && isAccountActive && hasAllDocsApproved;

    if (wasIncompleteRef.current && isProfileComplete) {
      navigate('TripRoutes', { screen: 'Home' });
    }

    wasIncompleteRef.current = !isProfileComplete;
  }, [userData, user, userDocs, configuredDocs]);

  const customDocumentLabel = generalSettings.find(item => item?.key === 'tittle_document_name')?.value;
  const documentLabel = customDocumentLabel?.toLowerCase() === 'document'
    ? translate('myProfile.text_document')
    : customDocumentLabel || translate('myProfile.text_document');

  const birthDateLabel = isBr
    ? Helper.formatDateBr(userData?.dateOfBirth)
    : Helper.formatDateDefault(userData?.dateOfBirth);

  const pendingDocsCard = (() => {
    if (configuredDocs.length === 0) return null;

    const customerRegisterUnblocked = generalSettings.find(
      item => item?.key === 'customer_register_unblocked'
    )?.value;

    if (customerRegisterUnblocked === '1' &&
      userData?.customerRegisterStatusId === '1') {
      return null;
    }

    const docs = userDocs || [];
    const notSentDocs = docs.filter(doc =>
      doc.docStatus === 'NAO_ENVIADO' || doc.docStatusId === '0'
    );
    const pendingDocs = docs.filter(doc =>
      doc.docStatus !== 'APROVADO' && doc.docStatusId !== '1' &&
      doc.docStatus !== 'NAO_ENVIADO' && doc.docStatusId !== '0'
    );
    const approvedDocs = docs.filter(doc =>
      doc.docStatus === 'APROVADO' || doc.docStatusId === '1'
    );

    if (approvedDocs.length === docs.length && docs.length > 0) {
      return null;
    }

    return (
      <DocumentsStatusCard
        hasPendingDocuments={notSentDocs.length > 0 || pendingDocs.length > 0}
        onPress={() => {
          const allPendingDocs = [...notSentDocs, ...pendingDocs];
          navigate('DocumentPending', { docs: allPendingDocs });
        }}
      />
    );
  })();

  return (
    <>
      <Container>
        <ScrollContent showsVerticalScrollIndicator={false} keyboardHeight={keyboardHeight}>
          <Card>
            <AvatarRow>
              <ButtonPhoto onPress={() => setShowModalSelectPhoto(true)}>
                <AvatarWrapper>
                  <AvatarProfile
                    uri={user?.profileImageLink}
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
              </ButtonPhoto>

              <UserInfo>
                <UserName numberOfLines={2} ellipsizeMode="tail">{user.nameUser}</UserName>
                {userData?.document && <UserDocument>{userData?.document}</UserDocument>}

                {isDefaultProfilePhoto && (
                  <ContainerItem>
                    <Feather name="alert-circle" size={RFValue(11)} color={theme.colors.red} />
                    <RequiredText>{translate('myProfile.required_profile_photo')}</RequiredText>
                  </ContainerItem>
                )}
              </UserInfo>
            </AvatarRow>
          </Card>

          <Card>
            <EditableItemProfile
              icon="mail-outline"
              label={translate('myProfile.text_email')}
              value={user.email}
              keyboardType="email-address"
              validate={value => {
                if (!value) return translate('changeEmail.text_empty');
                if (!Helper.isEmailValid(value)) return translate('changeEmail.text_invalid');
                return null;
              }}
              onSave={async email => {
                const result = await apiMain.post('Customer/EditProfile', { email });
                return { status: result.data.status, message: result.data.message };
              }}
              onSaved={email => setUser({ ...user, email })}
            />

            <EditableItemProfile
              icon="call-outline"
              label={translate('myProfile.text_phone')}
              value={formatPhone(user.phone)}
              keyboardType="phone-pad"
              formatValue={text => formatPhone(text, true)}
              parseInput={masked => formatPhone(masked, false)}
              validate={raw => {
                if (!raw) return translate('changePhone.text_empty');
                if (isBr && raw.length < 11) return translate('changePhone.text_min_size');
                return null;
              }}
              onSave={async phone => {
                const result = await apiMain.post('Customer/EditProfile', { phone });
                return { status: result.data.status, message: result.data.message };
              }}
              onSaved={phone => setUser({ ...user, phone })}
            />

            <EditableItemProfile
              icon="card-outline"
              label={documentLabel}
              value={userData?.document || ''}
              keyboardType="numeric"
              formatValue={text => (isBr ? cpfMask(text) : text)}
              validate={raw => {
                if (!raw) return translate('changeDocument.text_empty');
                if (isBr && !validateCPF(raw)) return translate('changeDocument.text_invalid_cpf');
                return null;
              }}
              onSave={async document => {
                try {
                  const result = await apiMain.post('Customer/EditProfile', { document });
                  if (!result.data.status) {
                    let message = result.data.message || translate('changeDocument.text_status_error');
                    if (message.toLowerCase().includes('já existe') || message.toLowerCase().includes('already exists')) {
                      message = translate('changeDocument.text_already_registered');
                    }
                    return { status: false, message };
                  }
                  return { status: true };
                } catch (error: any) {
                  let message = error?.response?.data?.message || translate('changeDocument.text_status_error');
                  if (message.toLowerCase().includes('já existe') || message.toLowerCase().includes('already exists')) {
                    message = translate('changeDocument.text_already_registered');
                  }
                  return { status: false, message };
                }
              }}
              onSaved={document => {
                setUserData({ ...userData, document });
                setUser({ ...user, document });
              }}
            />

            <EditableItemProfile
              icon="calendar-outline"
              label={translate('myProfile.text_birth_date')}
              value={birthDateLabel}
              keyboardType="numeric"
              formatValue={text => Helper.formatDateInput(text)}
              validate={raw => {
                if (!raw) return translate('changeBirthDate.text_empty');
                if (raw.length < 10) return translate('changeBirthDate.text_invalid');
                const [day, month, year] = raw.split('/').map(Number);
                if (!day || !month || !year) return translate('changeBirthDate.text_invalid');
                if (day < 1 || day > 31) return translate('changeBirthDate.text_invalid');
                if (month < 1 || month > 12) return translate('changeBirthDate.text_invalid');
                const currentYear = new Date().getFullYear();
                if (year <= currentYear - 100 || year > currentYear) return translate('changeBirthDate.text_invalid');
                return null;
              }}
              onSave={async raw => {
                try {
                  const result = await apiMain.post('Customer/EditProfile', {
                    dateOfBirth: Helper.formatDateApiDefault(raw),
                  });
                  return { status: result.data.status, message: result.data.message };
                } catch (error: any) {
                  return {
                    status: false,
                    message: error?.response?.data?.message || translate('changeBirthDate.text_status_error'),
                  };
                }
              }}
              onSaved={raw => setUserData({ ...userData, dateOfBirth: Helper.formatDateApiDefault(raw) })}
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
                  return loginEmail === user.email ? password || '********' : '********';
                } catch (error) {
                  return '********';
                }
              }}
              secondaryAction={{
                label: translate('viewPassword.edit_password'),
                onPress: () => setModalPasswordVisible(true),
              }}
            />
          </Card>

          {pendingDocsCard}

          <Card>
            <BiometriaSwitch />

            <ItemProfile
              icon="shield-checkmark-outline"
              nameIconFeather="info"
              label={translate('driverStatus.label_status')}
              onPress={() => { }}
              textValue={
                <StatusText status={userData?.customerRegisterStatusId || '2'}>
                  {mapCustomerStatus(userData?.customerRegisterStatusId)}
                </StatusText>
              }
              isLast
            />
          </Card>

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

          <Card>
            <SupportRow
              activeOpacity={0.8}
              onPress={() => {
                const number = getSupportNumberFormatted();
                if (!number) {
                  customToast(translate('support.text_not_configured'), 'warning');
                  return;
                }
                Linking.openURL(`https://wa.me/${number}/`).catch(() => {
                  customToast(translate('contactUs.alert_error'), 'danger');
                });
              }}
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

          <ContentTerms>
            <ButtonTerms
              onPress={() => navigate('TermsOfUse')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <ButtonTextTerms>
                {translate('myProfile.text_terms_of_use')}
              </ButtonTextTerms>
            </ButtonTerms>
          </ContentTerms>
        </ScrollContent>

        <ChangePasswordModal
          visible={modalPasswordVisible}
          setVisible={setModalPasswordVisible}
          onCheckCurrentPassword={async currentPassword => {
            const result = await apiMain.post('Customer/CheckPassword', {
              password: currentPassword,
            });
            return !!result.data.status;
          }}
          onUpdatePassword={async newPassword => {
            const result = await apiMain.post('Customer/UpdatePassword', {
              password: newPassword,
              email: user.email,
              withoutCode: true,
            });

            if (result.data.status) {
              AsyncStorage.setItem(
                'lastLogin',
                JSON.stringify({ email: user.email, password: newPassword }),
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
      </Container>

      <ModalSelectPhotoProfile
        visible={showModalSelectPhoto}
        setVisible={setShowModalSelectPhoto}
        sendPhoto={(asset) => sendPhotoRecognition(asset?.uri, null)}
      />
    </>
  );
}
