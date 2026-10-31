export interface ChatBotTripTypeRef {
  id: number;
  name: string;
}

export interface ChatBotTripProps {
  chatBotTripTypeId: number;
  chatBotTripType?: ChatBotTripTypeRef | null;
  /** legado / serialização snake_case */
  chat_bot_trip_type?: ChatBotTripTypeRef | null;
  idChatBotTrip: number;
  message: string;
}

export interface ChatBotTripTypeProps {
  id: number;
  name: string;
}
