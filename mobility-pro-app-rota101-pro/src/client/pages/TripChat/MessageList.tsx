// @ts-nocheck
import TripMessage from '../../components/TripMessage';

export function MessageList({ messages, currentUserId, speakUnicMessage, onFavoriteMessage }) {
  return messages.map(({ messageData, id }, index) => {
    if (messageData.message === 'null') {
      return null;
    }

    if (messageData.userId == currentUserId) {
      return (
        <TripMessage
          key={String((messageData?.id || id) + index)}
          message={messageData.message}
          timeSendInSeconds={messageData.date.seconds}
          isAudio={messageData.isAudio}
          data={messageData}
          speakUnicMessage={speakUnicMessage}
          onFavoriteMessage={onFavoriteMessage}
        />
      );
    }

    return (
      <TripMessage
        key={String((messageData?.id || id) + index)}
        message={messageData.message}
        timeSendInSeconds={messageData.date.seconds}
        isAudio={messageData.isAudio}
        reiceved
        data={messageData}
        speakUnicMessage={speakUnicMessage}
      />
    );
  });
}
