import {Audio} from 'expo-av';

export const mountSong = async (uri: any) => {
  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
  const {sound} = await Audio.Sound.createAsync(uri);
  return sound;
};
