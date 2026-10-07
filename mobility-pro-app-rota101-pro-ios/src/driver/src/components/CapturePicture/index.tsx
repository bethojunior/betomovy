// @ts-nocheck
import {StyleSheet, Text} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {Camera} from 'expo-camera';
import {shareAsync} from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import {AntDesign, Entypo, FontAwesome5} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from 'styled-components';
import {
  ButtonAccept,
  ButtonAlter,
  ButtonCapture,
  ButtonRecused,
  Container,
  ContainerButtons,
  ContainerPreview,
  Preview,
} from './styles';
import {resizeImage} from '../../utils/image';

interface CamProps {
  savePicture: (photo: string) => void;
  typeCam?: string;
}

export default function CapturePicture({savePicture, typeCam}: CamProps) {
  const cameraRef = useRef();
  const {colors} = useTheme();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [type, setType] = useState(typeCam || 'back');

  useEffect(() => {
    (async () => {
      const permissions = JSON.parse(await AsyncStorage.getItem('permissions'));
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === 'granted');
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');

      permissions.camera = cameraPermission.status === 'granted';
      permissions.gallery = mediaLibraryPermission.status === 'granted';
      await AsyncStorage.setItem('permissions', JSON.stringify(permissions));
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  }
  if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  const takePic = async () => {
    const options = {
      quality: 0,
      base64: false,
      exif: false,
    };

    const newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    const sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    const savePhoto = async () => {
      const manipulatedImage = await resizeImage(photo.uri, 512, 512);

      const filename = manipulatedImage.uri.split('/').pop();

      const match = /\.(\w+)$/.exec(filename);
      const typeImage = match ? `image/${match[1]}` : `image`;

      savePicture({
        uri: manipulatedImage.uri,
        type: typeImage,
        name: filename,
      });
    };

    return (
      <ContainerPreview>
        <Preview source={{uri: photo.uri}} type={typeCam}>
          <ContainerButtons>
            <ButtonRecused title="Discard" onPress={() => setPhoto(undefined)}>
              <AntDesign name="close" size={30} color={colors.white} />
            </ButtonRecused>

            {hasMediaLibraryPermission ? (
              <ButtonAccept title="Save" onPress={savePhoto}>
                <AntDesign name="check" size={30} color={colors.white} />
              </ButtonAccept>
            ) : undefined}
          </ContainerButtons>
        </Preview>
      </ContainerPreview>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef} type={type} ratio={'16:9'}>
      <Container>
        <ButtonCapture onPress={takePic}>
          <Entypo name="camera" size={30} color={colors.primary} />
        </ButtonCapture>

        <ButtonAlter
          onPress={() => {
            setType(type === 'back' ? 'front' : 'back');
          }}
        >
          <FontAwesome5 name="sync-alt" size={28} color={colors.primary} />
        </ButtonAlter>
      </Container>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
