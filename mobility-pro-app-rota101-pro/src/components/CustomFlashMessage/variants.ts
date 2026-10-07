import theme from '../../client/styles/theme';
import {ToastType, ToastVariant} from './types';

// Ícone + cor por tipo. O título vem de translate() em runtime (index.tsx), não aqui,
// pra respeitar troca de idioma sem precisar reiniciar o app.
export const VARIANTS: Record<ToastType, ToastVariant> = {
  success: {
    titleKey: 'toast.title_success',
    iconName: 'checkmark',
    accentColor: theme.toast.success,
  },
  danger: {
    titleKey: 'toast.title_danger',
    iconName: 'close',
    accentColor: theme.toast.attention,
  },
  warning: {
    titleKey: 'toast.title_warning',
    iconName: 'warning',
    accentColor: theme.colors.yellowStrong,
  },
  info: {
    titleKey: 'toast.title_info',
    iconName: 'information',
    accentColor: theme.colors.blue,
  },
};

export const DEFAULT_VARIANT = VARIANTS.danger;
