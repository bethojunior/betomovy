import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, InteractionManager, Keyboard } from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import apiMain from '../../api/apiMain';
import { useUserDriver } from '../../context/userDriver';
import { translate } from '../../../../client/locales';
import { ChatRealtime } from '../../service/realtime/ChatRealtime';
import { useKeyboardHeight } from '../../../../common/hooks/useKeyboardHeight';
import { useOptimisticTripChatMessages } from '../../../../common/hooks/useOptimisticTripChatMessages';
import { dismissKeyboardAndWait } from '../../../../common/Utils/dismissKeyboardAndWait';
import { storage } from '~/common/services/mmkv/storage';
import { STORAGE_KEYS } from '~/common/constants/storageKeys';
import type {
  DriverTripChatController,
  DriverTripChatRoute,
  SpeakDriverTripMessage,
} from './types';

export function useDriverTripChatController(route: DriverTripChatRoute): DriverTripChatController {
  const { userDriverFind: user } = useUserDriver();
  const scroll = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [switchValue, setSwitchValue] = useState(false);
  const chatRealtime = useMemo(() => new ChatRealtime(), []);
  const {
    messages,
    setMessages,
    applyRealtimeChanges,
    addOptimisticMessage,
    updateOptimisticStatus,
  } = useOptimisticTripChatMessages();
  const { trip } = route.params;
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const isFocusedRef = useRef(isFocused);
  const keyboardHeight = useKeyboardHeight();

  const scrollToEnd = useCallback(
    (delay = 0) => setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), delay),
    [],
  );

  const getFirstName = (name: string) => (!name ? '' : name?.split(' ')[0]);

  const sendTextMessage = useCallback((textToSend: string, retryLocalId?: string) => {
    const messageText = textToSend.trim();
    if (!messageText || !trip?.tripReference) return;

    const userId = user?.userId || user?.idUser;
    const localId = retryLocalId || addOptimisticMessage({
      tripReference: trip.tripReference,
      message: messageText,
      userId,
    });

    if (retryLocalId) {
      updateOptimisticStatus(retryLocalId, 'sending');
    }

    scrollToEnd(50);

    const payload = {
      stdObject: [{ tripReference: trip.tripReference, message: messageText, userId }],
    };

    return apiMain
      .post('ChatTrip/SendMessage', payload)
      .then(() => {
        updateOptimisticStatus(localId, 'sent');
        scrollToEnd(100);
      })
      .catch(err => {
        console.log('Erro ao enviar texto:', err);
        updateOptimisticStatus(localId, 'error');
      });
  }, [addOptimisticMessage, scrollToEnd, trip?.tripReference, updateOptimisticStatus, user?.idUser, user?.userId]);

  const handleChatMessageEvent = useCallback(() => {
    chatRealtime.getCurrentMessages(trip.tripReference, currentMessages => {
      const addedMessages = currentMessages.filter(message => message.type === 'added');
      const modifiedMessages = currentMessages.filter(message => message.type === 'modified');

      addedMessages.forEach(currentMessage => {
        if (
          isFocusedRef.current &&
          Number(currentMessage.messageData?.userId) !== Number(user.userId) &&
          !currentMessage.messageData?.viewed
        ) {
          chatRealtime.setViewMessage(currentMessage.id, trip.tripReference);
        }
      });

      applyRealtimeChanges([...addedMessages, ...modifiedMessages]);
      setLoading(false);
    });
  }, [applyRealtimeChanges, chatRealtime, trip?.tripReference, user?.userId]);

  const verifyStorageSwitchRead = useCallback(() => {
    const value = storage.getItem(STORAGE_KEYS.SWITCH_READ, 'boolean');
    if (value) setSwitchValue(true);
  }, []);

  const handleSwitchValue = useCallback((value: boolean) => {
    setSwitchValue(value);
    storage.setItem(STORAGE_KEYS.SWITCH_READ, value, 'boolean');
  }, []);

  const speakMessage = useCallback((message: string = null, object: any[] = []) => {
    if (!object) return;
    const voiceReadIds = new Set<any>();
    object.forEach(data => {
      if (data.userId == user.userId) { voiceReadIds.add(data.id); return; }
      if (data.message?.includes('<b>')) { voiceReadIds.add(data.id); return; }
      if (data?.isAudio) { voiceReadIds.add(data.id); return; }
      if (data.message !== 'null') {
        Speech.speak(
          `${getFirstName(trip?.customer?.name)} ${translate('trip.said')} ${data.message}`,
          { language: 'pt-BR' },
        );
        voiceReadIds.add(data.id);
      }
    });
    if (voiceReadIds.size > 0) {
      setMessages(prev => prev.map(msg =>
        voiceReadIds.has(msg.messageData?.id)
          ? { ...msg, messageData: { ...msg.messageData, voiceRead: true } }
          : msg
      ));
    }
  }, [trip?.customer?.name, user?.userId, setMessages]);

  const speakUnicMessage: SpeakDriverTripMessage = useCallback((message: string = null, object = null, received = false) => {
    if (!object) return;
    if (object?.isAudio || object.message?.includes('<b>')) {
      setMessages(prev => prev.map(msg =>
        msg.messageData?.id === object?.id
          ? { ...msg, messageData: { ...msg.messageData, voiceRead: true } }
          : msg
      ));
      return;
    }

    Speech.speak(
      received
        ? `${getFirstName(trip?.customer?.name)} ${translate('trip.said')} ${object.message}`
        : `${user?.nickname} ${translate('trip.said')} ${object.message}`,
      { language: 'pt-BR' },
    );

    setMessages(prev => prev.map(msg =>
      msg.messageData?.id === object?.id
        ? { ...msg, messageData: { ...msg.messageData, voiceRead: true } }
        : msg
    ));
  }, [trip?.customer?.name, user?.nickname, setMessages]);

  const speechAllMessagesAutomatic = useCallback(() => {
    const messagesToSpeech = messages
      .filter(data => !data?.messageData.voiceRead && !data?.messageData.viewed)
      .map(data => data.messageData);
    speakMessage('', messagesToSpeech);
  }, [messages, speakMessage]);

  useFocusEffect(
    useCallback(() => {
      return () => { Keyboard.dismiss(); };
    }, [])
  );

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
    });
    return () => {
      showSub.remove();
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    isFocusedRef.current = isFocused;
  }, [isFocused]);

  useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      if (trip?.tripReference) {
        if (trip.status === 'finished') {
          dismissKeyboardAndWait().then(() => navigation.navigate('Trip'));
        }
        handleChatMessageEvent();
      }
    });
    return () => interaction.cancel();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    const interaction = InteractionManager.runAfterInteractions(() => {
      Audio.requestPermissionsAsync().then(({ granted }) => {
        if (!granted) console.warn('Permissão de áudio não concedida!');
      });
      verifyStorageSwitchRead();
    });

    return () => {
      backHandler.remove();
      interaction.cancel();
    };
  }, []);

  useEffect(() => {
    if (switchValue) {
      speechAllMessagesAutomatic();
    } else {
      Speech.stop();
    }
  }, [messages, switchValue, speechAllMessagesAutomatic]);

  return {
    user,
    trip,
    scroll,
    loading,
    messages,
    switchValue,
    setSwitchValue: handleSwitchValue,
    keyboardHeight,
    scrollToEnd,
    sendTextMessage,
    speakUnicMessage,
  };
}
