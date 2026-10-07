import { useEffect, useState } from 'react';
import {
  InteractionManager,
} from 'react-native';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { TripChatSkeleton } from './TripChatSkeleton';
import {
  Container,
  InnerContainer,
  Content,
  MessagesContent,
  FooterContent,
  FooterInput,
  RecordingButton,
  RecordingButtonContainer,
  ArrowContainer,
  ArrowText,
  SendIconButton,
  AutoReadCard,
  ScrollToBottomButton,
  footerLayoutStyles,
} from './styles';
import { NavBar } from './NavBar';
import theme from '../../styles/theme';
import { useChatScrollPosition } from '../../../common/hooks/useChatScrollPosition';
import { AutoReadToggle } from '../../../common/components/AutoReadToggle';
import { Switch } from '../../components/Switch';
import { translate } from '../../locales';
import TripMessageView from '../../components/TripMessage/tripMessageView';
import { useTripChatFooter } from './useTripChatFooter';
import { useTripChatViewController } from './useTripChatViewController';
import { TripChatAudioLockControls } from '../../../common/components/TripChatAudioLockControls';
import type {
  TripChatFooterProps,
  TripChatMessageListProps,
  TripChatRoute,
} from './types';


export default function TripChatView({ route }: { route: TripChatRoute }) {
  const {
    user,
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
  } = useTripChatViewController(route);

  const [footerReady, setFooterReady] = useState(false);
  useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      setFooterReady(true);
    });
    return () => interaction.cancel();
  }, []);

  const showSkeleton = loading || !footerReady;

  const MANY_MESSAGES_THRESHOLD = 10;
  const { isNearBottom, onScroll, onContentSizeChange } = useChatScrollPosition(scroll);
  const showAutoReadCard = keyboardHeight === 0 && isNearBottom;
  const showScrollToBottom = !isNearBottom && messages.length > MANY_MESSAGES_THRESHOLD;

  return (
    <Container>
      {showSkeleton ? (
        <TripChatSkeleton />
      ) : (
        <>
          <NavBar trip={trip} />
          <InnerContainer keyboardOffset={keyboardHeight}>
            {showAutoReadCard && (
              <AutoReadCard>
                <AutoReadToggle>
                  <Switch value={switchValue} onValueChange={setSwitchValue} />
                </AutoReadToggle>
              </AutoReadCard>
            )}
            <Content
              ref={scroll}
              onContentSizeChange={onContentSizeChange}
              onScroll={onScroll}
              scrollEventThrottle={16}
            >
              <MessagesContent>
                <MessageList
                  messages={messages}
                  currentUserId={user.idUser}
                  trip={trip}
                  speakUnicMessage={speakUnicMessage}
                  onRetryMessage={sendTextMessage}
                />
              </MessagesContent>
            </Content>

            {showScrollToBottom && (
              <ScrollToBottomButton onPress={() => scrollToEnd()} activeOpacity={0.8}>
                <Ionicons name="arrow-down" size={20} color={theme.colors.primaryText} />
              </ScrollToBottomButton>
            )}

            <Footer
              tripReference={trip.tripReference}
              scrollToEnd={scrollToEnd}
              onSendMessage={sendTextMessage}
            />
          </InnerContainer>
        </>
      )}
    </Container>
  );
}

function MessageList({
  messages,
  currentUserId,
  trip,
  speakUnicMessage,
  onRetryMessage,
}: TripChatMessageListProps) {
  return messages
    .filter(msg => msg.messageData?.isAudio || (msg.messageData?.message && msg.messageData.message !== 'null'))
    .map(({ messageData, id, localStatus, localId }) => {
      const isCurrentUserMessage = messageData.userId == currentUserId;

      return (
        <TripMessageView
          key={messageData?.id || id}
          message={messageData.message}
          timeSendInSeconds={messageData.date?.seconds}
          isAudio={messageData.isAudio}
          reiceved={!isCurrentUserMessage}
          data={messageData}
          speakUnicMessage={speakUnicMessage}
          trip={trip}
          preview={localStatus === 'sending'}
          deliveryStatus={localStatus}
          onRetry={
            localStatus === 'error'
              ? () => onRetryMessage(messageData.message, localId)
              : undefined
          }
        />
      );
    });
}

function Footer({ tripReference, scrollToEnd, onSendMessage }: TripChatFooterProps) {
  const {
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
  } = useTripChatFooter({ tripReference, onSendMessage });

  const footerExitStyle = useAnimatedStyle(() => ({
    opacity: interpolate(lockProgress.value, [0, 1], [1, 0]),
  }));

  const cardEnterStyle = useAnimatedStyle(() => ({
    opacity: interpolate(lockProgress.value, [0, 1], [0, 1]),
  }));

  return (
    <>
      <Animated.View style={[footerLayoutStyles.arrowHint, arrowAnimatedStyle]}>
        <ArrowContainer>
          <Ionicons name="arrow-back" size={16} color="white" />
          <ArrowText>{translate('trip.chat.drag_to_lock')}</ArrowText>
        </ArrowContainer>
      </Animated.View>

      <FooterContent>
        <Animated.View style={[footerLayoutStyles.fill, footerExitStyle]} pointerEvents={isAudioLocked ? 'none' : 'auto'}>
          <FooterInput
            ref={inputRef}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={2}
            placeholder={
              loading
                ? translate('trip.chat.sending_audio')
                : recording
                  ? translate('trip.chat.recording', { time: recordTime })
                  : translate('trip.chat.placeholder')
            }
            onFocus={scrollToEnd}
          />
          {message ? (
            <SendIconButton onPress={sendMessage}>
              <MaterialIcon name="send" size={30} color={theme.colors.primary} />
            </SendIconButton>
          ) : (
            <RecordingButtonContainer recording={Boolean(recording)}>
              <GestureDetector gesture={recordingGesture}>
                <Animated.View style={animatedStyle}>
                  <RecordingButton recording={Boolean(recording)}>
                    <Ionicons
                      name="mic"
                      size={24}
                      color={theme.colors.primaryText}
                    />
                  </RecordingButton>
                </Animated.View>
              </GestureDetector>
            </RecordingButtonContainer>
          )}
        </Animated.View>

        <Animated.View
          style={[footerLayoutStyles.cardFill, cardEnterStyle]}
          pointerEvents={isAudioLocked ? 'auto' : 'none'}
        >
          <TripChatAudioLockControls
            recordTime={recordTime}
            onCancel={cancelLockedAudio}
            onSend={stopRecordingAndSend}
            sendDisabled={loading}
          />
        </Animated.View>
      </FooterContent>
    </>
  );
}
