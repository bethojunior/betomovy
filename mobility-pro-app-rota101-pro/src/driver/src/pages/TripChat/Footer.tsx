import { ActivityIndicator, View, type LayoutChangeEvent } from 'react-native';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import {
  FooterContent,
  FooterInput,
  RecordingButton,
  RecordingButtonContainer,
  SendIconButton,
  footerLayoutStyles,
} from './styles';
import theme from '../../styles/theme';
import { translate } from '../../../../client/locales';
import { TripChatAudioLockControls } from '../../../../common/components/TripChatAudioLockControls';
import { QuickMessagesRow } from '../../../../common/components/QuickMessagesRow';
import { DragToLockHint } from '../../../../common/components/DragToLockHint';
import { useDriverTripChatFooter } from './useDriverTripChatFooter';
import type { DriverTripChatFooterProps } from './types';

export function Footer({
  tripReference,
  userId: userIdProp,
  quickMessages,
  scrollToEnd,
  onSendMessage,
  onLayoutChange,
}: DriverTripChatFooterProps) {
  const {
    message,
    inputRef,
    setMessage,
    recording,
    isSendingAudio,
    isSendingMessage,
    recordTime,
    isAudioLocked,
    lockProgress,
    animatedStyle,
    arrowAnimatedStyle,
    recordingGesture,
    sendMessage,
    stopRecordingAndSend,
    cancelLockedAudio,
  } = useDriverTripChatFooter({
    tripReference,
    userId: userIdProp,
    scrollToEnd,
    onSendMessage,
  });

  const footerExitStyle = useAnimatedStyle(() => ({
    opacity: interpolate(lockProgress.value, [0, 1], [1, 0]),
  }));

  const cardEnterStyle = useAnimatedStyle(() => ({
    opacity: interpolate(lockProgress.value, [0, 1], [0, 1]),
  }));

  // Mede o bloco de altura variável (chips + input) pra posicionar o botão
  // de "voltar ao fim" sempre acima dele, em vez de um offset fixo que quebra
  // quando o número de chips muda (favoritas entram/saem).
  const handleLayout = (event: LayoutChangeEvent) => {
    onLayoutChange?.(event.nativeEvent.layout.height);
  };

  return (
    <>
      <View onLayout={handleLayout}>
        {!recording && !isAudioLocked && (
          <QuickMessagesRow messages={quickMessages} onSelect={sendMessage} />
        )}

        <FooterContent>
          <Animated.View style={[footerLayoutStyles.fill, footerExitStyle]} pointerEvents={isAudioLocked ? 'none' : 'auto'}>
            <FooterInput
              ref={inputRef}
              value={message}
              onChangeText={setMessage}
              multiline
              placeholder={
                isSendingMessage
                  ? translate('trip.chat.sending_message')
                  : isSendingAudio
                    ? translate('trip.chat.sending_audio')
                    : recording
                      ? translate('trip.chat.recording', { time: recordTime })
                      : translate('trip.chat.placeholder')
              }
              editable={!isSendingMessage}
              placeholderTextColor="#000"
              onFocus={scrollToEnd}
            />

            {message.trim().length > 0 ? (
              <SendIconButton onPress={() => sendMessage(message)}>
                <MaterialIcon name="send" size={30} color={theme.colors.primary} />
              </SendIconButton>
            ) : (
              <RecordingButtonContainer recording={Boolean(recording)}>
                <GestureDetector gesture={recordingGesture}>
                  <Animated.View style={animatedStyle}>
                    <RecordingButton recording={Boolean(recording)}>
                      {isSendingAudio ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Ionicons
                          name={recording ? 'lock-open-outline' : 'mic'}
                          size={24}
                          color={theme.colors.primaryText}
                        />
                      )}
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
              sendDisabled={isSendingAudio}
            />
          </Animated.View>
        </FooterContent>
      </View>

      <DragToLockHint animatedStyle={arrowAnimatedStyle} />
    </>
  );
}
