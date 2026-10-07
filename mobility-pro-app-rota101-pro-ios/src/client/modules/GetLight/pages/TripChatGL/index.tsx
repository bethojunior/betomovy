/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
// @ts-nocheck

import {useRef, useEffect, useState, useMemo} from 'react';
import {View, TouchableOpacity, Platform, Linking} from 'react-native';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {Audio} from 'expo-av';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiMain from '../../../../api/apiMain';
import LoadView from '../../../../components/LoadView';
import TripMessage from '../../../../components/TripMessage';
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
import {useAuth} from '../../../../../context/auth';
import {ContentSwitch} from '../../components/ModalChat/styles';
import {ButtonIcon} from '../../components/ButtonIcon';
import theme from '../../../../styles/theme';
import {TextEdit} from '../../../../components/TextEdit';
import {Switch} from '../../../../components/Switch';
import {translate} from '../../../../locales';
import {useTripGL} from '../../../../contexts/TripGL';
import {ChatRealtime} from '../../../../services/realtime/ChatRealtime';

export default function TripChat() {
  const {user} = useAuth();
  const {tripSchedule} = useTripGL();
  const scroll = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switchValue, setSwitchValue] = useState(true);
  const chatRealtime = useMemo(() => new ChatRealtime(), []);

  const scrollToEndWhenOpeningKeyboard = () => {
    scroll.current.scrollToEnd({animated: true});
  };

  useEffect(() => {
    if (switchValue) {
      speechAllMessagesAutomatic();
    } else {
      Speech.stop();
    }
  }, [messages, switchValue]);

  useEffect(() => {
    chatRealtime.getCurrentMessages(
      tripSchedule.tripReference,
      currentMessages => {
        currentMessages.map(currentMessage => {
          const messageExists = messages.find(
            message => message.id === currentMessage.id,
          );

          if (currentMessage.type === 'added') {
            if (
              currentMessage.userId != user.idUser &&
              !currentMessage.viewed
            ) {
              chatRealtime.setViewMessage(
                currentMessage.id,
                tripSchedule.tripReference,
              );
            }

            if (!messageExists) {
              setMessages(state => [...state, currentMessage]);
              setLoading(false);
              speechAllMessagesAutomatic();
            }
          }
        });
        setLoading(false);
      },
    );
  }, [tripSchedule]);

  useEffect(() => {
    Audio.requestPermissionsAsync();
    verifyStorageSwitchRead();
  }, []);

  const speakMessage = (message: string = null, object = null) => {
    object.map(data => {
      if (data.userId == user.idUser) {
        return;
      }
      Speech.speak(`${tripSchedule?.driver?.name} falou ${data.message}`, {
        language: 'pt-BR',
        // rate: rate,
      });

      data.voiceRead = true;

      // setMessages(state => [...state, data]);
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
      .filter(data => !data?.messageData.voiceRead && !data?.messageData.viewed)
      .map(data => data.messageData);
    speakMessage('', messagesToSpeech);
  };
  const verifyStorageSwitchRead = async () => {
    (await AsyncStorage.getItem('switchRead')) === 'true' &&
      setSwitchValue(true);
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
                if (messageData.userId == user.idUser)
                  return (
                    <TripMessage
                      key={id}
                      message={messageData.message}
                      timeSendInSeconds={messageData.date.seconds}
                      isAudio={messageData.isAudio}
                      data={messageData}
                      speakUnicMessage={speakUnicMessage}
                    />
                  );

                return (
                  <TripMessage
                    key={id}
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
            tripReference={tripSchedule.tripReference}
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
  const {tripSchedule} = useTripGL();
  const navigation = useNavigation();

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
        <NavBarTitle>{tripSchedule?.driver?.nickname}</NavBarTitle>
      </View>
      <ContainerButtonCall>
        <ButtonIcon
          onPress={() => Linking.openURL(`tel:${tripSchedule?.driver.phone}`)}
          icon={<Ionicons name="call" color="white" size={20} />}
        />
      </ContainerButtonCall>
    </NavBarContent>
  );
}

function Footer({tripReference, userId, scrollToEnd}) {
  const [message, setMessage] = useState('');
  const [recording, setRecording] = useState();
  const {tripSchedule} = useTripGL();
  const {user} = useAuth();

  async function handleMessage() {
    if (message.trim().length > 0) {
      apiMain.post('ChatTrip/SendMessage', {
        stdObject: [{tripReference, message, userId}],
      });
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

  return (
    <FooterContent>
      <FooterInput
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={2}
        placeholder="Digite algo"
        onFocus={scrollToEnd}
      />

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
              <Ionicons name="trash-bin" size={20} color="white" />
            </TrashIconContainer>
          )}

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
                  ? `${theme.colors.background_global}`
                  : `${theme.colors.secondary}`
              }
            />
          </RecordingButton>
        </RecordingButtonContainer>
      )}
    </FooterContent>
  );
}
