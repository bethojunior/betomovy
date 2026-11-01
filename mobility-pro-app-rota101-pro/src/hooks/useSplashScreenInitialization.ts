import {useEffect, useRef, useState} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {useAuth} from '../context/auth';
import {useTerms} from '../context/terms';
import useCachedResources from '../hooks/useCachedResources';

export default function useSplashScreenInitialization() {
  const [isSplashReady, setSplashReady] = useState(false);

  const isResourcesLoaded = useCachedResources();
  const {loading: isTermsLoading} = useTerms();
  const {loadingSession} = useAuth();

  const held = useRef(false);

  useEffect(() => {
    if (held.current) return;
    if (!loadingSession && !isTermsLoading && isResourcesLoaded) {
      held.current = true;
      SplashScreen.hideAsync();
      setTimeout(() => setSplashReady(true), 1200);
    }
  }, [loadingSession, isTermsLoading, isResourcesLoaded]);

  return isSplashReady;
}
