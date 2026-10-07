import {translate} from '../../../../client/locales';
import {customToast} from '../../../../utils/FlashMessage';
import {useUserDriver} from '../../context/userDriver';
import {BatteryState} from 'expo-battery';
import {useLocal} from '../../hooks/location';
import {useEffect} from 'react';
import {useBattery} from '../../hooks/battery';
import {useTripProvider} from '../../context/Trip';

export const CheckBatteryComponent = () => {
  const {userDriverFind, toogleDriverStatus} = useUserDriver();
  const {location} = useLocal();
  const {battery, levelBatteryMin} = useBattery();
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );

  const checkIsBatteryLow = async (levelBattery: number, state: number) => {
    if (
      levelBattery < levelBatteryMin &&
      userDriverFind.status === 'disponivel' &&
      state !== BatteryState.CHARGING &&
      !tripAccepted?.status
    ) {
      userDriverFind.status = 'desligado';
      customToast(translate('home.message_low_battery'), 'warning');
      await toogleDriverStatus('desligado', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  };

  useEffect(() => {
    if (battery.level !== null) {
      checkIsBatteryLow(battery.level, battery.state);
    }
  }, [battery]);

  return null;
};
