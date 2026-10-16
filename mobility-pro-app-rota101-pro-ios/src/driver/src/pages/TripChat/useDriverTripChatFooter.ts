import { useEffect, useRef, useState } from 'react';
import { Platform, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import {
  useAnimatedStyle,
} from 'react-native-reanimated';
import apiMain from '../../api/apiMain';
import { useAudioDragLock, LOCK_THRESHOLD_X } from '../../hooks/useAudioDragLock';
import { useUserDriver } from '../../context/userDriver';
import type { DriverTripChatFooterParams } from './types';

const MIN_AUDIO_SECONDS = 1.2;

export function useDriverTripChatFooter({
  tripReference,
  userId: userIdProp,
  scrollToEnd,
  onSendMessage,
}: DriverTripChatFooterParams) {
  const [message, setMessage] = useState('');
  const [recording, setRecording] = useState<any>();
  const [isSendingAudio, setIsSendingAudio] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const { userDriverFind: user } = useUserDriver();
  const inputRef = useRef<TextInput>(null);

  const resetDragRef = useRef<() => void>(() => {});

  const stopRecordingSilently = (r: any) =>
    r?.stopAndUnloadAsync().catch(() => undefined);

  const startRecording = () => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    })
      .then(() => {
        const { ios, android } = Audio.RecordingOptionsPresets.HIGH_QUALITY;
        return Audio.Recording.createAsync({ android, ios, web: {} });
      })
      .then(({ recording: newRecording }) => setRecording(newRecording))
      .catch(err => console.error('Falha ao iniciar gravação', err));
  };

  const buildAudioMessageFormData = (uri: string, recordingInstance: any) => {
    const platform = Platform.OS;
    const extensionFile = recordingInstance?._options?.[platform]?.extension || '.mp3';
    const fileName = uri?.split('/').pop()?.split(extensionFile)[0] || 'audio';
    const type = extensionFile === '.m4a' ? 'audio/x-m4a' : 'audio/mpeg';

    const formData = new FormData();
    formData.append('chatTrip', JSON.stringify({
      tripReference,
      userId: user?.userId || userIdProp,
    }));
    formData.append('audio', { uri, name: fileName + extensionFile, type } as any);
    return formData;
  };

  const stopRecordingAndSend = () => {
    if (!recording) return;

    const currentRecording = recording;
    resetDragRef.current();
    setRecording(undefined);
    setIsSendingAudio(true);

    currentRecording
      .stopAndUnloadAsync()
      .then(() => Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true }))
      .then(() => currentRecording.getStatusAsync())
      .then(status => {
        const durationSeconds = (status?.durationMillis || 0) / 1000;
        if (durationSeconds < MIN_AUDIO_SECONDS) return null;

        const uri = currentRecording.getURI();
        if (!uri) throw new Error('Audio URI unavailable');

        return apiMain.post('ChatTrip/SendMessageAudio', buildAudioMessageFormData(uri, currentRecording), {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      })
      .catch(error => console.log('Erro ao enviar áudio:', error))
      .finally(() => {
        setIsSendingAudio(false);
        setRecordTime(0);
      });
  };

  const cancelLockedAudio = () => {
    if (recording) {
      stopRecordingSilently(recording);
      setRecording(undefined);
    }
    resetDragRef.current();
    setRecordTime(0);
  };

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
    onRecordingStart: startRecording,
    onRecordingEnd: stopRecordingAndSend,
    onRecordingCancel: cancelLockedAudio,
  });

  resetDragRef.current = resetDrag;

  const sendMessage = async (textToSend = message) => {
    const messageText = textToSend.trim();
    if (!messageText) return;
    inputRef.current?.clear();
    setMessage('');
    setIsSendingMessage(true);
    try {
      await onSendMessage(messageText);
    } finally {
      setIsSendingMessage(false);
    }
    setTimeout(() => scrollToEnd(), 50);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (recording || isAudioLocked) {
      interval = setInterval(() => setRecordTime(p => p + 1), 1000);
    } else {
      setRecordTime(0);
    }
    return () => clearInterval(interval);
  }, [recording, isAudioLocked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: buttonScale.value },
      { translateX: -dragProgress.value * LOCK_THRESHOLD_X },
    ] as any,
  }));

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: arrowOpacity.value,
  }));

  return {
    message,
    inputRef,
    setMessage,
    recording,
    isSendingAudio,
    isSendingMessage,
    recordTime,
    isAudioLocked,
    lockProgress,
    animatedStyle,
    arrowAnimatedStyle,
    recordingGesture,
    sendMessage,
    stopRecordingAndSend,
    cancelLockedAudio,
  };
}
