import {useNavigation} from '@react-navigation/native';
import {Audio} from 'expo-av';
import RenderHtml from 'react-native-render-html';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import {Dimensions} from 'react-native';
import {
  ButtonNotificationMessage,
  ClientContainer,
  ClientMessage,
  ClientNameMessage,
  ContentMessage,
  ModalMessage,
  PictureMessage,
} from './styles';
import {useTrip} from '../../contexts/Trip';
import {translate} from '../../locales';
import {buildApp} from '../../../constantBuild/config';
import theme from '../../styles/theme';
import {If} from '../If';

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
  tripProps?: any;
}

export const NotificationModalMessage = ({
  animationMessage,
  setNewMessage,
  setNewMessageNotification,
  isAudio,
  message,
  tripProps,
}: Props) => {
  const {navigate} = useNavigation();
  const {stateTripCustomer} = useTrip();
  let {trip: tripAccepted} = stateTripCustomer;

  if (tripProps) {
    tripAccepted = tripProps;
  }

  const mountSong = async () => {
    const {sound} = await Audio.Sound.createAsync(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../assets/songs/alertNewMessageChat.mp3'),
    );
    return sound;
  };

  const verifyStorageSwitchRead = async () => {
    const value = await AsyncStorage.getItem('switchRead-client');
    return value === 'true';
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
    if (message?.includes('<b>')) {
      return;
    }
    Speech.speak(
      `${getFirstName(tripAccepted?.driver?.name)} ${translate(
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
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
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
            navigate('TripChat', {trip: tripAccepted});
          }}
        >
          <PictureMessage
            source={{
              uri:
                tripAccepted?.centralId === null
                  ? tripAccepted?.driver?.profilePicture
                  : `${buildApp().HOST_IMAGE_TRIP_TYPE}${
                      tripAccepted?.fare?.picture
                    }`,
            }}
          />
          <ContentMessage>
            <ClientNameMessage>
              {tripAccepted?.driver?.nickname}
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
              <RenderHtml
                contentWidth={Dimensions.get('window').width}
                source={{
                  html: `<p style='color:${theme.colors.white}; font-size: ${
                    theme.fontSizes.medium
                  }px; max-width:${'250px'}; font-family: MavenPro_500Medium;'>${
                    message?.message
                  }</p>`,
                }}
              />
            </If>
          </ContentMessage>
        </ButtonNotificationMessage>
      </ClientContainer>
    </ModalMessage>
  );
};
