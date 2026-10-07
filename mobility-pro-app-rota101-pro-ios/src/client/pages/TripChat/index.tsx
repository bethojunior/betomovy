/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
// @ts-nocheck

import {useRef, useEffect, useState, useMemo} from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  Linking,
  BackHandler,
} from 'react-native';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import {Ionicons} from '@expo/vector-icons';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Audio} from 'expo-av';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {RFValue} from 'react-native-responsive-fontsize';
import apiMain from '../../api/apiMain';
import LoadView from '../../components/LoadView';
import {useTrip} from '../../contexts/Trip';
import TripMessage from '../../components/TripMessage';
import {IfLoaderInsideScreen} from '../../components/IfLoaderInsideScreen';
import {
  Container,
  ContainerButtonCall,
  Content,
  FooterContent,
  FooterInput,
  GoBackButton,
  NavBarContent,
  NavBarTitle,
  RecordingButton,
  RecordingButtonContainer,
  TrashIconContainer,
} from './styles';
import {useAuth} from '../../../context/auth';
import {ContentSwitch} from '../../modules/GetLight/components/ModalChat/styles';
import {ButtonIcon} from '../../modules/GetLight/components/ButtonIcon';
import theme from '../../styles/theme';
import {TextEdit} from '../../components/TextEdit';
import {Switch} from '../../components/Switch';
import {translate} from '../../locales';
import {ChatRealtime} from '../../services/realtime/ChatRealtime';
import {If} from '../../components/If';

export default function TripChat() {
  const {user, generalSettings} = useAuth();
  const {stateTripCustomer} = useTrip();
  const {trip} = stateTripCustomer;
  const scroll = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switchValue, setSwitchValue] = useState(true);
  const chatRealtime = useMemo(() => new ChatRealtime(), []);

  const {navigate} = useNavigation();

  const scrollToEndWhenOpeningKeyboard = () => {
    scroll.current.scrollToEnd({animated: true});
  };

  const isFocused = useIsFocused();
  const isFocusedRef = useRef(isFocused);

  useEffect(() => {
    isFocusedRef.current = isFocused;
  }, [isFocused]);

  const socketEnabled = useRef(
    generalSettings?.find(item => item?.key === 'enable_realtime_socket'),
  );

  useEffect(() => {
    if (trip && Object.keys(trip).length > 0 && trip.tripReference) {
      if (trip.status === 'finished') {
        navigate('Trip');
      }
      if (Number(socketEnabled?.current?.value)) {
        handleChatRealtimeSocket();
      } else {
        handleChatMessageFirebase();
      }
    }
  }, []);

  const handleChatRealtimeSocket = () => {
    chatRealtime.getCurrentMessages(trip.tripReference, currentMessages => {
      const addedMessages = currentMessages.filter(
        message => message?.messageData?.type === 'added',
      );

      addedMessages.forEach(currentMessage => {
        if (
          isFocusedRef.current &&
          Number(currentMessage?.messageData?.userId) !==
            Number(user?.idUser) &&
          !currentMessage.viewed
        ) {
          chatRealtime.setViewMessage(
            currentMessage?.messageData?.id,
            trip.tripReference,
          );
        }
      });
      if (currentMessages?.length > 0) {
        setMessages([...currentMessages]);
      }

      setLoading(false);
    });
  };

  const handleChatMessageFirebase = () => {
    chatRealtime.getCurrentMessages(trip.tripReference, currentMessages => {
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
          chatRealtime.setViewMessage(currentMessage.id, trip.tripReference);
        }
        setMessages(prevMessages => [...prevMessages, currentMessage]);
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
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigate('Trip');
      return true;
    });
  }, []);

  const getFirstName = (name: string) => {
    return !name ? '' : name.split(' ')[0];
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
          `${getFirstName(trip?.driver?.name)} ${translate('trip.said')} ${
            data.message
          }`,
          {
            language: 'pt-BR',
            // rate: rate,
          },
        );

        data.voiceRead = true;

        // setMessages(state => [...state, data]);
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
        `${getFirstName(user?.nickname)} ${translate('trip.said')} ${
          object.message
        }`,
        {
          language: 'pt-BR',
          // rate: rate,
        },
      );
    }
    if (received) {
      Speech.speak(
        `${getFirstName(trip?.driver?.name)} ${translate('trip.said')} ${
          object.message
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
  const verifyStorageSwitchRead = async () => {
    const value = await AsyncStorage.getItem('switchRead');
    if (value || value === null) {
      setSwitchValue(true);
      return true;
    }
    setSwitchValue(false);
    return false;
  };
  useEffect(() => {
    if (switchValue) {
      speechAllMessagesAutomatic();
    } else {
      Speech.stop();
    }
  }, [messages, switchValue]);

  useEffect(() => {
    if (switchValue) {
      AsyncStorage.setItem('switchRead', 'true');
    } else {
      AsyncStorage.removeItem('switchRead');
    }
  }, [switchValue]);

  return (
    <Container>
      <NavBar />
      {!loading ? (
        <>
          <ContentSwitch>
            <TextEdit size="smalls" color={theme.colors.secondary}>
              {translate('trip.automatically_read_all_messages')}
            </TextEdit>
            <Switch value={switchValue} onValueChange={setSwitchValue} />
          </ContentSwitch>
          <Content
            ref={scroll}
            onContentSizeChange={() =>
              scroll.current.scrollToEnd({animated: true})
            }
          >
            {messages.length > 0 &&
              messages.map(({messageData, id}) => {
                if (messageData.message === 'null') {
                  return;
                }

                if (messageData.userId == user.idUser)
                  return (
                    <TripMessage
                      key={messageData?.id || id}
                      message={messageData.message}
                      timeSendInSeconds={messageData.date.seconds}
                      isAudio={messageData.isAudio}
                      data={messageData}
                      speakUnicMessage={speakUnicMessage}
                    />
                  );

                return (
                  <TripMessage
                    key={messageData?.id || id}
                    message={messageData.message}
                    timeSendInSeconds={messageData.date.seconds}
                    isAudio={messageData.isAudio}
                    reiceved
                    data={messageData}
                    speakUnicMessage={speakUnicMessage}
                  />
                );
              })}
          </Content>
          <Footer
            tripReference={trip.tripReference}
            userId={user.idUser}
            scrollToEnd={scrollToEndWhenOpeningKeyboard}
          />
        </>
      ) : (
        <LoadView />
      )}
    </Container>
  );
}

function NavBar() {
  const {stateTripCustomer} = useTrip();
  const {trip} = stateTripCustomer;
  const navigation = useNavigation();
  const {cityConfig} = useAuth();

  return (
    <NavBarContent>
      <GoBackButton
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Ionicons
          name="ios-arrow-back"
          size={30}
          color={theme.colors.primary}
        />
      </GoBackButton>
      <View>
        <NavBarTitle>{trip?.driver?.nickname}</NavBarTitle>
      </View>
      <ContainerButtonCall>
        <If condition={cityConfig?.enableCallInChat !== '0'}>
          <ButtonIcon
            onPress={() => Linking.openURL(`tel:${trip?.driver.phone}`)}
            icon={
              <Ionicons
                name="call"
                color={theme.colors.primaryText}
                size={20}
              />
            }
          />
        </If>
      </ContainerButtonCall>
    </NavBarContent>
  );
}

function Footer({tripReference, userId, scrollToEnd}) {
  const {stateTripCustomer} = useTrip();
  const {trip} = stateTripCustomer;
  const {user} = useAuth();

  const [message, setMessage] = useState('');
  const [recording, setRecording] = useState();
  const [recordTime, setRecordTime] = useState(0);
  const recordingScale = useSharedValue(1);
  const [loading, setLoading] = useState(false);

  async function handleMessage() {
    if (message.trim().length > 0) {
      setLoading(true);
      await apiMain.post('ChatTrip/SendMessage', {
        stdObject: [{tripReference, message, userId}],
      });
      setLoading(false);
      setMessage('');
    }
  }

  async function handleStartRecording() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const {ios, android} = Audio.RecordingOptionsPresets.HIGH_QUALITY;
      const {recording} = await Audio.Recording.createAsync({
        android,
        ios,
        web: {},
      });
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function handleStopRecordingAndSend() {
    try {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      const uri = await recording.getURI();
      const platform = Platform.OS;
      const extensionFile = recording._options[platform].extension;
      const fileName = uri.split('/').pop().split(extensionFile)[0];
      const formData = new FormData();
      formData.append(
        'chatTrip',
        JSON.stringify({
          tripReference: trip.tripReference,
          userId: user.idUser,
        }),
      );
      formData.append(
        'audio',
        {
          uri,
          name: `mp3`,
          type: 'audio/mpeg',
        },
        fileName,
      );
      setLoading(true);
      await apiMain
        .post('ChatTrip/SendMessageAudio', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .catch(error => console.log(JSON.stringify(error)));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    let interval;
    if (recording) {
      recordingScale.value = withSpring(1.2); // Spring animação para dar efeito de "pulsar"
      interval = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000); // Atualiza a cada segundo
    } else {
      recordingScale.value = withSpring(1); // Retorna ao tamanho original
      clearInterval(interval);
      setRecordTime(0);
    }

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, [recording]);

  const animatedStyle = useDerivedValue(() => {
    return {
      transform: [{scale: recordingScale.value}],
    };
  });

  return (
    <FooterContent>
      <FooterInput
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={2}
        placeholder={recording ? `Gravando... ${recordTime}s` : 'Digite algo'}
        onFocus={scrollToEnd}
      />
      <IfLoaderInsideScreen loading={loading}>
        {message ? (
          <TouchableOpacity
            onPress={() => {
              handleMessage();
            }}
          >
            <MaterialIcon name="send" size={30} color={theme.colors.primary} />
          </TouchableOpacity>
        ) : (
          <RecordingButtonContainer recording={Boolean(recording)}>
            {Boolean(recording) && (
              <TrashIconContainer>
                <Ionicons
                  name="trash-bin"
                  size={RFValue(15)}
                  color={theme.colors.primary}
                />
              </TrashIconContainer>
            )}
            <Animated.View style={animatedStyle.value}>
              <RecordingButton
                onPress={async () => {
                  const {granted} = await Audio.getPermissionsAsync();
                  if (!granted) {
                    Audio.requestPermissionsAsync();
                  }
                }}
                onLongPress={handleStartRecording}
                onPressOut={event => {
                  if (recording) {
                    if (
                      event.nativeEvent.changedTouches[0] ===
                      event.nativeEvent.touches[0]
                    ) {
                      setRecording(undefined);
                      recording.stopAndUnloadAsync();
                    } else {
                      handleStopRecordingAndSend();
                    }
                  }
                }}
                recording={Boolean(recording)}
              >
                <Ionicons
                  name="md-mic"
                  size={24}
                  color={
                    recording
                      ? `${theme.colors.red}`
                      : `${theme.colors.primaryText}`
                  }
                />
              </RecordingButton>
            </Animated.View>
          </RecordingButtonContainer>
        )}
      </IfLoaderInsideScreen>
    </FooterContent>
  );
}
