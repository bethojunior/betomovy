import { useCallback, useState } from 'react';

export type MessageStatus = 'sending' | 'sent' | 'error';

export type TripChatMessageData = {
  id?: string;
  tripReference?: string;
  message?: string;
  userId?: string | number;
  date?: {
    seconds?: number;
  };
  viewed?: boolean;
  isAudio?: boolean;
  voiceRead?: boolean;
  [key: string]: unknown;
};

export type TripChatMessage = {
  id: string;
  type?: string;
  localId?: string;
  localStatus?: MessageStatus;
  messageData: TripChatMessageData;
};

export type OptimisticMessageInput = {
  tripReference: string;
  message: string;
  userId: string | number;
};

const getMessageSeconds = (message: TripChatMessage) =>
  Number(message.messageData?.date?.seconds || 0);

const sortMessagesByDate = (messages: TripChatMessage[]) =>
  [...messages].sort((current, next) => getMessageSeconds(current) - getMessageSeconds(next));

const isSameTextMessage = (current: TripChatMessage, next: TripChatMessage) =>
  !current.messageData?.isAudio &&
  !next.messageData?.isAudio &&
  String(current.messageData?.userId) === String(next.messageData?.userId) &&
  current.messageData?.message === next.messageData?.message;

const createLocalMessage = ({ tripReference, message, userId }: OptimisticMessageInput) => {
  const localId = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const seconds = Math.floor(Date.now() / 1000);

  return {
    id: localId,
    localId,
    localStatus: 'sending' as MessageStatus,
    type: 'added',
    messageData: {
      id: localId,
      tripReference,
      message,
      userId,
      date: { seconds },
      viewed: false,
      isAudio: false,
      voiceRead: true,
    },
  };
};

export function useOptimisticTripChatMessages() {
  const [messages, setMessages] = useState<TripChatMessage[]>([]);

  const addOptimisticMessage = useCallback((input: OptimisticMessageInput) => {
    const localMessage = createLocalMessage(input);
    setMessages(prevMessages => sortMessagesByDate([...prevMessages, localMessage]));
    return localMessage.localId;
  }, []);

  const applyRealtimeChanges = useCallback((currentMessages: TripChatMessage[]) => {
    setMessages(prevMessages => {
      let nextMessages = [...prevMessages];

      currentMessages.forEach(currentMessage => {
        if (currentMessage.type === 'added') {
          const existingMessageIndex = nextMessages.findIndex(message => message.id === currentMessage.id);

          if (existingMessageIndex >= 0) {
            nextMessages[existingMessageIndex] = currentMessage;
            return;
          }

          const optimisticMessageIndex = nextMessages.findIndex(message =>
            message.localStatus && isSameTextMessage(message, currentMessage),
          );

          if (optimisticMessageIndex >= 0) {
            const localDate = nextMessages[optimisticMessageIndex].messageData?.date;
            nextMessages[optimisticMessageIndex] = {
              ...currentMessage,
              messageData: {
                ...currentMessage.messageData,
                date: localDate,
              },
            };
            return;
          }

          nextMessages.push(currentMessage);
          return;
        }

        if (currentMessage.type === 'modified') {
          nextMessages = nextMessages.map(message =>
            message.id === currentMessage.id ? currentMessage : message,
          );
        }
      });

      return sortMessagesByDate(nextMessages);
    });
  }, []);

  const updateOptimisticStatus = useCallback((localId: string, localStatus: MessageStatus) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.localId === localId ? { ...message, localStatus } : message,
      ),
    );
  }, []);

  return {
    messages,
    setMessages,
    addOptimisticMessage,
    applyRealtimeChanges,
    updateOptimisticStatus,
  };
}
