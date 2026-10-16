import { useEffect, useMemo, useState } from 'react';
import {
  addFavoriteQuickMessage,
  buildQuickMessages,
  getFavoriteQuickMessages,
  QuickMessage,
} from './quickMessages';

// Mensagens rápidas do rodapé do chat (motorista e passageiro): favoritas do
// usuário + fallback fixo de cada app, prontas pra exibir. `favoriteMessage`
// já devolve a lista atualizada — sem gatilho indireto de refetch.
export function useFavoriteQuickMessages(fallbackMessages: QuickMessage[]) {
  const [favorites, setFavorites] = useState<QuickMessage[]>([]);

  useEffect(() => {
    getFavoriteQuickMessages().then(setFavorites);
  }, []);

  const quickMessages = useMemo(
    () => buildQuickMessages(favorites, fallbackMessages),
    [favorites, fallbackMessages],
  );

  const favoriteMessage = async (message: string) => {
    setFavorites(await addFavoriteQuickMessage(message));
  };

  return { quickMessages, favoriteMessage };
}
