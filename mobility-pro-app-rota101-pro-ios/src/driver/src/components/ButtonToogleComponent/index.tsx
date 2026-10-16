import { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { ButtonV2 } from '../ButtonOnAndOff';
import { useUserDriver } from '../../context/userDriver';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { useEnsureOverlayPermission } from '../../pages/OverlayPermission/useEnsureOverlayPermission';
import { useNetwork } from '../../../../context/ConfigGlobal';
import { useAuth } from '../../../../context/auth';
import { bubble } from '../../pages/Home/service';
import theme from '../../styles/theme';
import Helper from '../../utils/Helper';
import { useLocalProvider } from '../../context/local';
import { useDriverHours } from '../../hooks/useDriverHours';
import { RFValue } from 'react-native-responsive-fontsize';
import { translate } from '../../../../client/locales';
import { If } from '../If';

export const ButtonToogleComponent = () => {
  const [initLocationX, setInitLocationX] = useState(0);
  const { itsNetwork } = useNetwork();
  const { cityConfig, generalSettings } = useAuth();
  const { userDriverFind, toogleDriverStatus } = useUserDriver();
  const { hideBubble } = useBubbleButton();
  const { ensureOverlayPermission } = useEnsureOverlayPermission();
  const { location } = useLocalProvider();
  const { canDriverGoOnline, refreshHours, checkHorasLimitesRealtime } = useDriverHours();

  const setOn = async () => {
    const podeFicarOnline = await checkHorasLimitesRealtime();

    if (!podeFicarOnline) {
      return;
    }

    await ensureOverlayPermission(async () => {
      if (!itsNetwork) {
        return;
      }

      const status = await toogleDriverStatus('disponivel', location?.coords);
      if (!status) {
        await hideBubble();
      } else {
        await bubble(
          userDriverFind?.idDriver,
          theme,
          cityConfig?.showNetValueForDriverOnCall,
          Helper.generalSettingsValue(generalSettings, 'show_more_calcs_driver'),
          Helper.generalSettingsActive(generalSettings, 'enable_realtime_socket'),
          cityConfig,
        );
      }
    });
  };

  const setOff = async () => {
    await toogleDriverStatus('desligado', {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (Platform.OS === "android") {
      await hideBubble();
    }
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
