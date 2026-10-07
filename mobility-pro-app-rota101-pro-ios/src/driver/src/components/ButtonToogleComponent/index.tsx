import {useState} from 'react';
import {ButtonV2} from '../ButtonOnAndOff';
import {useUserDriver} from '../../context/userDriver';
import {useBubbleButton} from '@704apps/react-native-bubble-button';
import {useNetwork} from '../../../../context/ConfigGlobal';
import {useAuth} from '../../../../context/auth';
import {bubble} from '../../pages/Home/service';
import theme from '../../styles/theme';
import Helper from '../../utils/Helper';
import {useLocalProvider} from '../../context/local';

export const ButtonToogleComponent = () => {
  const [initLocationX, setInitLocationX] = useState(0);
  const {itsNetwork} = useNetwork();
  const {cityConfig, generalSettings} = useAuth();
  const {userDriverFind, toogleDriverStatus} = useUserDriver();
  const {checkPermission, requestPermission, hideBubble} = useBubbleButton();
  const {location} = useLocalProvider();

  const requestPermissionAndShowBubble = async () => {
    const perms = await checkPermission();
    if (!perms) {
      await requestPermission();
    }
  };

  const setOn = async () => {
    userDriverFind.status = 'disponivel';
    await requestPermissionAndShowBubble();
    if (!itsNetwork) {
      return;
    }
    await toogleDriverStatus('disponivel', location?.coords);
    await bubble(
      userDriverFind?.idDriver,
      theme,
      cityConfig?.showNetValueForDriverOnCall,
      Helper.generalSettingsValue(generalSettings, 'show_more_calcs_driver'),
      Helper.generalSettingsActive(generalSettings, 'enable_realtime_socket'),
    );
  };

  const setOff = async () => {
    userDriverFind.status = 'desligado';
    hideBubble();
    await toogleDriverStatus('desligado', {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  return (
    <ButtonV2
      initLocationX={initLocationX}
      setInitLocationX={setInitLocationX}
      setOff={setOff}
      setOn={setOn}
    />
  );
};
