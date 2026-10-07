import AsyncStorage from '@react-native-async-storage/async-storage';
import {buildApp} from '../constantBuild/config';

const getStorageUrl = async (): Promise<string | null> => {
  try {
    const generalSettingsString = await AsyncStorage.getItem('generalSettings');
    const generalSettings = JSON.parse(generalSettingsString) || [];

    const linkStoragePicturesSetting = generalSettings.find(
      (setting) => setting.key === 'link_storage_pictures',
    );

    if (!linkStoragePicturesSetting) {
      return null;
    }

    const linkStoragePictures = linkStoragePicturesSetting?.value || 0;

    return typeof linkStoragePictures === 'string' ? linkStoragePictures : null;
  } catch (error) {
    console.error('Error getting storage URL:', error);
    return null;
  }
};

export const getDefaultLogo = async () => {
  const linkStorage = (await getStorageUrl()) + 'default.jpg';
  return linkStorage || buildApp().HOST_IMAGE_LOGO;
};
