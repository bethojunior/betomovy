import {ComponentProps} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {KeyboardTypeOptions} from 'react-native';

export interface SaveResult {
  status: boolean;
  message?: string;
}

export interface SecondaryAction {
  label: string;
  onPress: () => void;
}

interface BaseProps {
  label: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
}

export interface EditVariantProps extends BaseProps {
  variant?: 'edit';
  value: string;
  keyboardType?: KeyboardTypeOptions;
  /** Aplicado a cada tecla digitada, pra mostrar o valor já mascarado (ex: telefone, CPF). */
  formatValue?: (text: string) => string;
  /** Aplicado só na hora de validar/salvar, pra tirar a máscara antes de mandar pra API. */
  parseInput?: (masked: string) => string;
  /** Retorna uma mensagem de erro, ou null se válido. */
  validate?: (raw: string) => string | null;
  onSave: (raw: string) => Promise<SaveResult>;
  onSaved?: (raw: string) => void;
}

export interface RevealVariantProps extends BaseProps {
  variant: 'reveal';
  maskedValue: string;
  onReveal: () => Promise<string>;
  secondaryAction?: SecondaryAction;
}

export type EditableItemProfileProps = EditVariantProps | RevealVariantProps;
