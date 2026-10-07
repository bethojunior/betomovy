import {View, Text, DeviceEventEmitter, Platform} from 'react-native';
import {translate} from '../../../../client/locales';
import {BluetoothScanner} from '../../components/BluetoothScanner';
import {ButtonSend, Container, ContainerCamera} from './style';
import {CameraComponent, RefCamera} from '../../components/Camera';
import {useEffect, useRef, useState} from 'react';
import {TextEdit} from '../../components/TextEdit';
import theme from '../../styles/theme';
import {IfLoaderInsideScreen} from '../../components/IfLoaderInsideScreen';
import Preload from '../../components/Preload';
import {customToast} from '../../../../utils/FlashMessage';
// import {VolumeManager} from 'react-native-volume-manager';

export const ButtonTestPanic = () => {
  const cameraRef = useRef<RefCamera>(null);
  const [loading, setLoading] = useState(false);

  const handleCamTakeVideo = async () => {
    try {
      if (cameraRef.current) {
        setLoading(true);
        const videoUri = await cameraRef.current.sendVideoPanic();
        setLoading(false);
        customToast(translate('panicButton.text_alert_sent_success'), 'success');
        return videoUri;
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const trackRefClick = useRef(0);

  // useEffect(() => {
  //   if (Platform.OS === 'ios') return;

  //   let volumeWasMax = false;
  //   let resetTimeout;

  //   const volumeEmitter = DeviceEventEmitter.addListener(
  //     'onVolumeButtonPressed',
  //     async result => {
  //       const volumeUp = result?.type === 'VOLUME_UP_PRESSED';
  //       const volumeActual = await VolumeManager.getVolume();
  //       if (Number(volumeActual?.volume) === 1 && volumeUp) {
  //         volumeWasMax = true;

  //         if (trackRefClick.current === 0) {
  //           trackRefClick.current = 1;
  //           resetTimeout = setTimeout(() => {
  //             trackRefClick.current = 0;
  //           }, 1000);
  //         } else {
  //           customToast('Seu botão de panico foi acionado', 'success');
  //           trackRefClick.current = 0;
  //           await handleCamTakeVideo();
  //         }
  //       }
  //     },
  //   );

  //   return () => {
  //     if (resetTimeout) clearTimeout(resetTimeout);
  //     if (volumeEmitter) volumeEmitter?.remove();
  //   };
  // }, []);

  return (
    <Container>
      <BluetoothScanner />
      <ContainerCamera>
        <CameraComponent width="100%" height="70%" ref={cameraRef} />
        <ButtonSend onPress={handleCamTakeVideo}>
          <IfLoaderInsideScreen
            loading={loading}
            color={theme.colors.primaryText}
          >
            <TextEdit color={theme.colors.primaryText}>
              Enviar para plataforma
            </TextEdit>
          </IfLoaderInsideScreen>
        </ButtonSend>
      </ContainerCamera>
    </Container>
  );
};
