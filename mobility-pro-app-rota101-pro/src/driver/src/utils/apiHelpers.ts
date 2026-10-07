import Constants from 'expo-constants';
import * as Battery from 'expo-battery';
import * as Location from 'expo-location';
import {Camera} from 'expo-camera';
import * as Notifications from 'expo-notifications';
import {Audio} from 'expo-av';
import {customToast} from '../../../utils/FlashMessage';
import {translate} from '../../../client/locales';
import apiMainDriver from '../api/apiMain';
import {useBubbleButton} from '@704apps/react-native-bubble-button';
import {useAuth} from '../../../context/auth';

interface StatusPermission {
  foreground: string;
  background: string;
  camera: string;
  audio: string;
  notifications: string;
}

const {checkPermission} = useBubbleButton();

const getPermissionsStatus = async (): Promise<StatusPermission> => {
  return {
    foreground: (await Location.getForegroundPermissionsAsync()).status,
    background: (await Location.getBackgroundPermissionsAsync()).status,
    camera: (await Camera.getCameraPermissionsAsync()).status,
    audio: (await Audio.getPermissionsAsync()).status,
    notifications: (await Notifications.getPermissionsAsync()).status,
  };
};

export const handleSendAppInfo = async (): Promise<void> => {
  const {userDriver} = useAuth();
  const statusPermission = await getPermissionsStatus();

  try {
    const batteryIsOptmization =
      await Battery.isBatteryOptimizationEnabledAsync();
    const isOverlay = await checkPermission();

    const payload = {
      driverId: Number(userDriver?.idDriver),
      version: Constants.manifest.version,
      permissionLocationBackground: statusPermission.background === 'granted',
      permissionGps: statusPermission.foreground === 'granted',
      permissionSystemOverlay: isOverlay,
      permissionIgnoreBatteryOptimization: batteryIsOptmization,
      name: userDriver?.nickname,
      userId: Number(userDriver?.idUser),
    };

    const url = 'DriverAppInfo/SendDriverAppInfo';
    console.log('URL:', url);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await apiMainDriver.post(url, payload);
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
    });

    const data = response.data;
    console.log('Response Data:', data);

    if (data.status) {
      customToast(data.message, 'success');
    } else {
      customToast(data.message, 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    customToast(translate('toast.text_send_data_error'), 'error');
  }
};
