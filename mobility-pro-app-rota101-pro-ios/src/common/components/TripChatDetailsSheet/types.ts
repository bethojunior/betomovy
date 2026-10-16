import { ReactNode } from 'react';

export interface TripChatDetailsSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}
