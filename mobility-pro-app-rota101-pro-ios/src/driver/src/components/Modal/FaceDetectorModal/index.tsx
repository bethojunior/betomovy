import {Camera} from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import {useEffect, useRef, useState} from 'react';
import {Modal, View, TouchableOpacity} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { If } from '../../If';
import {
  Container,
  ContainerButton,
  Image,
  CameraButton,
  FaceDesc,
  Faces,
  Cam,
  CloseButton,
} from './styles';
import theme from '../../../styles/theme';

interface PropsFaceDetector {
  setUriProfile?: (uri: string) => void;
  visible: boolean;
  onClose?: () => void;
  sendPhoto?: () => void;
  setImage: any;
}

export const FaceDetectorScreen = ({
  setUriProfile,
  visible,
  onClose,
  sendPhoto,
  setImage,
}: PropsFaceDetector) => {
  const [hasPermission, setHasPermission] = useState<boolean>();
  const [faceData, setFaceData] = useState([]);
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
          <FaceDesc>Sem rosto detectado :(</FaceDesc>
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
  return (
    <Modal style={{flex: 1}} visible={visible}>
      <If condition={!previewVisible}>
        <Cam
          ref={(ref: any) => {
            camera.current = ref;
          }}
          type={Camera.Constants.Type.front}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
            minDetectionInterval: 100,
            tracking: true,
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: 20,
              right: 10,
            }}
          >
            <CloseButton onPress={onClose}>
              <Ionicons
                name="close"
                size={20}
                color={theme.colors.primaryText}
              />
            </CloseButton>
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
                <Ionicons name="camera" size={40} color={theme.colors.primaryText} />
              </CameraButton>
            </View>
          </If>
        </Cam>
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
              <Ionicons name="md-close" size={40} color={theme.colors.primaryText} />
            </CameraButton>
            <CameraButton onPress={sendPhoto}>
              <Ionicons name="checkmark" size={40} color={theme.colors.primaryText} />
            </CameraButton>
          </ContainerButton>
        </Container>
      </If>
    </Modal>
  );
};
