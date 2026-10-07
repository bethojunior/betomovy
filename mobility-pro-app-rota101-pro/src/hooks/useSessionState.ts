import {useState, useEffect, useCallback} from 'react';
import {
  loadSession,
  saveSession,
  SessionType,
  clearSession,
} from '../utils/Storage/sessionStorage';

type SessionData<T extends Record<string, any>> = {
  user: T | null;
  token: string | null;
  isDriver: boolean;
};

export function useSessionState<T extends Record<string, any> | null>() {
  const [loading, setLoading] = useState(true);
  const [session, setSessionData] = useState<SessionData<T> | null>(null);

  useEffect(() => {
    let active = true;

    loadSession()
      .then(data => {
        if (active) {
          try {
            const parsedUser = data?.user ? JSON.parse(data.user) : null;
            setSessionData({...data, user: parsedUser});
          } catch (error) {
            console.error('Falha ao parsear dados da sessão:', error);
            setSessionData(null);
          }
        }
      })
      .catch(() => {
        if (active) {
          setSessionData(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const setSession = useCallback(
    async (key: SessionType, data: SessionData<T> | null) => {
      setSessionData(data);

      const userAsString = data?.user ? JSON.stringify(data.user) : null;
      await saveSession(key, userAsString, data?.token ?? null);
    },
    [],
  );

  const removeSession = useCallback(async (key: SessionType) => {
    setSessionData(null);
    await clearSession(key);
  }, []);

  return {
    loading,
    session,
    setSession,
    clearSession: removeSession,
  } as const;
}
