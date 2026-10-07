// @ts-nocheck
import { useEffect, useState } from 'react';
import { Keyboard, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import apiMain from '../../api/apiMain';
import { useTrip } from '../../contexts/Trip';
import { useAuth } from '../../../context/auth';
import { IfLoaderInsideScreen } from '../../components/IfLoaderInsideScreen';
import { useAudioDragLock, LOCK_THRESHOLD_X } from '../../hooks/useAudioDragLock';
import { TripChatAudioLockControls } from '../../../common/components/TripChatAudioLockControls';
import { QuickMessagesRow } from '../../../common/components/QuickMessagesRow';
import { DragToLockHint } from '../../../common/components/DragToLockHint';
import theme from '../../styles/theme';
import { translate } from '../../locales';
import {
  FooterContent,
  FooterInput,
  RecordingButton,
  RecordingButtonContainer,
  SendIconButton,
  footerLayoutStyles,
} from './styles';

const MIN_AUDIO_SECONDS = 1.2;

export function Footer({ tripReference, userId, quickMessages = [], scrollToEnd, onLayoutChange }) {
  const { stateTripCustomer } = useTrip();
  const { trip } = stateTripCustomer;
  const { user } = useAuth();

  const [message, setMessage] = useState('');
  const [recording, setRecording] = useState();
  const [isSendingAudio, setIsSendingAudio] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    isAudioLocked,
    dragProgress,
    buttonScale,
    arrowOpacity,
    lockProgress,
    recordingGesture,
    resetDrag,
  } = useAudioDragLock({
    disabled: isSendingAudio,
    onRecordingStart: handleStartRecording,
    onRecordingEnd: handleStopRecordingAndSend,
    onRecordingCancel: () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(() => {});
        setRecording(undefined);
      }
      setRecordTime(0);
    },
  });

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, [recording]);

  useEffect(() => {
    if (isAudioLocked) {
      Keyboard.dismiss();
    }
  }, [isAudioLocked]);

  async function handleMessage(textToSend = message) {
    const messageText = textToSend.trim();
    if (!messageText) return;
    setMessage('');
    setLoading(true);
    await apiMain.post('ChatTrip/SendMessage', {
      stdObject: [{ tripReference, message: messageText, userId }],
    });
    setLoading(false);
  }

  async function handleStartRecording() {
    try {
      if (recording) {
        try {
          await recording.stopAndUnloadAsync();
        } catch (e) {}
        setRecording(undefined);
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { ios, android } = Audio.RecordingOptionsPresets.HIGH_QUALITY;
      const { recording: newRecording } = await Audio.Recording.createAsync({
        android,
        ios,
        web: {},
      });
      setRecording(newRecording);
    } catch (err) {
      console.error('Failed to start recording', err);
      setRecording(undefined);
    }
  }

  async function handleStopRecordingAndSend() {
    if (!recording) return;

    setIsSendingAudio(true);

    try {
      const status = await recording.getStatusAsync();
      const durationSeconds = (status?.durationMillis || 0) / 1000;

      await recording.stopAndUnloadAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      if (durationSeconds < MIN_AUDIO_SECONDS) {
        console.log('Áudio muito curto, descartado:', durationSeconds);

        setRecording(undefined);
        setRecordTime(0);
        setIsSendingAudio(false);
        resetDrag();

        return;
      }

      const uri = recording.getURI();
      const platform = Platform.OS;
      const extensionFile = recording._options[platform].extension;

      const formData = new FormData();

      formData.append(
        'chatTrip',
        JSON.stringify({
          tripReference: trip.tripReference,
          userId: user.idUser,
        }),
      );

      formData.append('audio', {
        uri,
        name: 'audio.mp3',
        type: 'audio/mpeg',
      });

      setLoading(true);

      await apiMain.post('ChatTrip/SendMessageAudio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setRecording(undefined);
      setLoading(false);
      setIsSendingAudio(false);
    } catch (error) {
      console.log('Erro ao enviar áudio:', error);
      setLoading(false);
      setIsSendingAudio(false);
    }
  }

  const handleCancelLockedAudio = async () => {
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch (e) {}
      setRecording(undefined);
    }
    resetDrag();
    setRecordTime(0);
  };

  const handleSendLockedAudio = () => {
    handleStopRecordingAndSend();
    resetDrag();
    setRecordTime(0);
  };

  const isCounting = recording || isAudioLocked;

  useEffect(() => {
    if (!isCounting) {
      setRecordTime(0);
      return;
    }

    const interval = setInterval(() => {
      setRecordTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isCounting]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: buttonScale.value },
      { translateX: -dragProgress.value * LOCK_THRESHOLD_X },
    ],
  }));

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: arrowOpacity.value,
  }));

  const footerExitStyle = useAnimatedStyle(() => ({
    opacity: interpolate(lockProgress.value, [0, 1], [1, 0]),
  }));

  const cardEnterStyle = useAnimatedStyle(() => ({
    opacity: interpolate(lockProgress.value, [0, 1], [0, 1]),
  }));

  // Mede o bloco de altura variável (chips + input) pra posicionar o botão
  // de "voltar ao fim" sempre acima dele, em vez de um offset fixo que quebra
  // quando o número de chips muda (favoritas entram/saem).
  const handleFooterLayout = event => {
    onLayoutChange?.(event.nativeEvent.layout.height);
  };

  return (
    <>
      <View onLayout={handleFooterLayout}>
        {!recording && !isAudioLocked && (
          <QuickMessagesRow messages={quickMessages} onSelect={handleMessage} />
        )}

        <FooterContent>
          <Animated.View style={[footerLayoutStyles.fill, footerExitStyle]} pointerEvents={isAudioLocked ? 'none' : 'auto'}>
            <FooterInput
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={2}
              placeholder={
                loading
                  ? translate('trip.chat.sending_message')
                  : isSendingAudio
                    ? translate('trip.chat.sending_audio')
                    : recording
                      ? translate('trip.chat.recording', { time: recordTime })
                      : translate('trip.chat.placeholder')
              }
              editable={!loading}
              placeholderTextColor={'#000'}
              onFocus={scrollToEnd}
            />

            <IfLoaderInsideScreen loading={loading}>
              {message ? (
                <SendIconButton
                  onPress={() => handleMessage()}
                  accessibilityLabel={translate('trip.chat.send_message_a11y')}
                >
                  <Ionicons name="send" size={30} color={theme.colors.primary} />
                </SendIconButton>
              ) : (
                <RecordingButtonContainer recording={Boolean(recording)}>
                  <GestureDetector gesture={recordingGesture}>
                    <Animated.View style={animatedStyle}>
                      <RecordingButton recording={Boolean(recording)}>
                        <Ionicons
                          name="mic"
                          size={24}
                          color={theme.colors.primaryText}
                        />
                      </RecordingButton>
                    </Animated.View>
                  </GestureDetector>
                </RecordingButtonContainer>
              )}
            </IfLoaderInsideScreen>
          </Animated.View>

          <Animated.View
            style={[footerLayoutStyles.cardFill, cardEnterStyle]}
            pointerEvents={isAudioLocked ? 'auto' : 'none'}
          >
            <TripChatAudioLockControls
              recordTime={recordTime}
              onCancel={handleCancelLockedAudio}
              onSend={handleSendLockedAudio}
              sendDisabled={isSendingAudio}
            />
          </Animated.View>
        </FooterContent>
      </View>

      <DragToLockHint animatedStyle={arrowAnimatedStyle} />
    </>
  );
}
