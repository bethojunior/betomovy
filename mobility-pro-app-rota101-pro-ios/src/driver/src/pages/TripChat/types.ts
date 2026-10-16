import type { RefObject } from 'react';
import type { ScrollView } from 'react-native';
import type { TripChatMessage, TripChatMessageData } from '../../../../common/hooks/useOptimisticTripChatMessages';
import type { QuickMessage } from '../../../../common/hooks/quickMessages';

export interface DriverTripChatRoute {
  params: {
    trip: DriverTripChatTrip;
  };
}

export interface DriverTripChatUser {
  userId: string | number;
  idUser?: string | number;
  nickname?: string;
}

export interface DriverTripChatTrip {
  tripReference: string;
  status?: string;
  customer?: {
    name?: string;
    nickname?: string;
    phone?: string;
    profileImage?: string | null;
    rating?: number | string | null;
    quantityTrips?: number | null;
  };
}

export interface SendDriverTextMessage {
  (message: string, retryLocalId?: string): Promise<void> | void;
}

export interface SpeakDriverTripMessage {
  (message?: string, object?: TripChatMessageData, received?: boolean): void;
}

export interface DriverTripChatController {
  user: DriverTripChatUser;
  trip: DriverTripChatTrip;
  scroll: RefObject<ScrollView>;
  loading: boolean;
  messages: TripChatMessage[];
  switchValue: boolean;
  setSwitchValue: (value: boolean) => void;
  keyboardHeight: number;
  scrollToEnd: (delay?: number) => void;
  sendTextMessage: SendDriverTextMessage;
  speakUnicMessage: SpeakDriverTripMessage;
}

export interface DriverTripChatFooterParams {
  tripReference: string;
  userId: string | number;
  scrollToEnd: () => void;
  onSendMessage: SendDriverTextMessage;
}

export interface DriverTripChatFooterProps extends DriverTripChatFooterParams {
  quickMessages: QuickMessage[];
  onLayoutChange?: (height: number) => void;
}

export interface DriverTripChatMessageListProps {
  messages: TripChatMessage[];
  currentUserId: string | number;
  tripReference: string;
  speakUnicMessage: SpeakDriverTripMessage;
  onRetryMessage: SendDriverTextMessage;
  onFavoriteMessage: (message: string) => Promise<void>;
}
