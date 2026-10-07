import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Pressable } from 'react-native';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';
import {
  Ball,
  ButtonEdit,
  Container,
  DriverName,
  Header,
  InfoContent,
  ItemTripType,
  ListTypeContent,
  SimpleText,
  TripTypeContent,
  Content,
  TitleContent,
  ContentForms,
  ButtonBack,
  TitleHeader,
} from './styles';
import apiMainDriver from '../../../api/apiMain';
import EditProfileModal from '../../../components/Modal/EditProfileModal';
import { useUserDriver } from '../../../context/userDriver';
import { useAuth } from '../../../../../context/auth';
import { buildApp } from '../../../../../constantBuild/config';
import { customToast } from '../../../../../utils/FlashMessage';
import Helper from '../../../utils/Helper';

import { translate } from '../../../../../client/locales';
import { useNavigation } from '@react-navigation/native';

import theme from '../../../styles/theme';
import { useStoragePictures } from '../../../hooks/useStoragePictures';
import { getProfileImageUrl } from '../../../utils/imageUrl';
import { ModalSelectPhotoProfile } from '../../../../../components/ModalSelectPhotoProfile';
import { resizeImage } from '../../../../../utils/image';
import ProfileImageEdit from '~/components/ProfileImageEdit';

export default function EditProfileSpeedMob() {
  const [modalEdit, setModalEdit] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [typeEdit, setTypeEdit] = useState<'email' | 'password' | 'phone'>();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  const { userDriverFind } = useUserDriver();
  const { userDriver } = useAuth();
  const { colors } = useTheme();
  const { getStoragePictureSpecific } = useStoragePictures();

  const navigation = useNavigation();

  async function sendPhotoRecognition(uri: string) {
    setModalEdit(false);
    setUploadingPhoto(true);

    try {
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
      const locaUri = uri;
      const filename = locaUri?.split('/').pop();

      // Infer the type of the image
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('driverId', userDriverFind.idDriver);
      // @ts-ignore
      formData.append('photo', {
        uri: uri,
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
      customToast(translate('toast.text_photo_update_error'), 'danger');
      throw error;
    }
  }

  const handleEditPhoto = () => {
    setModalEdit(true);
  };

  return (
    <>
      <Container>
        <Header backgroundColor={theme.colors.primary}>
          <ButtonBack onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={30}
              color={theme.colors.background_global}
            />
          </ButtonBack>
          <TitleHeader color={theme.colors.background_global}>
            {translate('menu.text_edit_profile')}
          </TitleHeader>
        </Header>
        <InfoContent>
          <Content>
            <TitleContent
              backgroundColor={theme.colors.primary}
              color={theme.colors.background_global}
            >
              Foto de perfil
            </TitleContent>
            <Pressable onPress={handleEditPhoto}>
              <ProfileImageEdit
                key={`driver-photo-${imageKey}`}
                loading={uploadingPhoto}
                source={{
                  uri: getProfileImageUrl(
                    userDriverFind?.profileImage,
                    getStoragePictureSpecific('driver'),
                    buildApp().HOST_IMAGE_DRIVER
                  ),
                }}
              />
            </Pressable>
            <View style={{ margin: 30 }}>
              <DriverName>
                {Helper.maskNames(userDriverFind?.name.trim())}
              </DriverName>
              <SimpleText>{userDriverFind.document || ''}</SimpleText>
            </View>
          </Content>
          <ContentForms>
            <TitleContent
              backgroundColor={theme.colors.primary}
              color={theme.colors.background_global}
            >
              Alterar dados
            </TitleContent>
            <ButtonEdit
              activeOpacity={0.5}
              onPress={() => {
                setTypeEdit('email');
                setEditModal(true);
              }}
            >
              <SimpleText>Email:</SimpleText>
              <View style={{ flexDirection: 'row' }}>
                <SimpleText>{userDriver?.email || ''}</SimpleText>
                <Feather
                  style={{ marginLeft: 5, alignSelf: 'center' }}
                  color={colors.secondary}
                  name="edit"
                />
              </View>
            </ButtonEdit>
            <ButtonEdit
              activeOpacity={0.5}
              onPress={() => {
                setTypeEdit('phone');
                setEditModal(true);
              }}
            >
              <SimpleText>Telefone:</SimpleText>
              <View style={{ flexDirection: 'row' }}>
                <SimpleText>{userDriverFind.phone || ''}</SimpleText>
                <Feather
                  style={{ marginLeft: 5, alignSelf: 'center' }}
                  color={colors.secondary}
                  name="edit"
                />
              </View>
            </ButtonEdit>
            <ButtonEdit
              activeOpacity={0.5}
              onPress={() => {
                setTypeEdit('password');
                setEditModal(true);
              }}
            >
              <SimpleText>Senha:</SimpleText>
              <View style={{ flexDirection: 'row' }}>
                <SimpleText>******</SimpleText>
                <Feather
                  style={{ marginLeft: 5, alignSelf: 'center' }}
                  color={colors.secondary}
                  name="edit"
                />
              </View>
            </ButtonEdit>
          </ContentForms>
          <TripTypeContent>
            <TitleContent
              backgroundColor={theme.colors.primary}
              color={theme.colors.background_global}
            >
              {translate('myProfile.title_trip_type')}
            </TitleContent>

            {userDriverFind?.tripTypes?.map(type => {
              return (
                <ListTypeContent key={type.tripTypeId}>
                  <Ball backgroundColor={theme.colors.primary} />
                  <ItemTripType> {type.tripType}</ItemTripType>
                </ListTypeContent>
              );
            })}
          </TripTypeContent>
        </InfoContent>
        <EditProfileModal
          visible={editModal}
          setVisible={setEditModal}
          type={typeEdit}
        />

        <ModalSelectPhotoProfile
          visible={modalEdit}
          setVisible={() => setModalEdit(false)}
          sendPhoto={(asset) => sendPhotoRecognition(asset?.uri)}
          configKey="enable_driver_open_gallery"
        />
      </Container>
    </>
  );
}
