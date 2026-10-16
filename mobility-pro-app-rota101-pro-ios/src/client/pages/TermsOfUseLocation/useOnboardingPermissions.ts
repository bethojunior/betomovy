import { Camera } from 'expo-camera';
import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import { useAuth } from '../../../context/auth';
import { useLocal } from '../../contexts/local';
import { ListContactsServices } from '~/driver/src/service/list_contacts';
import { IRequestContactsProps } from '~/driver/src/service/list_contacts/types';

async function saveDeviceContacts() {
  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
  });

  if (!data?.length) return;

  const listPhonesPerson = data.filter(
    (contact) => contact.contactType === Contacts.ContactTypes.Person,
  );

  const listPhones: IRequestContactsProps[] = listPhonesPerson.map((contact) => ({
    id_person: contact?.id ?? '',
    name_person: contact?.firstName ?? '',
    phone_person: contact?.phoneNumbers?.[0]?.number,
  }));

  const listPhonesFormatted = listPhones.filter(
    (contact) => contact?.phone_person?.length > 0,
  );

  if (listPhonesFormatted.length > 0) {
    await ListContactsServices.saveContactsDevice(listPhonesFormatted);
  }
}

export function useOnboardingPermissions() {
  const { getPermissionLocal } = useAuth();
  const { setPosition } = useLocal();

  const requestLocationPermission = async () => {
    try {
      await getPermissionLocal();

      const location = await Location.getLastKnownPositionAsync();
      const coords =
        location?.coords ??
        (await Location.getCurrentPositionAsync({ accuracy: 1 })).coords;
      setPosition({ latitude: coords.latitude, longitude: coords.longitude });
    } catch (error) {
      console.log(error);
    }
  };

  const requestContactsPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        await saveDeviceContacts();
      }
      return status;
    } catch (error) {
      console.log(error);
      return 'denied';
    }
  };

  const requestCameraPermission = async () => {
    try {
      await Camera.requestCameraPermissionsAsync();
    } catch (error) {
      console.log(error);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      await Camera.requestMicrophonePermissionsAsync();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    requestLocationPermission,
    requestContactsPermission,
    requestCameraPermission,
    requestMicrophonePermission,
  };
}
