// @ts-nocheck
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import * as Speech from 'expo-speech';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTrip } from '../../contexts/Trip';
import {
  MessageAudioContainer,
  MessageReceivedContainer,
  MessageSentContainer,
  MesssageContent,
  ShippingDateText,
  AudioTimeContainer,
  AudioTime,
  ButtonSend,
  ButtonSendStar,
  ControlButtonAudio,
  DeliveryStatusText,
  HeaderSentContainer,
} from './styles';
import theme from '../../styles/theme';
import { translate } from '../../locales';
import { ContainerAudio } from '../../modules/GetLight/components/ModalChat/styles';
import { buildApp } from '../../../constantBuild/config';
import { useTripGL } from '../../contexts/TripGL';
import Helper from '../../utils/Helper';
import { useStoragePictures } from '../../../driver/src/hooks/useStoragePictures';

const colorTextReceive = theme.colors.black;
const colorTextSend = theme.colors.black;

export default function TripMessage({
  message,
  preview,
  timeSendInSeconds,
  reiceved,
  isAudio,
  data,
  speakUnicMessage,
  onFavoriteMessage = async (_message) => { },
}) {
  const [audioTime, setAudioTime] = useState([0]);
  const [audioDuration, setAudioDuration] = useState();
  const [audio, setAudio] = useState();
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [intervalReference, setIntervalReference] = useState();
  const [disabled, setDisabled] = useState(false);

  const { stateTripCustomer } = useTrip();
  const { trip } = stateTripCustomer;
  const { tripSchedule } = useTripGL();
  const statusText = data.viewed
    ? translate('trip.chat.status_read')
    : translate('trip.chat.status_sent');

  const { getStorage } = useStoragePictures();
  const { width } = useWindowDimensions();

  useEffect(() => {
    return () => {
      if (audio) {
        audio.unloadAsync();
      }

      if (intervalReference) {
        clearInterval(intervalReference);
      }
    };
  }, [audio]);

  const currentTrip =
    trip && Object.keys(trip).length > 0
      ? trip
      : tripSchedule;


  const handleLoadingSound = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });

    const url = `${getStorage()}chat/trip/`;
    const source = {
      uri: `${(url || buildApp().HOST_AUDIO_MESSAGE) + currentTrip.tripReference}/${message}`,
    };

    const { sound } = await Audio.Sound.createAsync(source);

    await sound.setVolumeAsync(1.0);

    return sound;
  };


  const pauseAudio = async () => {
    if (!audio) return;

    try {
      setDisabled(true);

      await audio.pauseAsync();

      setPaused(true);
      setPlaying(false);

      if (intervalReference) clearInterval(intervalReference);

      setDisabled(false);
    } catch (error) {
      console.log('Erro ao pausar áudio:', error);
      setDisabled(false);
    }
  };


  const playAudio = async () => {
    try {
      setDisabled(true);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      let sound = audio;


      if (!sound) {
        sound = await handleLoadingSound();
        setAudio(sound);

        const status = await sound.getStatusAsync();
        if (status.isLoaded && status.durationMillis) {
          setAudioDuration(Math.round(status.durationMillis / 1000));
        }
      }

      const status = await sound.getStatusAsync();


      if (!status.isLoaded) {
        console.log('Áudio não carregado');
        setDisabled(false);
        return;
      }

      await sound.playAsync();

      setPlaying(true);
      setPaused(false);
      setDisabled(false);

      if (intervalReference) clearInterval(intervalReference);

      sound.setOnPlaybackStatusUpdate(status => {
        if (!status.isLoaded) return;

        setAudioTime([Math.floor(status.positionMillis / 1000)]);

        if (status.didJustFinish) {
          setPlaying(false);
          setPaused(false);
          setAudioTime([0]);
        }
      });

    } catch (error) {
      console.log('Erro ao tocar áudio:', error);
      setDisabled(false);
    }
  };

  const sliderValuesChangeStart = () => {
    if (playing) pauseAudio();
  };

  const sliderValuesChange = values => {
    setAudioTime(values);
  };
  const sliderValuesChangeFinish = async values => {
    if (!audio) return;

    try {
      const status = await audio.getStatusAsync();
      if (!status.isLoaded) return;

      await audio.setPositionAsync(values[0] * 1000);
      await audio.playAsync();

      setPlaying(true);
      setPaused(false);
    } catch (error) {
      console.log('Erro ao mover áudio:', error);
    }
  };


  useEffect(() => {
    if (audioTime && audioDuration && audioTime[0] === audioDuration) {
      clearInterval(intervalReference);
      setTimeout(() => {
        setPlaying(false);
      }, 100);
    }
  }, [audioTime, audioDuration]);

  const returnMessageWithSource = (message: string, color: string) => {
    return (
      <RenderHtml
        contentWidth={width}
        source={{ html: `<p>${message}</p>` }}
        tagsStyles={{
          p: { color, fontSize: RFValue(11), fontWeight: 'medium', lineHeight: RFValue(14) },
        }}
      />
    );
  };

  return reiceved ? (
    <MessageReceivedContainer>
      <MesssageContent messageReceived>
        <ContainerAudio>
          {!isAudio && !data?.message?.includes('<b>') && (
            <ButtonSend
              onPress={() => {
                if (!data.isAudio) {
                  Speech.isSpeakingAsync().then(async isSpeaking => {
                    if (isSpeaking) {
                      await Speech.stop();
                    } else {
                      speakUnicMessage(data.message, data, true);
                    }
                  });
                }
              }}
            >
              <Ionicons
                name="volume-high"
                size={RFValue(15)}
                color={theme.colors.primaryText}
              />
            </ButtonSend>
          )}
        </ContainerAudio>

        {isAudio ? (
          <>
            <MessageAudioContainer>
              <ControlButtonAudio
                disabled={disabled}
                onPress={() => {
                  playing ? pauseAudio() : playAudio();
                }}
              >
                {playing ? (
                  <Ionicons
                    name="pause"
                    size={24}
                    color={theme.colors.primary}
                  />
                ) : (
                  <Ionicons
                    name="play"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </ControlButtonAudio>
              <MultiSlider
                sliderLength={160}
                containerStyle={{ height: 12 }}
                values={audioTime}
                selectedStyle={{ backgroundColor: theme.colors.primary }}
                markerStyle={{ backgroundColor: theme.colors.primary }}
                onValuesChangeStart={sliderValuesChangeStart}
                onValuesChange={sliderValuesChange}
                onValuesChangeFinish={sliderValuesChangeFinish}
                max={audioDuration}
              />
            </MessageAudioContainer>
            <AudioTimeContainer>
              <AudioTime messageReceived>
                {audioTime[0] >= 10
                  ? `0:${audioTime[0]}`
                  : `0:0${audioTime[0]}`}
              </AudioTime>

              <AudioTime messageReceived>
                {audioDuration
                  ? audioDuration >= 10
                    ? `0:${audioDuration}`
                    : `0:0${audioDuration}`
                  : '0:00'}
              </AudioTime>
            </AudioTimeContainer>
          </>
        ) : returnMessageWithSource(message, colorTextReceive)}
        <ShippingDate messageReceived timeSendInSeconds={timeSendInSeconds} />
      </MesssageContent>
    </MessageReceivedContainer>
  ) : (
    <MessageSentContainer preview={preview}>
      <MesssageContent>
        {!isAudio && (
          <HeaderSentContainer>
            <ButtonSendStar
              accessibilityLabel={translate('trip.chat.favorite_message_a11y')}
              onPress={() => onFavoriteMessage(message)}
            >
              <MaterialCommunityIcons
                name="message-star-outline"
                size={20}
                color={colorTextSend}
              />
            </ButtonSendStar>
          </HeaderSentContainer>
        )}
        {isAudio ? (
          <>
            <MessageAudioContainer>
              <ControlButtonAudio
                disabled={disabled}
                onPress={() => {
                  playing ? pauseAudio() : playAudio();
                }}
              >
                {playing ? (
                  <Ionicons
                    name="pause"
                    size={24}
                    color={colorTextSend}
                  />
                ) : (
                  <Ionicons
                    name="play"
                    size={24}
                    color={colorTextSend}
                  />
                )}
              </ControlButtonAudio>
              <MultiSlider
                sliderLength={160}
                containerStyle={{ height: 24 }}
                values={audioTime}
                selectedStyle={{ backgroundColor: theme.colors.primaryText }}
                markerStyle={{ backgroundColor: theme.colors.primaryText }}
                onValuesChangeStart={sliderValuesChangeStart}
                onValuesChange={sliderValuesChange}
                onValuesChangeFinish={sliderValuesChangeFinish}
                max={audioDuration}
              />
            </MessageAudioContainer>
            <AudioTimeContainer>
              <AudioTime>
                {audioTime[0] >= 10
                  ? `0:${audioTime[0]}`
                  : `0:0${audioTime[0]}`}
              </AudioTime>

              <AudioTime>
                {audioDuration
                  ? audioDuration >= 10
                    ? `0:${audioDuration}`
                    : `0:0${audioDuration}`
                  : '0:00'}
              </AudioTime>
            </AudioTimeContainer>
          </>
        ) : returnMessageWithSource(message, colorTextSend)}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <ShippingDate timeSendInSeconds={timeSendInSeconds} messageReceived={false} />
          <DeliveryStatusText>{statusText}</DeliveryStatusText>
        </View>
      </MesssageContent >
    </MessageSentContainer >
  );
}

function ShippingDate({ timeSendInSeconds, messageReceived }) {
  return (
    <ShippingDateText messageReceived={messageReceived}>
      {Helper.formatSecondsToDate(timeSendInSeconds)}
    </ShippingDateText>
  );
}
