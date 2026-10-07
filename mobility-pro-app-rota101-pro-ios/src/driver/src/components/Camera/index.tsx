import {Camera} from 'expo-camera';
import {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {useLocal} from '../../hooks/location';
import {sendDocumentPhoto} from '../Modal/InTrip/services';
import {useUserDriver} from '../../context/userDriver';
import {useConfigLocal} from '../../context/ConfigLocal';

interface Props {
  width?: string;
  height?: string;
  typeCamera?: any;
}

export type RefCamera = {
  sendVideoPanic: () => Promise<any>;
};

export const CameraComponent = forwardRef<RefCamera, Props>((props, ref) => {
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const {userDriverFind} = useUserDriver();
  const {durationCam} = useConfigLocal()?.states;
  const {location} = useLocal(false);

  useImperativeHandle(ref, () => ({
    async sendVideoPanic() {
      if (cameraRef.current) {
        const videoUri = await takeVideo();
        return videoUri;
      }
    },
  }));

  const takeVideo = async () => {
    if (cameraRef) {
      const data = await cameraRef.current.recordAsync({
        maxDuration: durationCam,
        quality: `480p`,
      });
      await takePictureAndSendApi(data.uri);
      return data.uri;
    }
    return null;
  };

  const takePictureAndSendApi = async videoUri => {
    const {status} = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Camera.requestCameraPermissionsAsync();
      return;
    }
    if (!videoUri) {
      return;
    }
    const filename = videoUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const typeVideo = match ? `video/${match[1]}` : `video`;

    const payload = {
      uri: videoUri,
      name: filename,
      type: typeVideo,
    };
    await sendDocumentPhoto(
      setLoading,
      payload,
      userDriverFind,
      location?.coords?.latitude,
      location?.coords?.longitude,
      true,
    );
  };

  return (
    <Camera
      ref={ref => (cameraRef.current = ref)}
      type={Camera.Constants.Type['front']}
      style={{
        width: props?.width || '50%',
        height: props?.height || '50%',
      }}
    />
  );
});
