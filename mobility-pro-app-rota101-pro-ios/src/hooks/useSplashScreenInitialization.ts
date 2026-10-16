import {useEffect, useState} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {useAuth} from '../context/auth';
import {useTerms} from '../context/terms';
import useCachedResources from '../hooks/useCachedResources';

export default function useSplashScreenInitialization() {
  const [isSplashReady, setSplashReady] = useState(false);

  const isResourcesLoaded = useCachedResources();
  const {loading: isTermsLoading} = useTerms();
  const {loadingSession} = useAuth();

  useEffect(() => {
    async function handleSplashState() {
      if (!loadingSession && !isTermsLoading && isResourcesLoaded) {
        await SplashScreen.hideAsync();
        setSplashReady(true);
      }
    }

    handleSplashState();
  }, [loadingSession, isTermsLoading, isResourcesLoaded]);

  return isSplashReady;
}
