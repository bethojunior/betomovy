export interface ChatProps {
  open: boolean;
  close: () => void;
  trip: any;
  messages: MessageProps[];
}

export interface MessageProps {
  message: string;
  userId: number;
  preRendering?: boolean;
}
