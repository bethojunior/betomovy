import AsyncStorage from '@react-native-async-storage/async-storage';
import {Audio} from 'expo-av';
import Helper from '../../../client/utils/Helper';

export const mountSong = async (
  uri: any,
  uriRemote = false,
  songAlias = '',
): Promise<Audio.Sound> => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch (e) {
    console.warn('[mountSong] setAudioModeAsync:', e);
  }

  if (uriRemote && songAlias) {
    try {
      const songUri = await getSongAlias(songAlias);
      if (songUri != null) {
        const result = await Audio.Sound.createAsync({uri: songUri});
        if (result?.sound) return result.sound;
      }
    } catch (error) {
      console.warn('[mountSong] Remote falhou, usando fallback local:', error);
    }
  }

  if (songAlias === 'soundCallOnline' || songAlias === 'soundCallOffline') {
    return new Audio.Sound();
  }

  if (uri) {
    try {
      const result = await Audio.Sound.createAsync(uri);
      if (result?.sound) return result.sound;
    } catch (error) {
      console.error('[mountSong] Local também falhou:', error);
    }
  }

  // Fallback garantido para o áudio padrão de chamado de corrida
  try {
    const defaultUri = require('../assets/songs/assobio.mp3');
    const fallbackResult = await Audio.Sound.createAsync(defaultUri);
    if (fallbackResult?.sound) return fallbackResult.sound;
  } catch (fallbackError) {
    console.error('[mountSong] Fallback padrão assobio falhou:', fallbackError);
  }

  return new Audio.Sound();
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
