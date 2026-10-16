/* eslint-disable no-unused-expressions */
/* eslint-disable no-restricted-syntax */

import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import * as Speech from 'expo-speech';
import RenderHtml from 'react-native-render-html';
import { Dimensions, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTrip } from '../../contexts/Trip';
import {
  Message,
  MessageAudioContainer,
  MessageReceivedContainer,
  MessageSentContainer,
  MesssageContent,
  ShippingDateText,
  AudioTimeContainer,
  AudioTime,
  ButtonSend,
  ControlButtonAudio,
  DeliveryStatusText,
} from './styles';
import theme from '../../styles/theme';
import { translate } from '../../locales';
import { ContainerAudio } from '../../modules/GetLight/components/ModalChat/styles';
import { buildApp } from '../../../constantBuild/config';
import { useTripGL } from '../../contexts/TripGL';
import Helper from '../../utils/Helper';

let currentTrip;

export default function TripMessageView({
  message,
  preview = false,
  timeSendInSeconds,
  reiceved = false,
  isAudio,
  data,
  speakUnicMessage,
  trip,
  deliveryStatus = undefined,
  onRetry = undefined,
}) {
  const [audioTime, setAudioTime] = useState([0]);
  const [audioDuration, setAudioDuration] = useState();
  const [audio, setAudio] = useState();
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [intervalReference, setIntervalReference] = useState();
  const [disabled, setDisabled] = useState(false);

  const { tripSchedule } = useTripGL();

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (trip === undefined || Object.keys(trip).length === 0) {
      currentTrip = tripSchedule;
      return '';
    }

    currentTrip = trip;
  }, [data.viewed]);

  const handleLoadingSound = async () => {
    const source = {
      uri: `${buildApp().HOST_AUDIO_MESSAGE + currentTrip.tripReference
        }/${message}`,
    };
    const { sound } = await Audio.Sound.createAsync(source);

    return sound;
  };

  const pauseAudio = async () => {
    setDisabled(true);
    if (audio && intervalReference) {
      await audio.pauseAsync();
      setPaused(true);
      setPlaying(false);
      setDisabled(false);
      clearInterval(intervalReference);
    }
  };

  const playAudio = async () => {
    setDisabled(true);
    if (paused && audio) {
      setPlaying(true);
      await audio.playAsync();
      setDisabled(false);
      setPaused(false);
      if (intervalReference) clearInterval(intervalReference);
      setIntervalReference(
        setInterval(() => {
          setAudioTime(state => [state[0] + 1]);
        }, 1000),
      );
    } else {
      handleLoadingSound().then(async loadingSound => {
        setAudioTime([0]);
        setAudio(loadingSound);
        await loadingSound.playAsync();
        setDisabled(false);
        setPlaying(true);
        if (intervalReference) clearInterval(intervalReference);
        setIntervalReference(
          setInterval(() => {
            setAudioTime(state => [state[0] + 1]);
          }, 1000),
        );
      });
    }
  };

  const sliderValuesChangeStart = () => {
    if (playing) pauseAudio();
  };

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
    if (isAudio) {
      handleLoadingSound().then(loadingSound => {
        setAudio(loadingSound);
        loadingSound
          .getStatusAsync()
          .then(function (result) {
            setAudioDuration(Math.round(result.durationMillis / 1000));
          })
          .catch();
      });
    }
  }, []);

  useEffect(() => {
    if (audioTime && audioDuration && audioTime[0] === audioDuration) {
      clearInterval(intervalReference);
      setTimeout(() => {
        setPlaying(false);
      }, 100);
    }
  }, [audioTime, audioDuration]);

  const returnMessageWithSource = (message: string, color: string) => {
    const source = {
      html: `<p style='color:${color}; font-size: ${theme.fontSizes.medium
        }px; max-width:${'250px'};'>${message}</p>`,
    };
    return (
      <RenderHtml
        contentWidth={Dimensions.get('window').width}
        source={source}
      />
    );
  };

  const statusIcon =
    deliveryStatus === 'sending'
      ? 'time-outline'
      : deliveryStatus === 'error'
        ? 'alert-circle-outline'
        : null;

  const statusIconColor =
    deliveryStatus === 'error' ? theme.colors.red : theme.colors.primaryText;

  const statusText = data.viewed
    ? translate('trip.chat.status_read')
    : translate('trip.chat.status_sent');

  return reiceved ? (
    <MessageReceivedContainer>
      <MesssageContent messageReceived>
        <ContainerAudio>
          <ShippingDate messageReceived timeSendInSeconds={timeSendInSeconds} />
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
        ) : (
          <Message messageReceived>
            {returnMessageWithSource(message, theme.colors.black)}
          </Message>
        )}
      </MesssageContent>
    </MessageReceivedContainer>
  ) : (
    <MessageSentContainer preview={preview}>
      <MesssageContent>
        <ShippingDate timeSendInSeconds={timeSendInSeconds} />
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
                    color={theme.colors.primaryText}
                  />
                ) : (
                  <Ionicons
                    name="play"
                    size={24}
                    color={theme.colors.primaryText}
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
        ) : (
          <Message>
            {returnMessageWithSource(message, theme.colors.black)}
          </Message>
        )}
        <TouchableOpacity
          disabled={deliveryStatus !== 'error'}
          onPress={onRetry}
          style={{ marginLeft: 'auto' }}
        >
          {statusIcon ? (
            <Ionicons
              name={statusIcon}
              size={24}
              color={statusIconColor}
            />
          ) : (
            <DeliveryStatusText>{statusText}</DeliveryStatusText>
          )}
        </TouchableOpacity>
      </MesssageContent>
    </MessageSentContainer>
  );
}

function ShippingDate({ timeSendInSeconds, messageReceived }) {
  return (
    <ShippingDateText messageReceived={messageReceived}>
      {Helper.formatSecondsToDate(timeSendInSeconds)}
    </ShippingDateText>
  );
}
