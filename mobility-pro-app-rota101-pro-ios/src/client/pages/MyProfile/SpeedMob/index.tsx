// @ts-nocheck
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Feather from '@expo/vector-icons/Feather';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ChangePasswordModal from '../../../components/ChangePasswordModal';
import DeleteAccountModal from '../../../components/DeleteAccountModal';
import { useDeleteAccount } from '../../../hooks/useDeleteAccount';
import { customToast } from '../../../../utils/FlashMessage';
import apiMain from '../../../api/apiMain';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { translate } from '../../../locales';
import {
  ButtonPhoto,
  Container,
  Content,
  ContentPhoto,
  ContentSwitch,
  ContentUser,
  Photo,
  PhotoProfile,
  UserName,
  Body,
  ButtonBack,
  TitlePage,
  ContentHeader,
} from './styles';
import ChangePhoneNumberModal from '../../../components/ChangePhoneNumberModal';
import ChangeEmailModal from '../../../components/ChangeEmailModal';
import { BiometriaSwitch } from '../../../components/BiometriaSwitch';
import { ItemProfile } from '../../../components/ItemProfile';
import Preload from '../../../components/Preload';
import { useAuth } from '../../../../context/auth';
import { useProfilePhotoUpload } from '../../../hooks/useProfilePhotoUpload';
import { resizeImage } from '../../../../utils/image';

import theme from '../../../styles/theme';

export default function MyProfileSpeedMob() {
  const { navigate, goBack } = useNavigation();

  const { user } = useAuth();

  const [uriProfile, setUriProfile] = useState(null);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [modalPhoneVisible, setModalPhoneVisible] = useState(false);
  const [modalEmailVisible, setModalEmailVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { postExcludeAccount, loading: deleteLoading } = useDeleteAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageKey, setImageKey] = useState(0);

  const { uploadProfileImage } = useProfilePhotoUpload();

  useEffect(() => {
    setUriProfile(user.profileImageLink);
  }, [user.profileImageLink]);

  async function sendPhoto() {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        customToast(translate('toast.text_camera_permission_required'), 'warning');
        return;
      }

      const options = {
        quality: 1,
        allowsEditing: true,
      };

      const cameraResult = await ImagePicker.launchCameraAsync(options);

      if (cameraResult.canceled || !cameraResult.assets || !cameraResult.assets[0]) {
        return;
      }

      const asset = cameraResult.assets[0];
      let imageToUpload = asset.uri;
      try {
        const result = await resizeImage(asset.uri, 400, 400);
        if (result?.uri) {
          imageToUpload = result.uri;
        }
      } catch (resizeErr) {
        console.warn('Falha ao redimensionar foto:', resizeErr);
      }

      setUriProfile(imageToUpload);
      await uploadProfileImage(imageToUpload, {
        onSuccess: serverUrl => {
          setUriProfile(serverUrl);
          setImageKey(Date.now());
          customToast(translate('toast.text_photo_updated_success'), 'success');
        },
      });
    } catch (error: any) {
      console.error('Erro ao atualizar foto:', error);
      if (error?.message === 'Network Error' || error?.code === 'ECONNABORTED') {
        customToast(translate('toast.text_image_too_large_or_slow_connection'), 'danger');
      } else if (error?.response?.status === 413) {
        customToast(translate('toast.text_image_too_large'), 'danger');
      } else {
        customToast(error?.response?.data?.message || error?.message || translate('toast.text_photo_update_error'), 'danger');
      }
    }
  }

  async function sendPhotoRecognition(uri: string) {
    try {
      let imageToUpload = uri;
      try {
        const result = await resizeImage(uri, 400, 400);
        if (result?.uri) {
          imageToUpload = result.uri;
        }
      } catch (resizeErr) {
        console.warn('Falha ao redimensionar foto:', resizeErr);
      }

      setUriProfile(imageToUpload);
      await uploadProfileImage(imageToUpload, {
        onSuccess: serverUrl => {
          setUriProfile(serverUrl);
          setImageKey(Date.now());
          customToast(translate('toast.text_photo_updated_success'), 'success');
        },
      });
    } catch (error: any) {
      console.error('Erro ao atualizar foto:', error);
      if (error?.message === 'Network Error' || error?.code === 'ECONNABORTED') {
        customToast(translate('toast.text_image_too_large_or_slow_connection'), 'danger');
      } else if (error?.response?.status === 413) {
        customToast(translate('toast.text_image_too_large'), 'danger');
      } else {
        customToast(error?.response?.data?.message || error?.message || translate('toast.text_photo_update_error'), 'danger');
      }
    }
  }

  return (
    <>
      <Container>
        <Preload visible={loading} />
        <Content>
          <ContentPhoto backgroundColor={theme.colors.primary}>
            <ContentHeader>
              <ButtonBack onPress={() => goBack()}>
                <Ionicons
                  name="arrow-back"
                  size={30}
                  color={theme.colors.background_global}
                />
              </ButtonBack>
              <TitlePage colorText={theme.colors.background_global}>
                {translate('appRoutes.title_my_profile')}
              </TitlePage>
            </ContentHeader>
            <ButtonPhoto
              onPress={() => {
                sendPhoto();
              }}
            >
              <Photo>
                <PhotoProfile
                  key={`photo-speedmob-${imageKey}`}
                  defaultSource={require('../../../assets/images/preuser.png')}
                  source={
                    uriProfile
                      ? {
                        uri: uriProfile,
                      }
                      : null
                  }
                />
                <Feather
                  name="edit"
                  style={{ position: 'absolute' }}
                  color={theme.colors.background_global}
                />
              </Photo>
              {/* <Button onPress={() => setModalFaceDetectorVisible(true)}>
                        <Feather
                        name="camera"
                        size={40}
                        style={{position: 'absolute'}}
                        />
                    </Button> */}
            </ButtonPhoto>
            <ContentUser>
              <UserName colorText={theme.colors.background_global}>
                {user.nameUser}
              </UserName>
            </ContentUser>
          </ContentPhoto>
        </Content>

        <Body>
          <ItemProfile
            label={translate('myProfile.text_email')}
            onPress={() => {
              setModalEmailVisible(true);
            }}
            textValue={user.email}
          />

          <ItemProfile
            label={translate('myProfile.text_phone')}
            onPress={() => {
              setModalPhoneVisible(true);
            }}
            textValue={user.phone}
          />

          <ItemProfile
            label={translate('myProfile.text_password')}
            onPress={() => {
              setModalPasswordVisible(true);
            }}
            textValue={'********'}
          />

          <ContentSwitch>
            <BiometriaSwitch />
          </ContentSwitch>

          <TouchableOpacity
            onPress={() => setDeleteModalVisible(true)}
            activeOpacity={0.8}
          >
            <ItemProfile
              label={translate('exclude.delete_account')}
              onPress={() => { }}
              textValue={''}
            />
          </TouchableOpacity>
        </Body>

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
        <ChangePhoneNumberModal
          currentPhone={user.phone}
          visible={modalPhoneVisible}
          setVisible={setModalPhoneVisible}
        />
        <ChangeEmailModal
          currentEmail={user.email}
          visible={modalEmailVisible}
          setVisible={setModalEmailVisible}
        />
      </Container>
    </>
  );
}
