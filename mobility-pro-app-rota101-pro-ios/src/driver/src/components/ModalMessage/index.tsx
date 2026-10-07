import {useNavigation} from '@react-navigation/native';
import {Audio} from 'expo-av';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import {useBubbleButton} from '@704apps/react-native-bubble-button';
import {buildApp} from '../../../../constantBuild/config';
import {useTripProvider} from '../../context/Trip';

import {
  ButtonNotificationMessage,
  ClientContainer,
  ClientMessage,
  ClientNameMessage,
  ContentMessage,
  ModalMessage,
  PictureMessage,
} from './styles';
import {translate} from '../../../../client/locales';
import { If } from '../../../../client/components/If';
import RenderHTML from 'react-native-render-html';
import { Dimensions } from 'react-native';
import theme from '../../../../client/styles/theme';

export interface MessageProps {
  active: boolean;
  chatTripId: number;
  customerUserId: number;
  driverUserId: number;
  isAudio: boolean;
  message: string;
  tripReference: string;
  userId: number;
  userWhoReceivedId: string;
}

export interface DateClass {
  nanoseconds: number;
  seconds: number;
}

interface Props {
  animationMessage: any;
  setNewMessage: (value: boolean) => void;
  setNewMessageNotification: (value: boolean) => void;
  message: MessageProps;
  isAudio: boolean;
}

export const NotificationModalMessage = ({
  animationMessage,
  setNewMessage,
  setNewMessageNotification,
  isAudio,
  message,
}: Props) => {
  const {navigate} = useNavigation();
  const {stateTrip} = useTripProvider();
  const {tripAccepted} = stateTrip;
  const {openApp} = useBubbleButton();

  const mountSong = async () => {
    const {sound} = await Audio.Sound.createAsync(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../assets/songs/alertNewMessageChat.mp3'),
    );
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    return sound;
  };

  const verifyStorageSwitchRead = async () => {
    const value = await AsyncStorage.getItem('switchRead-driver');
    if (value === 'true') {
      return true;
    }
    return false;
  };

  const getFirstName = (name: string) => {
    return !name ? '' : name.split(' ')[0];
  };

  const speakUnicMessage = (message: string = null, isAudio) => {
    if (isAudio) {
      Speech.speak(
        `${getFirstName(tripAccepted?.customer?.name)} ${translate(
          'tripChat.new_audio_message',
        )}`,
        {
          language: 'pt-BR',
          // rate: rate,
        },
      );
      return;
    }
    if(message?.includes('<b>')) {
      return;
    }
    Speech.speak(
      `${getFirstName(tripAccepted?.customer?.name)} ${translate(
        'trip.said',
      )} ${message}`,
      {
        language: 'pt-BR',
        // rate: rate,
      },
    );
  };

  useEffect(() => {
    mountSong().then(async soung => {
      await openApp();
      await soung?.playAsync().then(() => {
        verifyStorageSwitchRead().then(value => {
          if (value) {
            speakUnicMessage(message?.message, message?.isAudio);
          }
        });
      });
    });
  }, []);
  return (
    <ModalMessage>
      <ClientContainer
        from={{
          transform: [{translateY: 500}],
          opacity: 0.7,
        }}
        animate={{
          transform: [{translateY: 0}],
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        state={animationMessage}
      >
        <ButtonNotificationMessage
          onPress={() => {
            setNewMessage(false);
            setNewMessageNotification(false);
            navigate('TripChatDriver', {trip: tripAccepted});
          }}
        >
          <PictureMessage
            source={{
              uri:
                tripAccepted?.centralId === null
                  ? `${buildApp().HOST_IMAGE_CUSTOMER}${
                      tripAccepted?.customer?.profileImage
                    }`
                  : `${buildApp().HOST_IMAGE_TRIP_TYPE}${
                      tripAccepted?.fare?.picture
                    }`,
            }}
          />
          <ContentMessage>
            <ClientNameMessage>
              {tripAccepted?.customer?.nickname}
            </ClientNameMessage>
            <If
              condition={message?.message?.includes('<b>')}
              conditionElse={
                <ClientMessage>
                  {isAudio ? translate('tripChat.new_audio_message') : ''}
                  {!isAudio && message?.message ? message?.message : ''}
                </ClientMessage>
              }
            >
              <RenderHTML
                contentWidth={Dimensions.get('window').width}
                source={{
                  html: `<p style='color:${theme.colors.white}; font-size: ${
                    theme.fontSizes.medium
                  }px; max-width:${'250px'}; font-family: MavenPro_500Medium;'>${
                    message?.message
                  }</p>`
                }}
              />
            </If>
          </ContentMessage>
        </ButtonNotificationMessage>
      </ClientContainer>
    </ModalMessage>
  );
};
