import {useState} from 'react';
import {View, Modal} from 'react-native';
import {useTheme} from 'styled-components';
import {AntDesign, Feather} from '@expo/vector-icons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  Ball,
  ButtonEdit,
  Container,
  ContainerModal,
  ContentOptions,
  ContentOptionsButtons,
  ContentOptionsText,
  DriverName,
  Exit,
  Header,
  ImageContent,
  InfoContent,
  ItemTripType,
  ListTypeContent,
  Photo,
  SimpleText,
  TitleTripType,
  TripTypeContent,
} from './styles';
import apiMainDriver from '../../api/apiMain';
import {FaceDetectorScreen} from '../../components/FaceDetectorModal';
import EditProfileModal from '../../components/Modal/EditProfileModal';
import {useUserDriver} from '../../context/userDriver';
import Preload from '../../../../client/components/Preload';
import {useAuth} from '../../../../context/auth';
import {buildApp} from '../../../../constantBuild/config';
import {customToast} from '../../../../utils/FlashMessage';
import {Button} from '../../components/Button';
import Helper from '../../utils/Helper';

import {uploadDocument} from '../../utils/pdf/upload';
import {translate} from '../../../../client/locales';
import {resizeImage} from '../../utils/image';

export default function Profile() {
  const [modalFaceDetector, setModalFaceDetector] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [typeEdit, setTypeEdit] = useState<'email' | 'password' | 'phone'>();
  const [loading, setLoading] = useState(false);

  const {userDriverFind} = useUserDriver();
  const {userDriver, generalSettings} = useAuth();
  const {colors} = useTheme();

  async function sendPhotoRecognition(uri) {
    setModalEdit(false);
    setLoading(true);
    resizeImage(uri, 512, 512).then(result => {
      async function updatePhoto() {
        const locaUri = result.uri;
        const filename = locaUri.split('/').pop();

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
        const {
          data: {status},
        } = await apiMainDriver.post('Driver/EditProfileImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setLoading(false);

        if (!status) {
          customToast('Erro ao atualizar sua foto, tente novamente', 'danger');
        }

        customToast('Foto enviada para avaliação, aguarde', 'success');
      }
      setModalFaceDetector(false);
      updatePhoto();
    });
  }

  const handleEditPhoto = (conditional: string) => {
    switch (conditional) {
      case '1':
        return setModalEdit(true);
      case '0':
        return setModalFaceDetector(true);
      default:
        return setModalFaceDetector(true);
    }
  };

  const onGallery = async () => {
    setModalEdit(false);
    const response = await uploadDocument('image/*');
    if (response.type === 'cancel') return;
    const manipulatedImage = await resizeImage(response.uri, 512, 512);
    const filename = manipulatedImage.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const typeImage = match ? `image/${match[1]}` : `image`;

    setCapturedImage({
      uri: manipulatedImage.uri,
      type: typeImage,
      name: filename,
    });

    await sendPhotoRecognition(manipulatedImage.uri);
  };

  return (
    <>
      <Preload visible={loading} />
      <Container>
        <InfoContent>
          <Header>
            <TouchableOpacity
              onPress={() =>
                handleEditPhoto(
                  generalSettings.find(
                    item => item.key === 'enable_driver_open_gallery',
                  ).value,
                )
              }
            >
              <Photo>
                <ImageContent
                  source={
                    userDriverFind != null && {
                      uri: `${buildApp().HOST_IMAGE_DRIVER}${
                        userDriverFind?.profileImage
                      }`,
                    }
                  }
                />
                <Feather name="edit" style={{position: 'absolute'}} />
              </Photo>
            </TouchableOpacity>
            <View style={{margin: 30}}>
              <DriverName>
                {Helper.maskNames(userDriverFind?.name.trim())}
              </DriverName>
              <SimpleText>{userDriverFind.document || ''}</SimpleText>
            </View>
          </Header>
          <View style={{marginTop: 40}}>
            <ButtonEdit
              activeOpacity={0.5}
              onPress={() => {
                setTypeEdit('email');
                setEditModal(true);
              }}
            >
              <SimpleText>Email:</SimpleText>
              <View style={{flexDirection: 'row'}}>
                <SimpleText>{userDriver?.email || ''}</SimpleText>
                <Feather
                  style={{marginLeft: 5, alignSelf: 'center'}}
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
              <View style={{flexDirection: 'row'}}>
                <SimpleText>{userDriverFind.phone || ''}</SimpleText>
                <Feather
                  style={{marginLeft: 5, alignSelf: 'center'}}
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
              <View style={{flexDirection: 'row'}}>
                <SimpleText>******</SimpleText>
                <Feather
                  style={{marginLeft: 5, alignSelf: 'center'}}
                  color={colors.secondary}
                  name="edit"
                />
              </View>
            </ButtonEdit>
          </View>
          <TripTypeContent>
            <TitleTripType>
              {translate('myProfile.title_trip_type')}
            </TitleTripType>

            {userDriverFind?.tripTypes?.map(type => {
              return (
                <ListTypeContent key={type.tripTypeId}>
                  <Ball />
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
        <Modal visible={modalEdit} transparent>
          <ContainerModal>
            <ContentOptions>
              <ContentOptionsText>
                {translate('myProfile.do_you_want_to_use_camera_or_gallery')}
              </ContentOptionsText>

              <ContentOptionsButtons>
                <Button
                  title={translate('myProfile.text_cam')}
                  onPress={() => setModalFaceDetector(true)}
                  small
                />
                <Button
                  title={translate('myProfile.text_gallery')}
                  onPress={() => onGallery()}
                  small
                />
              </ContentOptionsButtons>
              <Exit onPress={() => setModalEdit(false)} activeOpacity={1}>
                <AntDesign
                  name="closecircleo"
                  size={22}
                  color={colors.primary}
                  onPress={() => setModalEdit(false)}
                />
              </Exit>
            </ContentOptions>
          </ContainerModal>
        </Modal>
        <FaceDetectorScreen
          visible={modalFaceDetector}
          onClose={() => setModalFaceDetector(false)}
          sendPhoto={() => sendPhotoRecognition(capturedImage.uri)}
          setImage={setCapturedImage}
        />
      </Container>
    </>
  );
}
