import { mountSong as mountSongGeneral } from '../utils/mountSong';

type SongType = 'message' | 'cancel' | 'whistle';

export const useSong = () => {
  const playSong = async (music: SongType = 'message', looping = false) => {
    try {
      const sound = await mountSong(songs[music]);
      await sound?.playAsync();
      looping && (await sound?.setIsLoopingAsync(true));
      return sound;
    } catch (error) {
      console.log(error);
    }
  };

  const stopSong = async (music: SongType = 'message', sound = null) => {
    try {
      let soungStop = sound;
      if (!sound) soungStop = await mountSong(songs[music]);
      await soungStop?.stopAsync();
    } catch (error) {
      console.log(error);
    }
  };

  const mountSong = async (uri: any, uriRemote = false, alias = '') => {
    return await mountSongGeneral(uri, uriRemote, alias);
  };

  return { playSong, stopSong, mountSong };
};

const songs = {
  message: require('../../../client/assets/songs/alertNewMessageChat.mp3'),
  cancel: require('../../../client/assets/songs/alertClientCancelTrip.mp3'),
  whistle: require('../../../client/assets/songs/assobio.mp3'),
};
