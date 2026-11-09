import {useEffect, useRef, useState} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {useAuth} from '../context/auth';
import {useTerms} from '../context/terms';
import useCachedResources from '../hooks/useCachedResources';

const MAX_INIT_WAIT_MS = 600; // Liberação imediata sem prender o usuário

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
      finishSplash();
    }
  }, [loadingSession, isTermsLoading, isResourcesLoaded]);

  // Fallback de segurança: se rede ou sessão demorarem, libera o app imediatamente
  useEffect(() => {
    const fallback = setTimeout(() => {
      finishSplash();
    }, MAX_INIT_WAIT_MS);
    return () => clearTimeout(fallback);
  }, []);

  return isSplashReady;
}
