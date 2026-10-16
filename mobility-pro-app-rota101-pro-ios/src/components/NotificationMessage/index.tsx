import { Audio } from 'expo-av';
import RenderHtml from 'react-native-render-html';
import { useCallback, useEffect, useRef } from 'react';
import { storage } from '~/common/services/mmkv/storage';
import { STORAGE_KEYS } from '~/common/constants/storageKeys';
import * as Speech from 'expo-speech';
import { Dimensions } from 'react-native';
import { useDynamicAnimation } from 'moti';
import { Avatar, Container, Content, MessageText, Pressable, Row, Title } from './styles';
import { translate } from '~/client/locales';
import theme from '~/client/styles/theme';
import { If } from '~/client/components/If';
import { useSong } from '~/driver/src/hooks/song';

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

interface Props {
  visible: boolean;
  message: MessageProps;
  isAudio: boolean;
  title: string;
  pictureUri: string;
  onPress: () => void;
  onDismiss: () => void;
  onRead?: () => void;
}

export const NotificationMessage = ({
  visible,
  message,
  isAudio,
  title,
  pictureUri,
  onPress,
  onDismiss,
  onRead,
}: Props) => {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const animationMessage = useDynamicAnimation(() => ({
    transform: [{ translateY: -120 }],
    opacity: 0,
  }));

  const { playSong } = useSong();

  const dismiss = useCallback(() => {
    animationMessage.animateTo({ transform: [{ translateY: -120 }], opacity: 0 });
    setTimeout(() => onDismissRef.current(), 350);
  }, []);

  const getFirstName = (name: string) => {
    return !name ? '' : name?.split(' ')[0];
  };

  const speakUnicMessage = (msg: string = null, isAudioMsg: boolean) => {
    if (isAudioMsg) {
      Speech.speak(`${getFirstName(title)} ${translate('tripChat.new_audio_message')}`, {
        language: 'pt-BR',
        onDone: onRead,
      });
      return;
    }
    if (msg?.includes('<b>') || !msg) return;
    Speech.speak(`${getFirstName(title)} ${translate('trip.said')} ${msg}`, {
      language: 'pt-BR',
      onDone: onRead,
    });
  };

  const executeAudio = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    playSong('message').then(() => {
      const switchRead = storage.getItem(STORAGE_KEYS.SWITCH_READ, 'boolean');
      if (switchRead) {
        speakUnicMessage(message?.message, message?.isAudio);
      } else {
        Speech.stop();
      }
    });
  };

  useEffect(() => {
    if (visible) {
      animationMessage.animateTo({ transform: [{ translateY: 0 }], opacity: 1 });
      executeAudio();
    }

    const timer = setTimeout(dismiss, 5000);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <Container state={animationMessage}>
      <Row>
        <Pressable
          activeOpacity={0.8}
          onPress={() => {
            dismiss();
            onPress();
          }}
        >
          <Avatar source={{ uri: pictureUri }} />
          <Content>
            <Title>{title}</Title>
            <If
              condition={message?.message?.includes('<b>')}
              conditionElse={
                <MessageText numberOfLines={2}>
                  {isAudio ? translate('tripChat.new_audio_message') : ''}
                  {!isAudio && message?.message ? message?.message : ''}
                </MessageText>
              }
            >
              <RenderHtml
                contentWidth={Dimensions.get('window').width}
                source={{
                  html: `<p style='color:${theme.colors.white}; font-size: ${theme.fontSizes.medium}px; max-width:250px; font-family: MavenPro_300Medium;'>${message?.message}</p>`,
                }}
              />
            </If>
          </Content>
        </Pressable>
      </Row>
    </Container>
  );
};
