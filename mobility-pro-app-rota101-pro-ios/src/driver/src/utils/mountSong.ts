import AsyncStorage from '@react-native-async-storage/async-storage';
import {Audio} from 'expo-av';
import Helper from '../../../client/utils/Helper';

export const mountSong = async (
  uri: any,
  uriRemote = false,
  songAlias = '',
): Promise<Audio.Sound> => {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });

  let sound: Audio.Sound | null = null;

  if (uriRemote && songAlias) {
    try {
      const songUri = await getSongAlias(songAlias);
      if (songUri != null) {
        const result = await Audio.Sound.createAsync({uri: songUri});
        return result.sound;
      }
    } catch (error) {
      console.warn('[mountSong] Remote falhou, usando fallback local');
    }
  }

  if (songAlias === 'soundCallOnline' || songAlias === 'soundCallOffline') {
    return new Audio.Sound();
  }

  try {
    const result = await Audio.Sound.createAsync(uri);
    return result.sound;
  } catch (error) {
    console.error('[mountSong] Local também falhou:', error);
  }

  sound = new Audio.Sound();
  return sound;
};

const getSongAlias = async (alias: string): Promise<string | null> => {
  try {
    if (!alias) return null;

    const generalConfig = await AsyncStorage.getItem('generalSettings');
    if (!generalConfig) return null;

    const generalSettings = JSON.parse(generalConfig) || [];
    const songAlias = generalSettings?.find(item => item?.key === alias)?.value;

    if (!songAlias) return null;

    if (!Helper.validateUrl(songAlias)) return null;

    return songAlias;
  } catch (error) {
    console.warn('[getSongAlias] erro:', error);
    return null;
  }
};
