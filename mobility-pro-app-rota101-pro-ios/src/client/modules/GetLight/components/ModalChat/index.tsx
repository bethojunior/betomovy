/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
// @ts-nocheck
import {useEffect, useMemo, useRef, useState} from 'react';
import RenderHtml from 'react-native-render-html';
import {
  Alert,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Text,
  View,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import {StorageAccessFramework} from 'expo-file-system';
import Iconicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Audio} from 'expo-av';
import base64 from 'react-native-base64';
import WebView from 'react-native-webview';
import * as Speech from 'expo-speech';
import {useTrip} from '../../../../contexts/Trip';
import {
  BackButton,
  ButtonMic,
  ButtonSend,
  ContainerAudio,
  ContainerChat,
  ContainerDetails,
  ContainerInput,
  ContainerModal,
  ContentChat,
  ContentSwitch,
  HeaderModal,
  Image,
  Input,
  Message,
  MessageContent,
  TextHeader,
  TypeMessage,
} from './styles';
import {ButtonIcon} from '../ButtonIcon';
import AppSocket from '../../../../services/socket';
import apiMain from '../../../../api/apiMain';
import {
  RecordingButton,
  RecordingButtonContainer,
  TrashIconContainer,
} from '../../../../pages/TripChat/styles';
import theme from '../../../../styles/theme';
import {If} from '../If';
import TripMessage from '../../../../components/TripMessage';
import {ShippingDateText} from '../../../../components/TripMessage/styles';
import {customToast} from '../../../../../utils/FlashMessage';
import {convertBase64ToBlob} from '../../../../utils/dicument';
import {translate} from '../../../../locales';
import {Switch} from '../../../../components/Switch';
import {useAuth} from '../../../../../context/auth';
import {useTripGL} from '../../../../contexts/TripGL';
import {MessageAudio} from '../MessageAudio';
import {ChatRealtime} from '../../../../services/realtime/ChatRealtime';
// eslint-disable-next-line @typescript-eslint/no-var-requires

interface Props {
  setVisible: (visibility: boolean) => void;
  visible: boolean;
}

export const ModalChat = ({setVisible, visible}: Props) => {
  const socket = useRef<any>(null);
  const scroll = useRef<any>(null);
  const {user} = useAuth();
  const {tripSchedule} = useTripGL();
  const [color, setColor] = useState(theme.colors.white);

  const [text, setText] = useState('');
  const [rate, setRate] = useState(0.75);
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState({});
  const [execSound, setExecSound] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [switchValue, setSwitchValue] = useState(true);
  const chatRealtime = useMemo(() => new ChatRealtime(), []);

  const INJECTED_JAVASCRIPT = `(function() {
    window.ReactNativeWebView.postMessage(JSON.stringify({key : "token", data: ${user.apiToken}}));
  })();`;

  const speakMessage = (message: string = null, object = null) => {
    object.map(data => {
      if (data.isAudio) {
        return (data.voiceRead = true);
      }
      if (data.userId == user.idUser) {
        return (data.voiceRead = true);
        Speech.speak(
          `${user?.nickname} ${translate('trip.said')} ${data.message}`,
          {
            language: 'pt-BR',
            // rate: rate,
          },
        );
      }
      Speech.speak(
        `${tripSchedule?.driver?.name} ${translate('trip.said')} ${
          data.message
        }`,
        {
          language: 'pt-BR',
          // rate: rate,
        },
      );

      data.voiceRead = true;
      data.voiceRead = true;
      if (!visible) {
        Alert.alert(
          'Nova mensagem',
          `${user?.nickname} ${translate('trip.said')} ${data.message}`,
          [
            {
              text: 'Ver',
              onPress: () => {
                setVisible(true);
              },
            },
            {
              text: 'Cancelar',
              onPress: () => {
                console.log('Cancel Pressed');
              },
            },
          ],
          {cancelable: false},
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
        `${tripSchedule?.driver?.name} ${translate('trip.said')} ${
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
      .filter(data => !data?.messageData.voiceRead)
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

  const changeVelocityMessage = (value: number) => {
    setRate(value);
  };

  useEffect(() => {
    if (tripSchedule) {
      chatRealtime.getCurrentMessages(
        tripSchedule?.tripReference,
        currentMessages => {
          currentMessages.map(currentMessage => {
            const messageExists = messages.find(
              message => message.id === currentMessage.id,
            );

            if (currentMessage.type === 'added') {
              if (
                currentMessage.userId !== user.idUser &&
                !currentMessage.viewed
              ) {
                chatRealtime.setViewMessage(
                  currentMessage.id,
                  tripSchedule?.tripReference,
                );
              }

              if (!messageExists) {
                setMessages(state => [...state, currentMessage]);
                setLoading(false);
              }
            }
          });
        },
      );
    }
  }, [tripSchedule]);

  const scrollToEndWhenOpeningKeyboard = () => {
    scroll.current.scrollToEnd({animated: true});
  };
  async function handleMessage(idUser: string, tripReference: string) {
    if (text !== '') {
      apiMain.post('ChatTrip/SendMessage', {
        stdObject: [{tripReference, message: text, userId: idUser}],
      });
      setText('');
    } else {
      customToast('error', 'Digite uma mensagem');
    }
  }
  // gravaction
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
  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const {sound, status} = await recording.createNewLoadedSoundAsync();
    setExecSound({
      duration: getDurationFormatted(10),
      sound,
    });
    setRecordings({
      sound: recording,
      duration: getDurationFormatted(10),
      file: recording.getURI(),
      // eslint-disable-next-line no-underscore-dangle
      extension: recording._options[Platform.OS].extension,
    });
  }

  function getDurationFormatted(duration: number) {
    const minutes = Math.floor(duration / 1000 / 60);
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines(recordingLine: any) {
    return (
      <View>
        <Text>Recording - {recordingLine.duration} </Text>
        <Button
          onPress={() => recordingLine.sound.replayAsync()}
          title="Play"
        />
      </View>
    );
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
          tripReference: tripSchedule.tripReference,
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

      apiMain
        .post('ChatTrip/SendMessageAudio', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .catch(error => console.log(JSON.stringify(error)));
    } catch (error) {
      console.log(error);
    }
  }

  const returnMessageWithSource = (message: any) => {
    const source = {
      html: `<div>${message}</div>`,
    };
    return (
      <RenderHtml
        contentWidth={Dimensions.get('window').width}
        source={source}
      />
    );
  };

  return (
    <Modal visible={visible} onDismiss={() => setVisible(false)}>
      {/* <ContainerModal>
        <HeaderModal>
          <BackButton onPress={() => setVisible(false)}>
            <Iconicons
              name="arrow-back"
              size={30}
              color={theme.colors.secondary}
            />
          </BackButton>
          <ContainerDetails>
            <Image source={{uri: tripSchedule?.driver.profilePicture}} />
            <TextHeader>{tripSchedule?.driver.name}</TextHeader>
          </ContainerDetails>
          <ButtonIcon
            onPress={() => Linking.openURL(`tel:${tripSchedule?.driver.phone}`)}
            icon={<Iconicons name="call" color="white" size={24} />}
          />
        </HeaderModal>
        <WebView
          style={{flex: 1, padding: 20}}
          // onMessage={event => {
          //   const data = JSON.parse(event.nativeEvent.data);
          //   alert('pedrinho');
          // }}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          source={{
            uri: `http://192.168.1.165:3000?tripReference=${tripSchedule.tripReference}&userId=${user.idUser}`,
          }}
        />
      </ContainerModal> */}

      <ContainerModal behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <HeaderModal>
          <BackButton onPress={() => setVisible(false)}>
            <Iconicons
              name="arrow-back"
              size={30}
              color={theme.colors.secondary}
            />
          </BackButton>
          <ContainerDetails>
            <Image source={{uri: tripSchedule?.driver.profilePicture}} />
            <TextHeader>{tripSchedule?.driver.name.split(' ')[0]}</TextHeader>
          </ContainerDetails>
          <ButtonIcon
            onPress={() => Linking.openURL(`tel:${tripSchedule?.driver.phone}`)}
            icon={<Iconicons name="call" color="white" size={24} />}
          />
        </HeaderModal>
        <ContainerChat>
          <ContentSwitch>
            <Text>{translate('trip.automatically_read_all_messages')}</Text>
            <Switch value={switchValue} onValueChange={setSwitchValue} />
          </ContentSwitch>
          <ContentChat
            ref={scroll}
            onContentSizeChange={() =>
              scroll.current.scrollToEnd({animated: true})
            }
          >
            {messages.length > 0 &&
              messages.map((data, index) => (
                <MessageContent
                  key={index}
                  type={data.messageData.userId == user.idUser}
                >
                  <ContainerAudio>
                    <ShippingDate
                      messageReceived
                      timeSendInSeconds={data.messageData.date.seconds}
                    />
                    <If condition={!data.messageData.isAudio}>
                      <If condition={data.messageData.userId != user.idUser}>
                        <ButtonSend
                          onPress={() => {
                            if (!data.messageData.isAudio) {
                              Speech.isSpeakingAsync().then(
                                async isSpeaking => {
                                  if (isSpeaking) {
                                    await Speech.stop();
                                  } else {
                                    speakUnicMessage(
                                      data.messageData.message,
                                      data.messageData,
                                      user.idUser != data.messageData.userId,
                                    );
                                  }
                                },
                              );
                            }
                          }}
                        >
                          <Iconicons
                            name="volume-high"
                            size={20}
                            color={color}
                          />
                        </ButtonSend>
                      </If>
                    </If>
                  </ContainerAudio>

                  <TypeMessage>
                    {data.messageData.userId == user.idUser
                      ? translate('schedule.chat_you')
                      : translate('schedule.chat_job')}
                  </TypeMessage>
                  {data.messageData.isAudio ? (
                    <>
                      <MessageAudio
                        messageData={data?.messageData}
                        isAudio
                        message={data.messageData.message || ''}
                      />
                    </>
                  ) : (
                    <>
                      <Message type>
                        {returnMessageWithSource(data.messageData.message)}
                      </Message>
                    </>
                  )}
                  <If condition={data.messageData.message?.voiceRead}>
                    <Iconicons
                      style={{marginLeft: 'auto'}}
                      name="volume-high"
                      size={15}
                      color={theme.colors.primary}
                    />
                  </If>
                </MessageContent>
              ))}
          </ContentChat>
          <ContainerInput>
            <If condition={Object.keys(recordings).length === 0}>
              <Input
                placeholder={translate('trip.enter_your_message')}
                onChangeText={e => setText(e)}
                value={text}
                multiline
              />
            </If>
            {Object.keys(recordings).length > 0 && getRecordingLines(execSound)}
            <ButtonSend
              activeOpacity={0.8}
              onPress={() => {
                handleMessage(user.idUser, tripSchedule?.tripReference);
              }}
            >
              <Iconicons
                name="send"
                size={24}
                color={theme.colors.primaryText}
              />
            </ButtonSend>
            <RecordingButtonContainer recording={Boolean(recording)}>
              {Boolean(recording) && (
                <TrashIconContainer>
                  <Iconicons name="trash-bin" size={20} color="white" />
                </TrashIconContainer>
              )}

              <ButtonMic
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
                <Iconicons
                  name="md-mic"
                  size={24}
                  color={
                    recording
                      ? `${theme.colors.primaryText}`
                      : `${theme.colors.primary}`
                  }
                />
              </ButtonMic>
            </RecordingButtonContainer>
          </ContainerInput>
        </ContainerChat>
      </ContainerModal>
    </Modal>
  );
};

function ShippingDate({timeSendInSeconds, messageReceived}) {
  const shippingDate = new Date();

  shippingDate.setTime(timeSendInSeconds * 1000);

  return (
    <ShippingDateText messageReceived={messageReceived}>
      {shippingDate.toLocaleTimeString()}
    </ShippingDateText>
  );
}
