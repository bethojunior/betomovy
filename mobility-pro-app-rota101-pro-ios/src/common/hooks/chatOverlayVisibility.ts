const MANY_MESSAGES_THRESHOLD = 10;

interface ChatOverlayVisibilityParams {
  keyboardHeight: number;
  isNearBottom: boolean;
  canScroll: boolean;
  messagesCount: number;
}

// Compartilhado entre client/driver — evita duplicar a mesma regra dos dois floating cards do chat.
export function getChatOverlayVisibility({ keyboardHeight, isNearBottom, canScroll, messagesCount }: ChatOverlayVisibilityParams) {
  return {
    showAutoReadCard: keyboardHeight === 0 && isNearBottom && canScroll,
    showScrollToBottom: !isNearBottom && messagesCount > MANY_MESSAGES_THRESHOLD,
  };
}
