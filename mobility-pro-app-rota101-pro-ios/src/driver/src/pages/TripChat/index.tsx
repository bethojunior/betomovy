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
import TripMessage from '../../components/TripMessage';
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
  ContentSwitch,
  ContainerBaseBoard,
} from './styles';

import theme from '../../styles/theme';
import {TextEdit} from '../../components/TextEdit';
import {ButtonIcon} from '../../components/ButtonIcon';
import {useTripProvider} from '../../context/Trip';
import {useUserDriver} from '../../context/userDriver';
import LoadView from '../../components/LoadView';
import {Switch} from '../../components/Switch';
import apiMain from '../../api/apiMain';
import {CardBoard} from '../../components/CardBoard';
import {IfLoaderInsideScreen} from '../../components/IfLoaderInsideScreen';
import {translate} from '../../../../client/locales';
import {ChatRealtime} from '../../service/realtime/ChatRealtime';
import {If} from '../../components/If';
import {useAuth} from '../../../../context/auth';

export default function TripChat({route}) {
  const {userDriverFind: user} = useUserDriver();
  const scroll = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switchValue, setSwitchValue] = useState(false);
  const [monitoring, setMonitoring] = useState(false);
  const chatRealtime = useMemo(() => new ChatRealtime(), []);
  const {generalSettings} = useAuth();

  const {trip} = route.params;

  const {navigate} = useNavigation();

  const scrollToEndWhenOpeningKeyboard = () => {
    scroll.current.scrollToEnd({animated: true});
  };

  const getFirstName = (name: string) => {
    return !name ? '' : name.split(' ')[0];
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
            Number(user?.userId) &&
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
          Number(currentMessage.userId) !== Number(user.userId) &&
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

  const verifyStorageSwitchRead = async () => {
    (await AsyncStorage.getItem('switchRead-driver')) === 'true' &&
      setSwitchValue(true);
  };

  useEffect(() => {
    Audio.requestPermissionsAsync();
    verifyStorageSwitchRead();

    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }, []);

  const speakMessage = (message: string = null, object = null) => {
    object.map(data => {
      if (data.userId == user.userId) {
        return (data.voiceRead = true);
      }
      if (data.message?.includes('<b>')) {
        data.voiceRead = true;
        return;
      }
      if (data?.isAudio) {
        return (data.voiceRead = true);
      }
      if (data.message !== 'null') {
        Speech.speak(
          `${getFirstName(trip?.customer?.name)} ${translate('trip.said')} ${
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
    if (object.message?.includes('<b>')) {
      object.voiceRead = true;
      return;
    }
    if (!received) {
      Speech.speak(
        `${user?.nickname} ${translate('trip.said')} ${object.message}`,
        {
          language: 'pt-BR',
          // rate: rate,
        },
      );
    }
    if (received) {
      Speech.speak(
        `${getFirstName(trip?.customer?.name)} ${translate('trip.said')} ${
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
  useEffect(() => {
    if (switchValue) {
      speechAllMessagesAutomatic();
    } else {
      Speech.stop();
    }
  }, [messages, switchValue]);

  useEffect(() => {
    if (switchValue) {
      AsyncStorage.setItem('switchRead-driver', 'true');
    } else {
      AsyncStorage.setItem('switchRead-driver', 'false');
    }
  }, [switchValue]);

  return (
    <Container>
      <NavBar trip={trip} />
      {!loading ? (
        <>
          <ContentSwitch>
            <TextEdit color={theme.colors.secondary}>
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
                if (messageData.userId == user.userId)
                  return (
                    <TripMessage
                      key={messageData?.id || id}
                      message={messageData?.message}
                      timeSendInSeconds={messageData?.date?.seconds}
                      isAudio={messageData?.isAudio}
                      data={messageData}
                      reiceved={false}
                      preview={undefined}
                      speakUnicMessage={speakUnicMessage}
                      setMonitoring={setMonitoring}
                      tripReference={trip.tripReference}
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
                    preview={undefined}
                    setMonitoring={setMonitoring}
                    tripReference={trip.tripReference}
                  />
                );
              })}
          </Content>
          <Footer
            tripReference={trip.tripReference}
            userId={user.userId}
            scrollToEnd={scrollToEndWhenOpeningKeyboard}
            monitoring={monitoring}
            setMonitoring={setMonitoring}
            setMessagesChat={setMessages}
          />
        </>
      ) : (
        <LoadView />
      )}
    </Container>
  );
}

function NavBar({trip}) {
  const navigation = useNavigation();
  const {cityConfig} = useAuth();

  return (
    <NavBarContent>
      <GoBackButton
        onPress={() => {
          navigation.navigate('Home', {
            visible: true,
          });
        }}
      >
        <Ionicons
          name="ios-arrow-back"
          size={30}
          color={theme.colors.primary}
        />
      </GoBackButton>
      <View>
        <NavBarTitle>{trip?.customer?.nickname}</NavBarTitle>
      </View>
      <ContainerButtonCall>
        <If condition={cityConfig?.enableCallInChat !== '0'}>
          <ButtonIcon
            onPress={() => Linking.openURL(`tel:${trip?.customer?.phone}`)}
            icon={<Ionicons name="call" color="white" size={20} />}
          />
        </If>
      </ContainerButtonCall>
    </NavBarContent>
  );
}

function Footer({
  tripReference,
  userId,
  scrollToEnd,
  monitoring,
  setMonitoring,
  setMessagesChat,
}) {
  const [message, setMessage] = useState('');
  const [recording, setRecording] = useState<any>();
  const [recordTime, setRecordTime] = useState(0);
  const recordingScale = useSharedValue(1);
  const [loading, setLoading] = useState(false);
  const {stateTrip} = useTripProvider();
  const {tripAccepted: trip} = stateTrip;
  const {userDriverFind: user} = useUserDriver();

  async function handleMessage(message) {
    if (message.trim().length > 0) {
      await AsyncStorage.setItem('lastMessageSended', message);
      setLoading(true);
      // setMessagesChat(state => [
      //   ...state,
      //   {
      //     messageData: {
      //       message,
      //       date: new Date(),
      //       userId,
      //       tripReference,
      //       viewed: false,
      //       isAudio: false,
      //     },
      //   },
      // ]);
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
      const filename = uri.split('/').pop().split(extensionFile)[0];
      const formData = new FormData();

      formData.append(
        'chatTrip',
        JSON.stringify({
          tripReference,
          userId: user.userId,
        }),
      );
      formData.append(
        'audio',
        {
          // @ts-ignore
          uri,
          name: `mp3`,
          type: 'audio/mpeg',
        },
        filename,
      );
      setLoading(true);
      await apiMain
        .post('ChatTrip/SendMessageAudio', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {})
        .catch(error => console.log(JSON.stringify(error)));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  const [savedMessages, setSavedMessages] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const savedMessages = await AsyncStorage.getItem('savedMessages');
      if (savedMessages) {
        setSavedMessages(JSON.parse(savedMessages));
      }
      setMonitoring(false);
    })();
  }, [monitoring]);

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
    <>
      <ContainerBaseBoard>
        {savedMessages.length > 0 &&
          savedMessages.map((item, index) => {
            return (
              <CardBoard
                key={index}
                onPress={() => handleMessage(item?.message)}
                text={item?.message}
              />
            );
          })}
      </ContainerBaseBoard>
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
                handleMessage(message);
              }}
            >
              <MaterialIcon
                name="send"
                size={30}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          ) : (
            // @ts-ignore
            <RecordingButtonContainer recording={Boolean(recording)}>
              {Boolean(recording) && (
                <TrashIconContainer>
                  <Ionicons name="trash-bin" size={20} color="red" />
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
                  // @ts-ignore
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
    </>
  );
}
