import TripMessage from '../../components/TripMessage';
import type { DriverTripChatMessageListProps } from './types';

export function MessageList({
  messages,
  currentUserId,
  tripReference,
  speakUnicMessage,
  onRetryMessage,
  onFavoriteMessage,
}: DriverTripChatMessageListProps) {
  return messages
    .filter(msg => msg.messageData?.isAudio || (msg.messageData?.message && msg.messageData.message !== 'null'))
    .map(({ messageData, id, localStatus, localId }) => {
      const isCurrentUserMessage = messageData.userId == currentUserId;

      return (
        <TripMessage
          key={messageData?.id || id}
          message={messageData?.message}
          timeSendInSeconds={messageData?.date?.seconds}
          isAudio={messageData?.isAudio}
          reiceved={!isCurrentUserMessage}
          data={messageData}
          speakUnicMessage={speakUnicMessage}
          onFavoriteMessage={onFavoriteMessage}
          tripReference={tripReference}
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
