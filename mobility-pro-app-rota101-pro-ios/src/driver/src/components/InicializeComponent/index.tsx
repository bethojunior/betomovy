import {useEffect} from 'react';
import {useLocalization} from '../../../contexts/Localization';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {customToast} from '../../../../utils/FlashMessage';
import {useAuth} from '../../../../context/auth';
import {useTripProvider} from '../../context/Trip';

export const InicializeComponent = () => {

  const {dispatchTrip} = useTripProvider();
  const {getPermissionLocal} = useAuth();
  

  const verifyStorage = async () => {
    const switchStorage = await AsyncStorage.getItem('flashlight');

    if (switchStorage) {
      dispatchTrip({type: 'update', field: 'flashlight', arg: true});
      return;
    }

    return dispatchTrip({type: 'update', field: 'flashlight', arg: false});
  };

  const initComponent = async() => {
    await getPermissionLocal().then(() => {
      Location.requestBackgroundPermissionsAsync().then(async ({status}) => {
        const permissions = JSON.parse(
          await AsyncStorage.getItem('permissions'),
        );
        if (status !== 'granted') {
          return customToast(
            'error',
            'Você precisa permitir o acesso a localização em segundo plano para continuar.',
          );
        }
        permissions.locationBackground = true;
        await AsyncStorage.setItem('permissions', JSON.stringify(permissions));
      });
    });
  }

  useEffect(() => {
    initComponent()

    verifyStorage();
  }, []);

  return null;
};
