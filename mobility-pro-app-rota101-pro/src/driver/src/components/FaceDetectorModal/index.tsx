import { Camera } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { If } from '../If';
import { RFValue } from 'react-native-responsive-fontsize';

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
import theme from '../../styles/theme';
import { Mask } from '../Mask';
import { translate } from '../../../../client/locales';

interface PropsFaceDetector {
  visible: boolean;
  onClose?: () => void;
  sendPhoto?: () => void;
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
  const [capturedImage, setCapturedImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const camera = useRef<any>(null);

  const getCamPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    if (visible) {
      getCamPermission();
    }
  }, [visible]);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // function getFaceDataView() {
  //   if (faceData.length === 0) {
  //     return (
  //       <Faces>
  //         <Ionicons
  //           name="close"
  //           size={Dimensions.get('window').width * 0.5}
  //           color={theme.colors.red}
  //         />
  //         <View
  //           style={{
  //             position: 'absolute',
  //             bottom: '15%',
  //           }}
  //         >
  //           <FaceDesc>
  //             {translate('myProfile.place_your_face_inside_the_circle')}
  //           </FaceDesc>
  //         </View>
  //       </Faces>
  //     );
  //   }

  //   return '';
  // }

  // const handleFacesDetected = ({ faces }: any) => {
  //   setFaceData(faces);
  // };

  const takePicture = async () => {
    if (!camera) return;
    const photo = await camera.current.takePictureAsync();
    setPreviewVisible(true);
    setImage(photo);
    setCapturedImage(photo);
  };

  return (
    <Modal style={{ flex: 1 }} visible={visible}>
      <If condition={!previewVisible}>
        <Cam
          ref={(ref: any) => {
            camera.current = ref;
          }}
          facing={"front"}
        // onFacesDetected={handleFacesDetected}
        // faceDetectorSettings={{
        //   mode: FaceDetector.FaceDetectorMode.fast,
        //   detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        //   runClassifications: FaceDetector.FaceDetectorClassifications.none,
        //   minDetectionInterval: 100,
        //   tracking: true,
        // }}
        >
          <Mask />
          {/* @TODO: migrar reconhecimento facial para "react-native-vision-camera" e "react-native-vision-camera-face-detector" */}
          {/* {getFaceDataView()} */}
        </Cam>
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
            {/* <FaceDesc
              style={{
                fontSize: RFValue(20),
              }}
            >
              {translate('myProfile.security_validation')}
            </FaceDesc>
            <Image
              source={require('../../../../../assets/logo_cadeado.png')}
              style={{
                width: 100,
                height: 100,
                alignSelf: 'center',
              }}
            /> */}
          </View>
          <View
            style={{
              alignSelf: 'flex-end',
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
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
        </View>
        {/* <If condition={faceData.length !== 0}> */}
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
              color="black"
            />
          </CameraButton>
        </View>
        {/* </If> */}
      </If>
      <If condition={previewVisible}>
        <Container>
          <Image source={{ uri: capturedImage && capturedImage.uri }} />
          <ContainerButton>
            <CameraButton
              onPress={() => {
                setPreviewVisible(false);
                setImage(null);
              }}
            >
              <Ionicons
                name="close"
                size={40}
                style={{
                  zIndex: 10,
                }}
                color="#FF0000"
              />
            </CameraButton>
            <CameraButton onPress={sendPhoto}>
              <Ionicons
                name="checkmark"
                size={40}
                style={{
                  zIndex: 10,
                }}
                color="#00FF00"
              />
            </CameraButton>
          </ContainerButton>
        </Container>
      </If>
    </Modal>
  );
};
