/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
// @ts-nocheck

import { useRef, useEffect, useState, useMemo } from 'react';
import {
  Platform,
  BackHandler,
  Keyboard,
  AppState,
  Animated as RNAnimated,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { storage } from '~/common/services/mmkv/storage';
import { STORAGE_KEYS } from '~/common/constants/storageKeys';
import { RFValue } from 'react-native-responsive-fontsize';
import LoadView from '../../components/LoadView';
import { useTrip } from '../../contexts/Trip';
import {
  Container,
  Content,
  AutoReadCard,
  ScrollToBottomButton,
  footerLayoutStyles,
} from './styles';
import { useFavoriteQuickMessages } from '../../../common/hooks/useFavoriteQuickMessages';
import { getPassengerQuickMessages } from './passengerQuickMessages';
import { NavBar } from './NavBar';
import { MessageList } from './MessageList';
import { Footer } from './Footer';
import { useAuth } from '../../../context/auth';
import theme from '../../styles/theme';
import { AutoReadToggle } from '../../../common/components/AutoReadToggle';
import { Switch } from '../../components/Switch';
import { translate } from '../../locales';
import { ChatRealtime } from '../../services/realtime/ChatRealtime';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { useChatScrollPosition } from '../../../common/hooks/useChatScrollPosition';
import { getChatOverlayVisibility } from '../../../common/hooks/chatOverlayVisibility';

export default function TripChat() {
  const { user } = useAuth();
  const { stateTripCustomer } = useTrip();
  const { trip } = stateTripCustomer;
  const scroll = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switchValue, setSwitchValue] = useState(true);
  const chatRealtime = useMemo(() => new ChatRealtime(), []);
  const keyboardTranslateY = useRef(new RNAnimated.Value(0)).current;
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const bottomInset = initialWindowMetrics?.insets?.bottom ?? 0;
  // Chute inicial até o primeiro onLayout do rodapé medir o valor real.
  const [footerHeight, setFooterHeight] = useState(RFValue(74));

  const passengerFallbackMessages = useMemo(() => getPassengerQuickMessages(), []);
  const { quickMessages, favoriteMessage } = useFavoriteQuickMessages(passengerFallbackMessages);

  const { navigate } = useNavigation();

  const scrollToEndWhenOpeningKeyboard = () => {
    scroll.current?.scrollToEnd({ animated: true });
  };

  const isFocused = useIsFocused();
  const isFocusedRef = useRef(isFocused);

  useEffect(() => {
    if (Platform.OS === "ios") return;

    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      const height = e.endCoordinates.height;

      setKeyboardHeight(height);

      RNAnimated.timing(keyboardTranslateY, {
        toValue: -height,
        duration: 250,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        scroll.current?.scrollToEnd({ animated: true });
      }, 50);
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);

      RNAnimated.timing(keyboardTranslateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const sub = AppState.addEventListener('change', state => {
      if (state !== 'active') Keyboard.dismiss();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    isFocusedRef.current = isFocused;
  }, [isFocused]);

  useEffect(() => {
    if (trip?.tripReference) {
      const unsubscribe = handleChatMessageEvent(trip.tripReference);
      return () => unsubscribe?.();
    }
  }, [trip?.tripReference]);

  useEffect(() => {
    if (trip?.status === 'finished') {
      navigate('Trip');
    }
  }, [trip?.status, navigate]);

  const handleChatMessageEvent = (tripReference: string) => {
    return chatRealtime.getCurrentMessages(tripReference, currentMessages => {
      const addedMessages = currentMessages.filter(
        message => message.type === 'added',
      );
      const modifiedMessages = currentMessages.filter(
        message => message.type === 'modified',
      );
      addedMessages.forEach(currentMessage => {
        if (
          isFocusedRef.current &&
          Number(currentMessage.userId) !== Number(user.idUser) &&
          !currentMessage.viewed
        ) {
          chatRealtime.setViewMessage(currentMessage.id, tripReference);
        }
        setMessages(prevMessages => {
          if (prevMessages.some(m => m.id === currentMessage.id)) return prevMessages;
          return [...prevMessages, currentMessage];
        });
      });

      modifiedMessages.forEach(currentMessage => {
        setMessages(prevMessages => {
          const newState = prevMessages.map(message =>
            message.id === currentMessage.id ? currentMessage : message,
          );
          return newState;
        });
      });

      setLoading(false);
    });
  };

  useEffect(() => {
    Audio.requestPermissionsAsync();
    verifyStorageSwitchRead();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigate('Trip');
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);


  const getFirstName = (name: string) => {
    return !name ? '' : name?.split(' ')[0];
  };

  const speakMessage = (message: string = null, object = null) => {
    object.map(data => {
      if (data.userId == user.idUser) {
        return;
      }
      if (data?.isAudio) {
        return (data.voiceRead = true);
      }
      if (data.message?.includes('<b>')) {
        data.voiceRead = true;
        return;
      }

      if (data.message !== 'null') {
        Speech.speak(
          `${getFirstName(trip?.driver?.name)} ${translate('trip.said')} ${data.message
          }`,
          {
            language: 'pt-BR',
            // rate: rate,
          },
        );

        data.voiceRead = true;

        setMessages(prev =>
          prev.map(m =>
            m.messageData.id === data.id
              ? { ...m, messageData: { ...m.messageData, voiceRead: true } }
              : m
          )
        );
      }
    });
    // const language = await AsyncStorage.getItem('@language');
  };

  const speakUnicMessage = (
    message: string = null,
    object = null,
    received = false,
  ) => {
    if (object?.isAudio) {
      return (object.voiceRead = true);
    }
    if (object?.message?.includes('<b>')) {
      object.voiceRead = true;
      return;
    }
    if (!received) {
      Speech.speak(
        `${getFirstName(user?.nickname)} ${translate('trip.said')} ${object.message
        }`,
        {
          language: 'pt-BR',
          // rate: rate,
        },
      );
    }
    if (received) {
      Speech.speak(
        `${getFirstName(trip?.driver?.name)} ${translate('trip.said')} ${object.message
        }`,
        {
          language: 'pt-BR',
          // rate: rate,
        },
      );
    }

    object.voiceRead = true;
  };

  const speechAllMessagesAutomatic = () => {
    const messagesToSpeech = messages
      .filter(data => !data?.messageData.voiceRead && !data?.messageData.viewed)
      .map(data => data.messageData);
    speakMessage('', messagesToSpeech);
  };

  const verifyStorageSwitchRead = () => {
    const value = storage.getItem(STORAGE_KEYS.SWITCH_READ, 'boolean');
    setSwitchValue(value);
  };

  const handleSwitchRead = (value: boolean) => {
    storage.setItem(STORAGE_KEYS.SWITCH_READ, value, 'boolean');
    setSwitchValue(value);
  }

  const { isNearBottom, canScroll, onScroll, onLayout, onContentSizeChange } = useChatScrollPosition(scroll);
  const { showAutoReadCard, showScrollToBottom } = getChatOverlayVisibility({
    keyboardHeight,
    isNearBottom,
    canScroll,
    messagesCount: messages.length,
  });

  useEffect(() => {
    if (switchValue) {
      speechAllMessagesAutomatic();
    } else {
      Speech.stop();
    }
  }, [messages, switchValue]);

  return (
    <Container>
      <NavBar trip={trip} />
      {!loading ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'height' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? bottomInset + 8 : 0}
          enabled={Platform.OS === 'ios'}
        >
          {showAutoReadCard && (
            <AutoReadCard>
              <AutoReadToggle>
                <Switch value={switchValue} onValueChange={handleSwitchRead} />
              </AutoReadToggle>
            </AutoReadCard>
          )}
          <Content
            ref={scroll}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: keyboardHeight + footerHeight,
            }}
            onLayout={onLayout}
            onContentSizeChange={onContentSizeChange}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {messages.length > 0 && (
              <MessageList
                messages={messages}
                currentUserId={user.idUser}
                speakUnicMessage={speakUnicMessage}
                onFavoriteMessage={favoriteMessage}
              />
            )}
          </Content>

          {showScrollToBottom && (
            <ScrollToBottomButton
              offsetBottom={footerHeight + RFValue(16)}
              onPress={scrollToEndWhenOpeningKeyboard}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-down" size={20} color={theme.colors.primaryText} />
            </ScrollToBottomButton>
          )}

          <RNAnimated.View
            style={[
              footerLayoutStyles.wrapper,
              { transform: [{ translateY: keyboardTranslateY }], }
            ]}
          >
            <Footer
              tripReference={trip.tripReference}
              userId={user.idUser}
              quickMessages={quickMessages}
              scrollToEnd={scrollToEndWhenOpeningKeyboard}
              onLayoutChange={setFooterHeight}
            />
          </RNAnimated.View>
        </KeyboardAvoidingView>
      ) : (
        <LoadView />
      )
      }
    </Container >
  );
}
