import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, InteractionManager, Keyboard } from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiMain from '../../api/apiMain';
import { useKeyboardHeight } from '../../../common/hooks/useKeyboardHeight';
import { useOptimisticTripChatMessages } from '../../../common/hooks/useOptimisticTripChatMessages';
import { dismissKeyboardAndWait } from '../../../common/Utils/dismissKeyboardAndWait';
import { useAuth } from '../../../context/auth';
import { translate } from '../../locales';
import { ChatRealtime } from '../../services/realtime/ChatRealtime';
import type {
  SpeakTripMessage,
  TripChatRoute,
  TripChatUser,
  TripChatViewController,
} from './types';

const SWITCH_READ_STORAGE_KEY = 'switchRead';

export function useTripChatViewController(route: TripChatRoute): TripChatViewController {
  const { user } = useAuth();
  const trip = route?.params;
  const scroll = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [switchValue, setSwitchValue] = useState(true);
  const chatRealtime = useMemo(() => new ChatRealtime(), []);
  const {
    messages,
    setMessages,
    applyRealtimeChanges,
    addOptimisticMessage,
    updateOptimisticStatus,
  } = useOptimisticTripChatMessages();

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

    const localId = retryLocalId || addOptimisticMessage({
      tripReference: trip.tripReference,
      message: messageText,
      userId: user.idUser,
    });

    if (retryLocalId) {
      updateOptimisticStatus(retryLocalId, 'sending');
    }

    scrollToEnd(50);

    const payload = {
      stdObject: [{ tripReference: trip.tripReference, message: messageText, userId: user.idUser }],
    };

    return apiMain
      .post('ChatTrip/SendMessage', payload)
      .then(() => {
        updateOptimisticStatus(localId, 'sent');
        scrollToEnd(100);
      })
      .catch(error => {
        console.log('Erro ao enviar texto:', error);
        updateOptimisticStatus(localId, 'error');
      });
  }, [addOptimisticMessage, scrollToEnd, trip?.tripReference, updateOptimisticStatus, user.idUser]);

  const handleChatMessageEvent = useCallback(() => {
    chatRealtime.getCurrentMessages(trip.tripReference, currentMessages => {
      const addedMessages = currentMessages.filter(message => message.type === 'added');
      const modifiedMessages = currentMessages.filter(message => message.type === 'modified');

      addedMessages.forEach(currentMessage => {
        if (
          isFocusedRef.current &&
          Number(currentMessage.messageData?.userId) !== Number(user.idUser) &&
          !currentMessage.messageData?.viewed
        ) {
          chatRealtime.setViewMessage(currentMessage.id, trip.tripReference);
        }
      });

      applyRealtimeChanges([...addedMessages, ...modifiedMessages]);
      setLoading(false);
    });
  }, [applyRealtimeChanges, chatRealtime, trip?.tripReference, user.idUser]);

  const speakMessage = useCallback((message: string = null, object: any[] = []) => {
    if (!object) return;
    const voiceReadIds = new Set<any>();
    object.forEach(data => {
      if (data.userId == user.idUser) { voiceReadIds.add(data.id); return; }
      if (data?.isAudio) { voiceReadIds.add(data.id); return; }
      if (data.message?.includes('<b>')) { voiceReadIds.add(data.id); return; }
      if (data.message !== 'null') {
        Speech.speak(
          `${getFirstName(trip?.driver?.name)} ${translate('trip.said')} ${data.message}`,
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
  }, [trip?.driver?.name, user.idUser, setMessages]);

  const speakUnicMessage: SpeakTripMessage = useCallback((message: string = null, object = null, received = false) => {
    if (!object) return;
    if (object?.isAudio || object?.message?.includes('<b>')) {
      setMessages(prev => prev.map(msg =>
        msg.messageData?.id === object?.id
          ? { ...msg, messageData: { ...msg.messageData, voiceRead: true } }
          : msg
      ));
      return;
    }

    Speech.speak(
      received
        ? `${getFirstName(trip?.driver?.name)} ${translate('trip.said')} ${object.message}`
        : `${getFirstName(user?.nickname)} ${translate('trip.said')} ${object.message}`,
      { language: 'pt-BR' },
    );

    setMessages(prev => prev.map(msg =>
      msg.messageData?.id === object?.id
        ? { ...msg, messageData: { ...msg.messageData, voiceRead: true } }
        : msg
    ));
  }, [trip?.driver?.name, user?.nickname, setMessages]);

  const speechAllMessagesAutomatic = useCallback(() => {
    const messagesToSpeech = messages
      .filter(data => !data?.messageData.voiceRead && !data?.messageData.viewed)
      .map(data => data.messageData);
    speakMessage('', messagesToSpeech);
  }, [messages, speakMessage]);

  const verifyStorageSwitchRead = useCallback(() =>
    AsyncStorage.getItem(SWITCH_READ_STORAGE_KEY).then(value => {
      if (value || value === null) {
        setSwitchValue(true);
        return true;
      }
      setSwitchValue(false);
      return false;
    }), []);

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
      if (trip && Object.keys(trip).length > 0 && trip.tripReference) {
        if (trip.status === 'finished') {
          dismissKeyboardAndWait().then(() => navigation.navigate('Trip'));
          return;
        }
        handleChatMessageEvent();
      }
    });
    return () => interaction.cancel();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      dismissKeyboardAndWait().then(() => navigation.navigate('Trip'));
      return true;
    });

    const interaction = InteractionManager.runAfterInteractions(() => {
      Audio.requestPermissionsAsync();
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

  useEffect(() => {
    if (switchValue) {
      AsyncStorage.setItem(SWITCH_READ_STORAGE_KEY, 'true');
    } else {
      AsyncStorage.removeItem(SWITCH_READ_STORAGE_KEY);
    }
  }, [switchValue]);

  return {
    user: user as unknown as TripChatUser,
    trip,
    scroll,
    loading,
    messages,
    switchValue,
    setSwitchValue,
    keyboardHeight,
    scrollToEnd,
    sendTextMessage,
    speakUnicMessage,
  };
}
