import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuickMessage {
  message: string;
}

const STORAGE_KEY = 'savedMessages';
export const QUICK_MESSAGES_LIMIT = 3;

// CRUD local das mensagens favoritadas — compartilhado entre motorista e
// passageiro, cada app com seu próprio AsyncStorage (não colide entre eles).
export async function getFavoriteQuickMessages(): Promise<QuickMessage[]> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

// Ignora duplicata exata; mais antiga sai (FIFO) quando passa do limite.
export async function addFavoriteQuickMessage(message: string): Promise<QuickMessage[]> {
  const current = await getFavoriteQuickMessages();
  if (current.some(saved => saved.message === message)) return current;

  const updated = [...current, { message }].slice(-QUICK_MESSAGES_LIMIT);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// Favoritas têm prioridade; as fixas (fornecidas por cada app) só preenchem
// o que sobrar, e somem por completo quando já tem QUICK_MESSAGES_LIMIT favoritadas.
export function buildQuickMessages(favorites: QuickMessage[], fallback: QuickMessage[]): QuickMessage[] {
  const remainingFallback = fallback.filter(
    fixed => !favorites.some(favorite => favorite.message === fixed.message),
  );
  return [...favorites, ...remainingFallback].slice(0, QUICK_MESSAGES_LIMIT);
}
