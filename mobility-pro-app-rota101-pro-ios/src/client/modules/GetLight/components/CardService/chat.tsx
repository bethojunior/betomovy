/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
// @ts-nocheck
import {useEffect, useMemo, useRef, useState} from 'react';
import {Button, Linking, Modal, Platform, Text, View} from 'react-native';
import Iconicons from '@expo/vector-icons/Ionicons';
import {Audio} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth, useAuth} from '../../../../../context/auth';
import {useTripGL} from '../../../../contexts/Trip';
import {
  BackButton,
  ButtonSend,
  ContainerChat,
  ContainerDetails,
  ContainerInput,
  ContainerModal,
  ContentChat,
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
import {MessageAudio} from '../MessageAudio';
import {customToast} from '../../../../../utils/FlashMessage';
import {convertBase64ToBlob} from '../../../../utils/dicument';
import {translate} from '../../../../locales';
import {TripRealtime} from '../../../../services/realtime/TripRealtime';
import {ChatRealtime} from '../../../../services/realtime/ChatRealtime';
// eslint-disable-next-line @typescript-eslint/no-var-requires

interface Props {
  setVisible: (visibility: boolean) => void;
  visible: boolean;
  referenceTrip: string;
}

export const ModalChatService = ({
  setVisible,
  visible,
  referenceTrip,
}: Props) => {
  const socket = useRef<any>(null);
  const scroll = useRef<any>(null);
  const {user} = useAuth();
  const {tripSchedule} = useTripGL();

  const [text, setText] = useState('');
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState({});
  const [execSound, setExecSound] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailsTrip, setDetailsTrip] = useState({});
  const tripRealtime = useMemo(() => new TripRealtime(), []);
  const chatRealtime = useMemo(() => new ChatRealtime(), []);

  const INJECTED_JAVASCRIPT = `(function() {
    window.ReactNativeWebView.postMessage(JSON.stringify({key : "token", data: ${user.apiToken}}));
  })();`;

  useEffect(() => {
    if (referenceTrip) {
      chatRealtime.getCurrentMessages(referenceTrip, currentMessages => {
        currentMessages.map(currentMessage => {
          const messageExists = messages.find(
            message => message.id === currentMessage.id,
          );

          if (currentMessage.type === 'added') {
            if (
              currentMessage.userId !== user.idUser &&
              !currentMessage.viewed
            ) {
              chatRealtime.setViewMessage(currentMessage.id, referenceTrip);
            }

            if (!messageExists) {
              setMessages(state => [...state, currentMessage]);
              setLoading(false);
            }
          }
        });
      });
    }
  }, [referenceTrip, detailsTrip]);

  useEffect(() => {
    tripCurrent();
  }, [referenceTrip]);

  const tripCurrent = async () => {
    tripRealtime.getTrip(referenceTrip, (trip, type) => {
      setDetailsTrip(trip);
    });
  };

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
      const permissionsApp = JSON.parse(
        await AsyncStorage.getItem('permissions'),
      );
      const permission = await Audio.getPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const {recording} = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
        );
        setRecording(recording);
        console.log(recording);
        permissionsApp.audio = permission.status === 'granted';
        await AsyncStorage.setItem(
          'permissions',
          JSON.stringify(permissionsApp),
        );
      } else {
        customToast('Você precisa permitir o acesso ao microfone', 'error');
      }
      // eslint-disable-next-line @typescript-eslint/no-shadow

      // const {sound} = await Audio.Sound.createAsync(recording.getURI());
      // console.log('Playing Sound');
      // await sound.playAsync();
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
      // eslint-disable-next-line no-underscore-dangle
      const extensionFile = recording._options[platform].extension;
      const fileName = uri.split('/').pop().split(extensionFile)[0];
      const formData = new FormData();
      // const blob = await new Promise((resolve, reject) => {
      //   const xhr = new XMLHttpRequest();
      //   xhr.onload = () => {
      //     try {
      //       resolve(xhr.response);
      //     } catch (error) {
      //       console.log('error:', error);
      //     }
      //   };
      //   xhr.onerror = e => {
      //     console.log(e);
      //     reject(new TypeError('Network request failed'));
      //   };
      //   xhr.responseType = 'blob';
      //   xhr.open('GET', uri, true);
      //   xhr.send(null);
      // });
      // transform file in Blob with new Blob
      // const blob = uri.blob();
      // console.log(blob, 'blob');

      // formData.append(
      //   'chatTrip',
      //   JSON.stringify({
      //     tripReference: tripSchedule.tripReference,
      //     userId: user.idUser,
      //   }),
      // );
      // formData.append('audio', blob, fileName);

      // apiMain
      //   .post('ChatTrip/SendMessageAudio', formData)
      //   .then((response: any) => console.log(response))
      //   .catch(error => console.log(JSON.stringify(error)));
    } catch (error) {
      console.log(error);
    }
  }

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
            {detailsTrip ? (
              <Image source={{uri: detailsTrip?.driver.profilePicture}} />
            ) : (
              ''
            )}
            <TextHeader>
              {detailsTrip ? detailsTrip?.driver.name.split(' ')[0] : ''}
            </TextHeader>
          </ContainerDetails>
          <ButtonIcon
            onPress={() => Linking.openURL(`tel:${detailsTrip?.driver.phone}`)}
            icon={<Iconicons name="call" color="white" size={24} />}
          />
        </HeaderModal>
        <ContainerChat>
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
                  <ShippingDate
                    messageReceived
                    timeSendInSeconds={data.messageData.date.seconds}
                  />
                  <TypeMessage>
                    {data.messageData.userId == user.idUser
                      ? translate('schedule.chat_you')
                      : translate('schedule.chat_job')}
                  </TypeMessage>
                  {data.messageData.isAudio ? (
                    <>
                      <MessageAudio
                        isAudio
                        message={data.messageData.message || ''}
                      />
                    </>
                  ) : (
                    <Message type>{data.messageData.message}</Message>
                  )}
                </MessageContent>
              ))}
          </ContentChat>
          <ContainerInput>
            <If condition={Object.keys(recordings).length === 0}>
              <Input
                placeholder="Digite sua mensagem"
                onChangeText={e => setText(e)}
                value={text}
                multiline
              />
            </If>
            {Object.keys(recordings).length > 0 && getRecordingLines(execSound)}
            <ButtonSend
              activeOpacity={0.8}
              onPress={() => {
                handleMessage(user.idUser, referenceTrip);
              }}
            >
              <Iconicons name="send" size={24} color={theme.colors.white} />
            </ButtonSend>
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
