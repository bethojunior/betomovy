import { useEffect, useRef, useState } from 'react';
import { Platform, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import {
  useAnimatedStyle,
} from 'react-native-reanimated';
import apiMain from '../../api/apiMain';
import { useAuth } from '../../../context/auth';
import { useAudioDragLock, LOCK_THRESHOLD_X } from '../../hooks/useAudioDragLock';
import type { TripChatFooterParams } from './types';

const MIN_AUDIO_SECONDS = 1.2;

export function useTripChatFooter({ tripReference, onSendMessage }: TripChatFooterParams) {
  const { user } = useAuth();
  const inputRef = useRef<TextInput>(null);
  const [message, setMessage] = useState('');
  const [recording, setRecording] = useState<any>();
  const [recordTime, setRecordTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const resetDragRef = useRef<() => void>(() => {});

  const sendMessage = () => {
    const messageText = message.trim();
    if (!messageText) return;
    inputRef.current?.clear();
    setMessage('');
    onSendMessage(messageText);
  };

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
      .catch(err => console.error('Failed to start recording', err));
  };

  const buildAudioMessageFormData = (uri: string, recordingInstance: any) => {
    const platform = Platform.OS;
    const extensionFile = recordingInstance?._options?.[platform]?.extension || '.mp3';
    const fileName = uri?.split('/').pop()?.split(extensionFile)[0] || 'audio';
    const type = extensionFile === '.m4a' ? 'audio/x-m4a' : 'audio/mpeg';

    const formData = new FormData();
    formData.append('chatTrip', JSON.stringify({ tripReference, userId: user.idUser }));
    formData.append('audio', { uri, name: fileName + extensionFile, type } as any);
    return formData;
  };

  const stopRecordingAndSend = () => {
    if (!recording) return;

    const currentRecording = recording;
    resetDragRef.current();
    setRecording(undefined);
    setLoading(true);

    currentRecording
      .stopAndUnloadAsync()
      .then(() => Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true }))
      .then(() => currentRecording.getStatusAsync())
      .then((status: any) => {
        const durationSeconds = (status?.durationMillis || 0) / 1000;
        if (durationSeconds < MIN_AUDIO_SECONDS) return null;

        const uri = currentRecording.getURI();
        if (!uri) throw new Error('Audio URI unavailable');

        return apiMain.post('ChatTrip/SendMessageAudio', buildAudioMessageFormData(uri, currentRecording), {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      })
      .catch((error: any) => console.log('Erro ao enviar áudio:', error))
      .finally(() => {
        setLoading(false);
        setRecordTime(0);
      });
  };

  const cancelLockedAudio = () => {
    if (recording) {
      recording.stopAndUnloadAsync().catch(() => undefined);
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
    disabled: loading,
    onRecordingStart: startRecording,
    onRecordingEnd: stopRecordingAndSend,
    onRecordingCancel: cancelLockedAudio,
  });

  resetDragRef.current = resetDrag;

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
    recordTime,
    loading,
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
