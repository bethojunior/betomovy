import { ReactNode } from 'react';

export interface TripChatHeaderProps {
  photoUrl?: string | null;
  photoAccessibilityLabel?: string;
  /** Rótulo pequeno acima do título (ex.: "Motorista"/"Passageiro"). */
  label?: string;
  title: string;
  onGoBack: () => void;
  goBackAccessibilityLabel?: string;
  /** Ausente = botão de ligar não é renderizado. */
  onCallPress?: () => void;
  callAccessibilityLabel?: string;
  /** Ausente = avatar+título+subtítulo não são clicáveis. */
  onPress?: () => void;
  pressAccessibilityLabel?: string;
  /** Slot pra informação secundária (carro+placa no cliente, avaliação+viagens no motorista). */
  children?: ReactNode;
}
