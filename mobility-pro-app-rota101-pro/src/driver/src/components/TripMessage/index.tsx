// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import * as Speech from 'expo-speech';

import RenderHtml from 'react-native-render-html';
import { Platform, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  MessageContentFooter,
  MessageAudioContainer,
  MessageReceivedContainer,
  MessageSentContainer,
  MesssageContent,
  ShippingDateText,
  AudioTimeContainer,
  AudioTime,
  ControlButtonAudio,
  ContainerAudio,
  DeliveryStatusText,
  HeaderSentContainer,
} from './styles';
import theme from '../../styles/theme';
import { ButtonSend, ButtonSendStar } from '../ButtonIcon/styles';
import { useTripProvider } from '../../context/Trip';
import { buildApp } from '../../../../constantBuild/config';
import Helper from '../../utils/Helper';
import { useStoragePictures } from '../../hooks/useStoragePictures';
import { translate } from '../../../../client/locales';

const colorTextReceive = theme.colors.black;
const colorTextSend = theme.colors.black;

export default function TripMessage({
  message,
  preview = false,
  timeSendInSeconds,
  reiceved = false,
  isAudio,
  data,
  speakUnicMessage,
  onFavoriteMessage = async (_message) => { },
  tripReference,
  deliveryStatus = undefined,
  onRetry = undefined,
}) {
  const [audioTime, setAudioTime] = useState([0]);
  const [audioDuration, setAudioDuration] = useState();
  const [audio, setAudio] = useState();
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [intervalReference, setIntervalReference] = useState();
  const { getStorage } = useStoragePictures();
  const { width } = useWindowDimensions();

  const handleLoadingSound = async () => {
    const url = `${getStorage()}chat/trip/`;
    const source = {
      uri: `${(url || buildApp().HOST_AUDIO_MESSAGE) + tripReference}/${message || ''
        }`,
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
        // eslint-disable-next-line no-restricted-syntax
        loadingSound.getStatusAsync().then(function (result) {
          setAudioDuration(Math.round(result.durationMillis / 1000));
        });
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
          {!isAudio && !data?.message?.includes('<b>') && (
            <ButtonSend
              onPress={() => {
                if (!data?.isAudio) {
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
                size={15}
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
                  // eslint-disable-next-line no-unused-expressions
                  playing ? pauseAudio() : playAudio();
                }}
              >
                {playing ? (
                  <Ionicons
                    name="pause"
                    size={RFValue(20)}
                    color={theme.colors.primary}
                  />
                ) : (
                  <Ionicons
                    name="play"
                    size={RFValue(20)}
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
                  // eslint-disable-next-line no-unused-expressions
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
        <MessageContentFooter>
          <ShippingDate timeSendInSeconds={timeSendInSeconds} messageReceived={false} />
          <TouchableOpacity disabled={deliveryStatus !== 'error'} onPress={onRetry}>
            {statusIcon ? (
              <Ionicons
                name={statusIcon}
                size={RFValue(14)}
                color={statusIconColor}
                style={{ alignSelf: "flex-end" }}
              />
            ) : (
              <DeliveryStatusText>{statusText}</DeliveryStatusText>
            )}
          </TouchableOpacity>
        </MessageContentFooter>
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
