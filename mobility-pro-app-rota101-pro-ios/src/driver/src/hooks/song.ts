import {useState} from 'react';
import {Audio} from 'expo-av';

export const useSong = () => {
  const playSong = async (music = 'message', looping = false) => {
    try {
      const sound = await mountSong(songs[music]);
      await sound?.playAsync();
      looping && (await sound?.setIsLoopingAsync(true));
      return sound;
    } catch (error) {
      console.log(error);
    }
  };

  const stopSong = async (music = 'message', sound = null) => {
    try {
      let soungStop = sound;
      if (!sound) soungStop = await mountSong(songs[music]);
      await soungStop?.stopAsync();
    } catch (error) {
      console.log(error);
    }
  };

  return {playSong, stopSong};
};

const songs = {
  message: require('../../../client/assets/songs/alertNewMessageChat.mp3'),
  cancel: require('../../../client/assets/songs/alertClientCancelTrip.mp3'),
  whistle: require('../../../client/assets/songs/assobio.mp3'),
};

const mountSong = async (uri: any) => {
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
