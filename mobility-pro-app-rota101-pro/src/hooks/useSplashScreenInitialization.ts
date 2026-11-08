import {useEffect, useRef, useState} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {useAuth} from '../context/auth';
import {useTerms} from '../context/terms';
import useCachedResources from '../hooks/useCachedResources';

const MAX_INIT_WAIT_MS = 2500; // Trava máxima de 2.5s para nunca travar a tela de splash

export default function useSplashScreenInitialization() {
  const [isSplashReady, setSplashReady] = useState(false);

  const isResourcesLoaded = useCachedResources();
  const {loading: isTermsLoading} = useTerms();
  const {loadingSession} = useAuth();

  const held = useRef(false);

  const finishSplash = () => {
    if (held.current) return;
    held.current = true;
    try {
      SplashScreen.hideAsync();
    } catch {}
    setSplashReady(true);
  };

  useEffect(() => {
    if (held.current) return;
    if (!loadingSession && !isTermsLoading && isResourcesLoaded) {
      const t = setTimeout(finishSplash, 200);
      return () => clearTimeout(t);
    }
  }, [loadingSession, isTermsLoading, isResourcesLoaded]);

  // Fallback de segurança: se rede ou sessão demorarem, libera o app após MAX_INIT_WAIT_MS
  useEffect(() => {
    const fallback = setTimeout(() => {
      finishSplash();
    }, MAX_INIT_WAIT_MS);
    return () => clearTimeout(fallback);
  }, []);

  return isSplashReady;
}
