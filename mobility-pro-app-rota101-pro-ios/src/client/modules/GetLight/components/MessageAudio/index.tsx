// @ts-nocheck

import {useEffect, useState} from 'react';
import {Audio} from 'expo-av';
import {Ionicons} from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {Platform, Text} from 'react-native';

import {RFValue} from 'react-native-responsive-fontsize';
import {
  MessageAudioContainer,
  AudioTimeContainer,
  AudioTime,
  ControlButtonAudio,
} from './styles';
import theme from '../../../../styles/theme';
import {useTripGL} from '../../../../contexts/TripGL';
import {buildApp} from '../../../../../constantBuild/config';
import {useStoragePictures} from '../../../../../driver/src/hooks/useStoragePictures';

export const MessageAudio = ({isAudio, message, messageData}: any) => {
  const [audioTime, setAudioTime] = useState([0]);
  const [audioDuration, setAudioDuration] = useState();
  const [audio, setAudio] = useState<any>();
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [intervalReference, setIntervalReference] = useState();
  const {tripSchedule} = useTripGL();
  const {getStorage} = useStoragePictures();

  const handleLoadingSound = async () => {
    const url = `${getStorage()}chat/trip/`;
    const source = {
      uri: `${
        (url || buildApp().HOST_AUDIO_MESSAGE) + tripSchedule.tripReference
      }/${message || ''}`,
    };
    if (Platform === 'ios') {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const {sound} = await Audio.Sound.createAsync(
        {uri: source.uri},
        {
          volume: 1.0,
          rate: 1.0,
        },
      );
      return sound;
    }
    const {sound} = await Audio.Sound.createAsync(source);
    return sound;
  };

  useEffect(() => {
    if (isAudio) {
      handleLoadingSound().then(loadingSound => {
        setAudio(loadingSound);
        loadingSound
          .getStatusAsync()
          // eslint-disable-next-line no-restricted-syntax
          .then(function (result) {
            setAudioDuration(Math.round(result.durationMillis / 1000));
          })
          .catch(console.log);
      });
    }
  }, []);

  const pauseAudio = async () => {
    if (audio && intervalReference) {
      await audio.stopAsync();
      setPaused(true);
      setPlaying(false);
      clearInterval(intervalReference);
    }
  };

  const playAudio = async () => {
    if (paused && audio) {
      setPlaying(true);
      await audio.playAsync();
      setPaused(false);
      if (intervalReference) clearInterval(intervalReference);
    } else {
      await handleLoadingSound().then(async loadingSound => {
        setAudioTime([0]);
        setAudio(loadingSound);
        await loadingSound.playAsync();
        setPlaying(true);
      });
    }
  };

  const sliderValuesChangeStart = () => {
    if (playing) pauseAudio();
  };
  const shippingDate = new Date();
  const sliderValuesChange = values => {
    setAudioTime(values);
  };

  const sliderValuesChangeFinish = async values => {
    if (audio) {
      await audio.setStatusAsync({
        shouldPlay: false,
        positionMillis: values[0] * 1000,
      });
      if (paused) {
        playAudio();
      } else {
        setPaused(true);
      }
    }
  };

  useEffect(() => {
    if (audio) {
      audio.setOnPlaybackStatusUpdate(async playbackStatus => {
        if (playbackStatus.didJustFinish) {
          setPlaying(false);
          setPaused(false);
          setAudioTime([0]);
          clearInterval(intervalReference);
        } else {
          setAudioDuration(Math.round(playbackStatus.durationMillis / 1000));
        }
      });
    }
  }, [audio]);

  return (
    <>
      <MessageAudioContainer>
        <ControlButtonAudio onPress={playing ? pauseAudio : playAudio}>
          {playing ? (
            <Ionicons
              name="pause"
              size={RFValue(24)}
              color={theme.colors.primary}
            />
          ) : (
            <Ionicons
              name="play"
              size={RFValue(24)}
              color={theme.colors.primary}
            />
          )}
        </ControlButtonAudio>
        <AudioTime>
          {audioDuration
            ? audioDuration >= 10
              ? `0:${audioDuration}`
              : `0:0${audioDuration}`
            : '0:00'}
        </AudioTime>
      </MessageAudioContainer>
      <AudioTimeContainer />
    </>
  );
};
