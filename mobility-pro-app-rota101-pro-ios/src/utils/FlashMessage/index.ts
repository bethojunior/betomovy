import {showMessage} from 'react-native-flash-message';

export type MessageType = 'success' | 'danger' | 'error' | 'warning' | 'info';

// Estilo/ícone/cor de cada tipo ficam no CustomFlashMessage (MessageComponent do <FlashMessage>, montado no App.tsx)
export function customToast(message: string, type: MessageType, time?: number) {
  // 'error' é um alias histórico de 'danger' — mesmo card, sem tipo duplicado lá na frente
  const normalizedType = type === 'error' ? 'danger' : type;

  showMessage({
    animated: false,
    message: '',
    description: message,
    type: normalizedType as 'success' | 'danger' | 'warning' | 'info',
    hideOnPress: true,
    duration: time || 3500,
    floating: true,
  });
}

export function customErrorMessage({message, description, statusCode}) {
  if (!description)
    if (statusCode)
      switch (statusCode) {
        case 401:
          description = 'usuário não permitido';
          break;
        case 404:
          description = 'recurso não encontrado';
          break;
        case 409:
          description = 'recurso já existente.';
          break;
        case 500:
          description = 'erro interno do servidor.';
          break;
        default:
          description = 'erro inesperado.';
          break;
      }
    else description = 'falha na comunicação com servidor';

  customToast(`${message}: ${description}`, 'danger');
}
