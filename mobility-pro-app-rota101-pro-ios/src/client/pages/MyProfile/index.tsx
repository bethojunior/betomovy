// @ts-nocheck

import {useEffect, useState} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Feather from '@expo/vector-icons/Feather';
import apiMain from '../../api/apiMain';
import ChangePasswordModal from '../../components/ChangePasswordModal';

import {translate} from '../../locales';
import {
  ButtonPhoto,
  ButtonTerms,
  ButtonTextTerms,
  Container,
  ContainerItem,
  Content,
  ContentPhoto,
  ContentSwitch,
  ContentTerms,
  ContentUser,
  Item,
  Photo,
  PhotoProfile,
  UserDocument,
  UserName,
} from './styles';
import ChangePhoneNumberModal from '../../components/ChangePhoneNumberModal';
import ChangeEmailModal from '../../components/ChangeEmailModal';
import ChangeDocumentModal from '../../components/ChangeDocumentModal';
import ChangeBirthDateModal from '../../components/ChangeBirthDateModal';
import TermsOfUseModal from '../../components/TermsOfUseModal';
import {BiometriaSwitch} from '../../components/BiometriaSwitch';
import {ItemProfile} from '../../components/ItemProfile';
import {useAuth} from '../../../context/auth';
import {FaceDetectorScreen} from '../../components/FaceDetector';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Helper from '../../utils/Helper';
import {buildApp} from '../../../constantBuild/config';
import {RFValue} from 'react-native-responsive-fontsize';

export default function MyProfile() {
  const {navigate} = useNavigation();

  const {user, updateDataUser, setUser, userData} = useAuth();

  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [modalPhoneVisible, setModalPhoneVisible] = useState(false);
  const [modalEmailVisible, setModalEmailVisible] = useState(false);
  const [modalDocumentVisible, setModalDocumentVisible] =
    useState<boolean>(false);
  const [modalDateBirthVisible, setModalDateBirthVisible] =
    useState<boolean>(false);
  const [modalTermsVisible, setModalTermsVisible] = useState(false);
  const [modalFaceDetectorVisible, setModalFaceDetectorVisible] =
    useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isBr, setIsBr] = useState<boolean>(false);

  const getLanguageApp = async () => {
    try {
      const responseLanguage = await AsyncStorage.getItem('@language');
      if (responseLanguage === 'pt_BR') {
        setIsBr(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          setUser({
            ...user,
            profileImageLink: result.uri,
          });
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
      [
        {
          resize: {
            width: 250,
            height: 250,
          },
        },
      ],
      {
        compress: 1,
        format: ImageManipulator.SaveFormat.PNG,
      },
    );

    return manipResult;
  }

  async function sendPhotoRecognition(uri) {
    resizeImage(uri).then(result => {
      async function updatePhoto() {
        const locaUri = result.uri;
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
        const {data} = await apiMain.post(
          'Customer/UpdateProfileImage',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        const {status} = data;

        if (status) {
          updateDataUser();
          setUser({
            ...user,
            profileImageLink: result?.uri,
            profileImage: result?.uri,
          });
          await AsyncStorage.setItem(
            '@Auth:user',
            JSON.stringify({...user, profileImageLink: result?.uri}),
          );
        }
      }
      setModalFaceDetectorVisible(false);
      updatePhoto();
    });
  }

  useEffect(() => {
    getLanguageApp();
  }, []);

  return (
    <>
      <Container>
        <Content>
          <ContentPhoto>
            <ButtonPhoto
              onPress={() => {
                setModalFaceDetectorVisible(true);
              }}
            >
              <Photo>
                <PhotoProfile
                  // eslint-disable-next-line global-require
                  source={
                    user?.profileImage !== 'user.png'
                      ? {
                          uri:
                            buildApp().HOST_IMAGE_CUSTOMER + user?.profileImage,
                        }
                      : require('../../assets/images/user.png')
                  }
                />
                <Feather name="edit" style={{position: 'absolute'}} />
              </Photo>
              <ContainerItem>
                {user?.profileImage === 'user.png' && (
                  <Item
                    style={{
                      color: 'red',
                      fontSize: RFValue(10),
                    }}
                  >
                    {' '}
                    {translate('paymentDriver.error_required')}{' '}
                  </Item>
                )}
              </ContainerItem>
              {/* <Button onPress={() => setModalFaceDetectorVisible(true)}>
                <Feather
                  name="camera"
                  size={40}
                  style={{position: 'absolute'}}
                />
              </Button> */}
            </ButtonPhoto>
            <ContentUser>
              <UserName>{user.nameUser}</UserName>
              <UserDocument>{userData?.document}</UserDocument>
            </ContentUser>
          </ContentPhoto>
        </Content>

        <Content>
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
            label={translate('myProfile.text_document')}
            onPress={() => {
              setModalDocumentVisible(true);
            }}
            textValue={userData?.document}
          />

          <ItemProfile
            label={translate('myProfile.text_birth_date')}
            onPress={() => {
              setModalDateBirthVisible(true);
            }}
            textValue={
              isBr
                ? Helper.formatDateBr(userData?.dateOfBirth)
                : Helper.formatDateDefault(userData?.dateOfBirth)
            }
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
              textValue={true}
            />
          </TouchableOpacity>
        </Content>

        <ContentTerms>
          <ButtonTerms
            onPress={() => {
              setModalTermsVisible(true);
            }}
            activeOpacity={0.8}
          >
            <ButtonTextTerms>
              {translate('myProfile.text_terms_of_use')}
            </ButtonTextTerms>
          </ButtonTerms>
        </ContentTerms>

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
        <ChangeDocumentModal
          currentDocument={userData?.document}
          visible={modalDocumentVisible}
          setVisible={setModalDocumentVisible}
        />
        <ChangeBirthDateModal
          currentDateBirth={userData?.dateOfBirth}
          visible={modalDateBirthVisible}
          setVisible={setModalDateBirthVisible}
        />
        <TermsOfUseModal
          visible={modalTermsVisible}
          setVisible={setModalTermsVisible}
        />
      </Container>

      <FaceDetectorScreen
        visible={modalFaceDetectorVisible}
        onClose={() => setModalFaceDetectorVisible(false)}
        sendPhoto={() => sendPhotoRecognition(capturedImage.uri)}
        setImage={setCapturedImage}
      />
    </>
  );
}
