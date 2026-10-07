import {Camera} from 'expo-camera';
import Helper from '../../utils/Helper';
import {ButtonPanicContainer} from '../ButtonPanicContainer';
import {useIsFocused} from '@react-navigation/native';
import {useEffect, useRef, useState} from 'react';
import {useConfigLocal} from '../../context/ConfigLocal';
import {sendDocumentPhoto} from '../Modal/InTrip/services';
import {useUserDriver} from '../../context/userDriver';
import {useLocal} from '../../hooks/location';
import {Platform} from 'react-native';
import {useTripStatusProvider} from '../../context/TripStatus';
import {useTripProvider} from '../../context/Trip';
// @ts-ignore
import Torch from 'react-native-torch';
import {useNetwork} from '../../../../context/ConfigGlobal';

const CameraObject: any = Camera;

export const AlertPanicComponent = ({setCountVisible}) => {
  const {states} = useConfigLocal();
  const {stateTrip} = useTripProvider();
  const {callDriverModal} = stateTrip;
  const {countTakeVolume, setCountTakeVolume} = useTripStatusProvider();
  const {itsNetwork} = useNetwork();
  const {userDriverFind} = useUserDriver();
  const {durationCam} = states;
  const cameraRef = useRef<any>(null);

  const [videoUri, setVideoUri] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [flashCamera, setCameraFlash] = useState(
    CameraObject.Constants.FlashMode.off,
  );
  const [typeCamera, setTypeCamera] = useState(
    CameraObject.Constants.Type.front,
  );
  const [cameraLoading, setCameraLoading] = useState(false);
  const [visibleAlertProtect, setVisibleAlertProtect] = useState(false);
  const {location} = useLocal();

  const isFocused = useIsFocused();
  const takeVideo = async () => {
    if (cameraRef) {
      const data = await cameraRef.current.recordAsync({
        maxDuration: durationCam,
        quality: `480p`,
      });
      setVideoUri(data.uri);
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
    if (!itsNetwork) {
      return;
    }
    // ESSA FUNCAO E PARA SALVAR A FOTO NA GALERIA, COMENTANDO PARA CASO PRECISE SALVAR NO DISPOSITIVO
    // const saveVideo = await MediaLibrary.createAssetAsync(videoUri);
    // const asset = await MediaLibrary.getAssetInfoAsync(saveVideo);
    // const filenameVideo = asset.filename;
    // console.log('filenameVideo', filenameVideo);
    // console.log('videoUri', asset);
    const filename = videoUri.split('/').pop();
    // const extension = filename.split('.').pop();

    const match = /\.(\w+)$/.exec(filename);
    const typeImage = match ? `image/${match[1]}` : `image`;
    const typeVideo = match ? `video/${match[1]}` : `video`;

    const payload = {
      uri: videoUri,
      name: filename,
      type: typeVideo,
    };
    await sendDocumentPhoto(
      setCameraLoading,
      payload,
      userDriverFind,
      location?.coords?.latitude,
      location?.coords?.longitude,
    );
    // await takeVideo();
  };

  useEffect(() => {
    if (countTakeVolume === (Platform.OS === 'ios' ? 3 : 2)) {
      if (callDriverModal) {
        return;
      }
      setCameraReady(true);
      setTypeCamera(CameraObject.Constants.Type.front);
      Helper.timeout(1000).then(() => {
        takeVideo().then(uri => {
          takePictureAndSendApi(uri);
          setCameraReady(false);
        });
        setCountTakeVolume(0);
      });
    } else {
      Helper.timeout(1500).then(() => {
        setCountTakeVolume(0);
      });
    }
  }, [countTakeVolume]);

  useEffect(() => {
    if (countTakeVolume === 0) {
      setCameraReady(false);
      Torch && Torch.switchState(false);
    }
  }, [cameraReady]);

  return (
    <>
      {isFocused && cameraReady && (
        <Camera
          ref={(ref: any) => {
            cameraRef.current = ref;
          }}
          // @ts-ignore
          type={typeCamera}
          flashMode={flashCamera}
          style={{
            width: 1,
            height: 1,
          }}
          ratio="1:1"
        />
      )}
      <ButtonPanicContainer
        setVisibleCount={setCountVisible}
        setVisibleAlertProtect={setVisibleAlertProtect}
        visibleAlertProtect={visibleAlertProtect}
        handleCamera={() => {
          setCameraReady(true);
          setTypeCamera(CameraObject.Constants.Type.front);
          Helper.timeout(1000).then(() => {
            takeVideo().then(uri => {
              takePictureAndSendApi(uri);
              setCameraReady(false);
            });
          });
        }}
      />
    </>
  );
};
