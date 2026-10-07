// @ts-nocheck
import React, {useEffect, useState} from 'react';
import {Audio} from 'expo-av';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import * as Speech from 'expo-speech';

import RenderHtml from 'react-native-render-html';
import {Dimensions, Platform, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  Message,
  MessageAudioContainer,
  MessageReceivedContainer,
  MessageSentContainer,
  MesssageContent,
  ShippingDateText,
  AudioTimeContainer,
  AudioTime,
  ControlButtonAudio,
  ContainerAudio,
  HeaderSentContainer,
} from './styles';
import theme from '../../styles/theme';
import {ButtonSend, ButtonSendStar} from '../ButtonIcon/styles';
import {useTripProvider} from '../../context/Trip';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';
import {buildApp} from '../../../../constantBuild/config';
import Helper from '../../utils/Helper';

export default function TripMessage({
  message,
  preview,
  timeSendInSeconds,
  reiceved,
  isAudio,
  data,
  speakUnicMessage,
  setMonitoring,
  tripReference,
}) {
  const [audioTime, setAudioTime] = useState([0]);
  const [audioDuration, setAudioDuration] = useState();
  const [audio, setAudio] = useState();
  const [playing, setPlaying] = useState(false);
  const [loadingStar, setLoadingStar] = useState(false);
  const [paused, setPaused] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const {stateTrip} = useTripProvider();
  const [intervalReference, setIntervalReference] = useState();
  const [iconName, setIconName] = useState(
    data.viewed ? 'checkmark-done' : 'checkmark',
  );

  useEffect(() => {
    setIconName(data.viewed ? 'checkmark-done' : 'checkmark');
  }, [data.viewed]);

  const handleLoadingSound = async () => {
    const source = {
      uri: `${buildApp().HOST_AUDIO_MESSAGE + tripReference}/${message || ''}`,
    };

    const {sound} = await Audio.Sound.createAsync(source);
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
    const source = {
      html: `<div style='color:${color}; max-width:${'250px'};'>${message}</div>`,
    };
    return (
      <RenderHtml
        contentWidth={Dimensions.get('window').width}
        source={source}
      />
    );
  };

  return reiceved ? (
    <MessageReceivedContainer>
      <MesssageContent messageReceived>
        <ContainerAudio>
          <ShippingDate messageReceived timeSendInSeconds={timeSendInSeconds} />
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
                containerStyle={{height: 12}}
                values={audioTime}
                selectedStyle={{backgroundColor: theme.colors.primary}}
                markerStyle={{backgroundColor: theme.colors.primary}}
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
            {returnMessageWithSource(message, theme.colors.primary)}
          </Message>
        )}
        <Ionicons
          size={24}
          color={theme.colors.primary}
          style={{marginLeft: 'auto'}}
        />
      </MesssageContent>
    </MessageReceivedContainer>
  ) : (
    <MessageSentContainer preview={preview}>
      <MesssageContent>
        <HeaderSentContainer>
          <IfLoaderInsideScreen loading={loadingStar}>
            {!isAudio && (
              <ButtonSendStar
                onPress={async () => {
                  setLoadingStar(true);
                  const savedMessages = await AsyncStorage.getItem(
                    'savedMessages',
                  );
                  let savedMessagesArray = [];
                  if (savedMessages) {
                    const oldSavedMessages = JSON.parse(savedMessages);
                    const isValuesExists = oldSavedMessages.filter(
                      datas => datas.message === data.message,
                    );
                    if (isValuesExists.length > 0) {
                      setLoadingStar(false);
                      return;
                    }
                    if (oldSavedMessages.length >= 3) {
                      oldSavedMessages.shift();
                    }
                    savedMessagesArray = [...oldSavedMessages, data];
                    await AsyncStorage.setItem(
                      'savedMessages',
                      JSON.stringify(savedMessagesArray),
                    );
                  } else {
                    savedMessagesArray = [data];
                    await AsyncStorage.setItem(
                      'savedMessages',
                      JSON.stringify(savedMessagesArray),
                    );
                  }
                  setMonitoring(true);
                  setLoadingStar(false);
                }}
              >
                <MaterialCommunityIcons
                  name="message-star-outline"
                  size={20}
                  color={theme.colors.primaryText}
                />
              </ButtonSendStar>
            )}
          </IfLoaderInsideScreen>

          <ShippingDate timeSendInSeconds={timeSendInSeconds} />
        </HeaderSentContainer>
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
                containerStyle={{height: 24}}
                values={audioTime}
                selectedStyle={{backgroundColor: theme.colors.primaryText}}
                markerStyle={{backgroundColor: theme.colors.primaryText}}
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
            {returnMessageWithSource(message, theme.colors.primaryText)}
          </Message>
        )}
        <Ionicons
          name={iconName}
          size={24}
          color={theme.colors.primaryText}
          style={{marginLeft: 'auto'}}
        />
      </MesssageContent>
    </MessageSentContainer>
  );
}

function ShippingDate({timeSendInSeconds, messageReceived}) {
  return (
    <ShippingDateText messageReceived={messageReceived}>
      {Helper.formatSecondsToDate(timeSendInSeconds)}
    </ShippingDateText>
  );
}
