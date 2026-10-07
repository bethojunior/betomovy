import {Alert} from 'react-native';

export const showBubbleMessage = (message: string, title?: string) => {
  Alert.alert(title ?? 'Aviso', message);
};
