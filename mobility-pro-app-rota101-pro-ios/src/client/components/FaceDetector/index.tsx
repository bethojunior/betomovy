import {Camera} from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import {useEffect, useRef, useState} from 'react';
import {Dimensions, Modal, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiMain from '../../api/apiMain';
import {CameraButton} from '../../pages/MyProfile/styles';
import {If} from '../If';
import {Container, ContainerButton, Image} from './styles';
import {TextEdit} from '../TextEdit';
import theme from '../../styles/theme';
import {useAuth} from '../../../context/auth';
import {
  CloseButton,
  FaceDesc,
  Faces,
} from '../../../driver/src/components/FaceDetectorModal/styles';
import {Mask} from '../../../driver/src/components/Mask';
import {RFValue} from 'react-native-responsive-fontsize';
import {translate} from '../../locales';

interface PropsFaceDetector {
  visible: boolean;
  onClose?: () => void;
  sendPhoto?: (photo: string) => void;
  setImage: any;
}

export const FaceDetectorScreen = ({
  visible,
  onClose,
  sendPhoto,
  setImage,
}: PropsFaceDetector) => {
  const [hasPermission, setHasPermission] = useState<boolean>();
  const [faceData, setFaceData] = useState([]);
  const {user, setUser} = useAuth();
  const [capturedImage, setCapturedImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const camera = useRef<any>();

  useEffect(() => {
    (async () => {
      const permissions = JSON.parse(await AsyncStorage.getItem('permissions'));
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      permissions.camera = status === 'granted';
      await AsyncStorage.setItem('permissions', JSON.stringify(permissions));
    })();
  }, []);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function getFaceDataView() {
    if (faceData.length === 0) {
      return (
        <Faces>
          <Ionicons
            name="close"
            size={Dimensions.get('window').width / 1.5}
            color={theme.colors.red}
          />
          <View
            style={{
              position: 'absolute',
              bottom: '15%',
            }}
          >
            <FaceDesc>
              {translate('myProfile.place_your_face_inside_the_circle')}
            </FaceDesc>
          </View>
        </Faces>
      );
    }

    return '';
  }

  const handleFacesDetected = ({faces}: any) => {
    setFaceData(faces);
  };

  const takePicture = async () => {
    if (!camera) return;
    const photo = await camera.current.takePictureAsync();
    setPreviewVisible(true);
    setImage(photo);
    setCapturedImage(photo);
  };

  const selectPhoto = async () => {
    sendPhoto(capturedImage.uri);
    setPreviewVisible(false);
    onClose();
  };

  return (
    <Modal visible={visible}>
      <If condition={!previewVisible}>
        <Camera
          ref={(ref: any) => {
            camera.current = ref;
          }}
          type={Camera.Constants.Type.front}
          style={styles.camera}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
            minDetectionInterval: 100,
            tracking: true,
          }}
        >
          <Mask />
          {getFaceDataView()}
          {/* <View
            style={{
              position: 'absolute',
              top: 40,
              right: 10,
            }}
          >
            <Button onPress={onClose}>
              <Ionicons name="close" size={40} color={theme.colors.secondary} />
            </Button>
          </View>
          {getFaceDataView()}
          <If condition={faceData.length !== 0}>
            <View
              style={{
                position: 'absolute',
                bottom: 80,
              }}
            >
              <CameraButton onPress={takePicture}>
                <Ionicons
                  name="camera"
                  size={40}
                  color={theme.colors.primaryText}
                />
              </CameraButton>
            </View>
          </If> */}
        </Camera>
        <View
          style={{
            position: 'absolute',
            top: 50,
            right: 10,
            zIndex: 10,
            width: '100%',
          }}
        >
          <View
            style={{
              alignSelf: 'center',
            }}
          >
            <FaceDesc
              style={{
                fontSize: RFValue(20),
              }}
            >
              {translate('myProfile.security_validation')}
            </FaceDesc>
            <Image
              source={require('../../../../assets/logo_cadeado.png')}
              style={{
                width: 100,
                height: 100,
                alignSelf: 'center',
              }}
            />
          </View>
        </View>
        <View
          style={{
            alignSelf: 'flex-end',
            justifyContent: 'center',
            position: 'absolute',
            top: 20,
            right: 20,
          }}
        >
          <CloseButton onPress={onClose}>
            <Ionicons
              name="close"
              size={RFValue(20)}
              color={theme.colors.primaryText}
            />
          </CloseButton>
        </View>
        <If condition={faceData.length !== 0}>
          <View
            style={{
              position: 'absolute',
              bottom: 80,
              zIndex: 10,
              alignSelf: 'center',
            }}
          >
            <CameraButton onPress={takePicture}>
              <Ionicons
                name="camera"
                size={40}
                color={theme.colors.primaryText}
              />
            </CameraButton>
          </View>
        </If>
      </If>
      <If condition={previewVisible}>
        <Container>
          <Image source={{uri: capturedImage && capturedImage.uri}} />
          <ContainerButton>
            <CameraButton
              onPress={() => {
                setPreviewVisible(false);
                setImage(null);
              }}
            >
              <Ionicons
                name="md-close"
                size={40}
                color={theme.colors.primaryText}
              />
            </CameraButton>
            <CameraButton onPress={selectPhoto}>
              <Ionicons
                name="checkmark"
                size={40}
                color={theme.colors.primaryText}
              />
            </CameraButton>
          </ContainerButton>
        </Container>
      </If>
    </Modal>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faces: {
    backgroundColor: '#000',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  faceDesc: {
    fontSize: 20,
  },
});
