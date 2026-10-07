export interface ChatBotTripProps {
  chatBotTripTypeId: number;
  chat_bot_trip_type: {
    id: number;
    name: string;
  };
  idChatBotTrip: number;
  message: string;
}

export interface ChatBotTripTypeProps {
  id: number;
  name: string;
}
