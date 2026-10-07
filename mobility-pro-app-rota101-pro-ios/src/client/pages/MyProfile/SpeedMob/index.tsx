// @ts-nocheck
import {useEffect, useState} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Feather from '@expo/vector-icons/Feather';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiMain from '../../../api/apiMain';
import ChangePasswordModal from '../../../components/ChangePasswordModal';

import {translate} from '../../../locales';
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
import {BiometriaSwitch} from '../../../components/BiometriaSwitch';
import {ItemProfile} from '../../../components/ItemProfile';
import Preload from '../../../components/Preload';
import {useAuth} from '../../../../context/auth';

import theme from '../../../styles/theme';

export default function MyProfileSpeedMob() {
  const {navigate, goBack} = useNavigation();

  const {user, updateDataUser} = useAuth();

  const [uriProfile, setUriProfile] = useState(null);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [modalPhoneVisible, setModalPhoneVisible] = useState(false);
  const [modalEmailVisible, setModalEmailVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setUriProfile(user.profileImageLink);
  }, []);

  // eslint-disable-next-line consistent-return
  async function sendPhoto() {
    if (Platform.OS !== 'web') {
      const {status} = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        return Alert.alert(
          translate('myProfile.message_alert_camera_permission'),
        );
      }
    }

    const options = {
      storageOptions: {
        skipBackup: false,
        path: 'images',
      },
      quality: 1,
      aspect: [4, 4],
      allowsEditing: true,
      maxWidth: 250,
      maxHeight: 250,
    };

    ImagePicker.launchCameraAsync(options).then(response => {
      if (response.didCancel || response.error) return;

      resizeImage(response.uri).then(result => {
        async function updatePhoto() {
          const locaUri = result.uri;
          setUriProfile(result.uri);
          const filename = locaUri.split('/').pop();

          // Infer the type of the image
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;

          const formData = new FormData();
          formData.append('customerId', user.idCustomer);
          formData.append('photo', {
            uri: result.uri,
            type,
            name: filename,
          });
          const {
            data: {status},
          } = await apiMain.post('Customer/UpdateProfileImage', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (status) {
            updateDataUser();
          }
        }

        updatePhoto();
      });
    });
  }

  async function resizeImage(uri) {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{resize: {width: 400, height: 400}}],
      {compress: 1, format: ImageManipulator.SaveFormat.PNG},
    );

    return manipResult;
  }

  async function sendPhotoRecognition(uri) {
    resizeImage(uri).then(result => {
      async function updatePhoto() {
        const locaUri = result.uri;
        setUriProfile(result.uri);
        const filename = locaUri.split('/').pop();

        // Infer the type of the image
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        const formData = new FormData();
        formData.append('customerId', user.idCustomer);
        formData.append('photo', {
          uri: result.uri,
          type,
          name: filename,
        });
        const {
          data: {status},
        } = await apiMain.post('Customer/UpdateProfileImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (status) {
          updateDataUser();
        }
      }
      updatePhoto();
    });
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
                  // eslint-disable-next-line global-require
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
                  style={{position: 'absolute'}}
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
            onPress={() => {
              navigate('ContactUs', {
                name: translate('exclude.delete_my_account'),
                exclude: true,
              });
            }}
            activeOpacity={0.8}
          >
            <ItemProfile
              label={translate('exclude.delete_account')}
              onPress={() => {}}
              textValue={''}
            />
          </TouchableOpacity>
        </Body>

        <ChangePasswordModal
          email={user.email}
          visible={modalPasswordVisible}
          setVisible={setModalPasswordVisible}
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
