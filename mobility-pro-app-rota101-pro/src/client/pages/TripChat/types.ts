import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { ScrollView } from 'react-native';
import type { TripChatMessage, TripChatMessageData } from '../../../common/hooks/useOptimisticTripChatMessages';

export interface TripChatRoute {
  params?: TripChatTrip;
}

export interface TripChatUser {
  idUser?: string | number;
  nickname?: string;
  [key: string]: unknown;
}

export interface TripChatTrip {
  tripReference: string;
  status?: string;
  driver?: {
    idDriver?: number | string;
    name?: string;
    nickname?: string;
    phone?: string;
    profileImage?: string | null;
    driverRating?: number | string | null;
    car?: {
      brand?: string;
      model?: string;
      color?: string;
      plate?: string;
    };
  };
}

export interface SendTextMessage {
  (message: string, retryLocalId?: string): Promise<void> | void;
}

export interface SpeakTripMessage {
  (message?: string, object?: TripChatMessageData, received?: boolean): void;
}

export interface TripChatViewController {
  user: TripChatUser;
  trip: TripChatTrip;
  scroll: RefObject<ScrollView>;
  loading: boolean;
  messages: TripChatMessage[];
  switchValue: boolean;
  setSwitchValue: Dispatch<SetStateAction<boolean>>;
  keyboardHeight: number;
  scrollToEnd: (delay?: number) => void;
  sendTextMessage: SendTextMessage;
  speakUnicMessage: SpeakTripMessage;
}

export interface TripChatFooterParams {
  tripReference: string;
  onSendMessage: SendTextMessage;
}

export interface TripChatFooterProps extends TripChatFooterParams {
  scrollToEnd: (delay?: number) => void;
}

export interface TripChatMessageListProps {
  messages: TripChatMessage[];
  currentUserId?: string | number;
  trip: TripChatTrip;
  speakUnicMessage: SpeakTripMessage;
  onRetryMessage: SendTextMessage;
}
