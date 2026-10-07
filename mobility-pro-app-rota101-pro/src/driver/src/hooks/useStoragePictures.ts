import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../../context/auth';
import {useConfigAppPartner} from '../../../context/ConfigAppPartner/useConfigAppPartner';
import {buildApp} from '../../../constantBuild/config';

export const useStoragePictures = () => {
  const {appPartnerSelected} = useConfigAppPartner();
  const {APP_PARTNER} = buildApp();
  const {generalSettings} = useAuth();
  const getStorage = () => {
    const settings = generalSettings || [];
    const url = `${
      settings?.find(setting => setting?.key === 'link_storage_pictures')
        ?.value || 0
    }`;
    return url;
  };

  const getStoragePictureSpecific = (
    key: 'driver' | 'customer' | 'temp' | 'tripType' | 'logo',
  ) => {
    if (key === 'logo' && APP_PARTNER && appPartnerSelected?.logo) {
      return appPartnerSelected.logo;
    }

    const driver = 'driver/profile/compressed/';
    const customer = 'customer/profile/compressed/';
    const temp = 'driver/profile/temp/';
    const tripType = 'tripType/';
    const logo = 'default.jpg';

    const typesStorage = {
      driver,
      customer,
      temp,
      tripType,
      logo,
    };

    const storageUrl = getStorage();
    const url = storageUrl !== '0' ? `${storageUrl}${typesStorage[key]}` : null;
    return url;
  };

  return {
    getStorage,
    getStoragePictureSpecific,
  };
};
