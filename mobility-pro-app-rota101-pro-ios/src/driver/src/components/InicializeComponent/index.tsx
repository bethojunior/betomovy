import {useEffect} from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {customToast} from '../../../../utils/FlashMessage';
import {translate} from '../../../../client/locales';
import {useAuth} from '../../../../context/auth';
import {useTripProvider} from '../../context/Trip';

export const InicializeComponent = () => {
  const dispatchTrip: any = useTripProvider(
    (context: any) => context.dispatchTrip,
  );
  const {getPermissionLocal} = useAuth();

  const verifyStorage = async () => {
    const switchStorage = await AsyncStorage.getItem('flashlight');

    if (switchStorage) {
      dispatchTrip({type: 'update', field: 'flashlight', arg: true});
      return;
    }

    return dispatchTrip({type: 'update', field: 'flashlight', arg: false});
  };

  const initComponent = async () => {
    try {
      await getPermissionLocal();
      const {status} = await Location.requestBackgroundPermissionsAsync();
      if (status !== 'granted') {
        customToast(
          translate('toast.text_background_location_required'),
          'warning',
        );
      }
    } catch {}
  };

  useEffect(() => {
    initComponent();
    verifyStorage();
  }, []);

  return null;
};
