import {ReactNode} from 'react';

export interface BottomSheetModalProps {
  visible: boolean;
  onRequestClose: () => void;
  children: ReactNode;
}
