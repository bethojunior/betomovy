import {ReactNode} from 'react';

export interface DestinationSearchBarProps {
  placeholder: string;
  onSearchPress: () => void;
  onMicPress: () => void;
  /** Elemento opcional renderizado atrás do ícone do microfone. */
  micPulse?: ReactNode;
}
