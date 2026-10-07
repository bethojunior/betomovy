import {useEffect, useState} from 'react';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import Foundation from '@expo/vector-icons/Foundation';
import {useTheme} from 'styled-components';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useUserDriver} from '../../context/userDriver';
import {
  ArrowBackContainer,
  Container,
  ContentDoc,
  ContentItem,
  DocumentItem,
  Header,
  ImageContent,
  InfoItemText,
  ItemAttention,
  ItemLabel,
  Photo,
  StatusPhoto,
  ViewDocument,
} from './styles';
import {FaceDetectorScreen} from '../../../../client/components/FaceDetector';
import Preload from '../../../../client/components/Preload';
import {resizeImage} from '../../utils/image';
import {useAuth} from '../../../../context/auth';
import {If} from '../../components/If';
import {translate} from '../../../../client/locales';
import {buildApp} from '../../../../constantBuild/config';
import {BackHandler} from 'react-native';

export function StatusPending() {
  const {navigate}: NavigationProp<ParamListBase> = useNavigation();
  const {colors} = useTheme();
  const {userDriverFind, EditProfileImage, getDriverFind} = useUserDriver();
  const {userDriver, signOutDriver, newActionFb, setNewActionFb} = useAuth();
  const [modalFaceDetector, setModalFaceDetector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [docs, setDocs] = useState([]);

  async function sendPhotoRecognition(uri) {
    setLoading(true);

    const manipulatedImage = await resizeImage(uri, 512, 512);

    const filename = manipulatedImage.uri.split('/').pop();

    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    await EditProfileImage(manipulatedImage.uri, type, filename);

    setModalFaceDetector(false);
    setLoading(false);
  }

  const checkDriverStatus = () => {
    if (userDriverFind?.driverRegisterStatusId === '1') {
      navigate('Home');
    }
    setNewActionFb('');
  };

  useEffect(() => {
    if (newActionFb.length > 0) {
      getDriverFind();
    }
  }, [newActionFb]);

  useEffect(() => {
    if (userDriverFind) {
      const docsPen = userDriverFind?.docsUser?.filter(docsFilter => {
        return docsFilter.docStatusId !== '1';
      });

      setDocs(docsPen);
      checkDriverStatus();
    }
  }, [userDriverFind]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      signOutDriver();
      return true;
    });
  }, []);

  return (
    <Container>
      <Preload visible={loading} />
      <ArrowBackContainer>
        <Ionicons
          name="arrow-back"
          size={30}
          color={colors.secondary}
          onPress={signOutDriver}
        />
      </ArrowBackContainer>
      <Header>
        <Photo onPress={() => setModalFaceDetector(true)} activeOpacity={0.8}>
          <ImageContent
            source={
              userDriverFind != null && {
                uri:
                  userDriverFind?.profileImageTemp !== null
                    ? `${buildApp().PATH_IMAGE_TEMP}${
                        userDriverFind?.profileImageTemp
                      }`
                    : `${buildApp().HOST_IMAGE_DRIVER}${
                        userDriverFind?.profileImage
                      }`,
              }
            }
          />
          <Feather name="edit" style={{position: 'absolute'}} />
        </Photo>

        <StatusPhoto statusImage={userDriverFind.profileImageStatusId}>
          {translate('driverStatus.text_statu_image')}:{' '}
          {userDriverFind?.profileImageStatus}
        </StatusPhoto>
      </Header>

      <ContentItem>
        <ItemLabel>{translate('driverStatus.label_name')}</ItemLabel>
        <InfoItemText>{userDriverFind?.name}</InfoItemText>
      </ContentItem>

      <ContentItem>
        <ItemLabel>{translate('driverStatus.label_document')}</ItemLabel>
        <InfoItemText>{userDriverFind?.document}</InfoItemText>
      </ContentItem>

      <ContentItem>
        <ItemLabel>{translate('driverStatus.label_phone')}</ItemLabel>
        <InfoItemText>{userDriverFind?.phone}</InfoItemText>
      </ContentItem>

      <ContentItem>
        <ItemLabel>{translate('driverStatus.label_email')}</ItemLabel>
        <InfoItemText>{userDriver?.email}</InfoItemText>
      </ContentItem>

      <If condition={docs?.length > 0}>
        <DocumentItem
          activeOpacity={0.8}
          onPress={() =>
            navigate('DocumentPending', {
              docs,
            })
          }
        >
          <ContentDoc>
            <ItemLabel>{translate('driverStatus.label_documents')}</ItemLabel>
            <InfoItemText>
              {translate('driverStatus.label_images')}
            </InfoItemText>
            <ItemAttention>
              {translate('driverStatus.label_documents_pending')}
            </ItemAttention>
          </ContentDoc>

          <ViewDocument>
            <Foundation
              name="alert"
              size={21}
              color={colors.red}
              style={{marginRight: 25}}
            />
            <Ionicons
              name="ios-arrow-redo-sharp"
              size={30}
              color={colors.primary}
            />
          </ViewDocument>
        </DocumentItem>
      </If>

      <ContentItem>
        <ItemLabel>{translate('driverStatus.label_status')}</ItemLabel>
        <InfoItemText>{userDriverFind?.driverRegisterStatus}</InfoItemText>
      </ContentItem>

      <FaceDetectorScreen
        visible={modalFaceDetector}
        onClose={() => setModalFaceDetector(false)}
        sendPhoto={() => sendPhotoRecognition(capturedImage.uri)}
        setImage={setCapturedImage}
      />
    </Container>
  );
}
