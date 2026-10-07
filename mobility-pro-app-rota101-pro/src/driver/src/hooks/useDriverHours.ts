import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useUserDriver } from '../context/userDriver';
import apiMainDriver from '../api/apiMain';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DriverHoursData {
  hours_worked: string | number;
  hours_open: string | number;
}

interface UseDriverHoursReturn {
  driverHours: DriverHoursData | null;
  loadingHours: boolean;
  loadingRealtime: boolean;
  getDriverHours: () => Promise<void>;
  checkHorasLimites: (showModalCallback?: () => void) => Promise<boolean>;
  checkHorasLimitesRealtime: () => Promise<boolean>;
  checkDriverStatusAndHours: () => Promise<void>;
  refreshHours: () => Promise<void>;
  closeModal: () => void;
  forceModalState: (show: boolean) => void;
  shouldShowModal: boolean;
  canDriverGoOnline: boolean;
  hasShownModalInHome: boolean;
  saveModalShownInHome: () => Promise<void>;
  resetModalShownInHome: () => Promise<void>;
}

export const useDriverHours = (): UseDriverHoursReturn => {
  const [driverHours, setDriverHours] = useState<DriverHoursData | null>(null);
  const [loadingHours, setLoadingHours] = useState(false);
  const [loadingRealtime, setLoadingRealtime] = useState(false);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [canDriverGoOnline, setCanDriverGoOnline] = useState(true);
  const [hasShownModalThisSession, setHasShownModalThisSession] = useState(false);
  const [hasShownModalInHome, setHasShownModalInHome] = useState(false);

  const hasExecutedInitialCheck = useRef(false);
  const lastDriverId = useRef<string | null>(null);

  const { userDriverFind, toogleDriverStatus } = useUserDriver();

  const checkModalShownInHome = useCallback(async () => {
    try {
      const modalShown = await AsyncStorage.getItem('modalHorasShownInHome');
      if (modalShown === 'true') {
        setHasShownModalInHome(true);
      }
    } catch (error) {
      console.error('Erro ao verificar modal mostrado na home:', error);
    }
  }, []);

  const shouldSkipChecks = useMemo(() => {
    return hasShownModalThisSession || hasShownModalInHome;
  }, [hasShownModalThisSession, hasShownModalInHome]);

  const saveModalShownInHome = useCallback(async () => {
    try {
      await AsyncStorage.setItem('modalHorasShownInHome', 'true');
      setHasShownModalInHome(true);
    } catch (error) {
      console.error('Erro ao salvar modal mostrado na home:', error);
    }
  }, []);

  const resetModalShownInHome = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('modalHorasShownInHome');
      setHasShownModalInHome(false);
      hasExecutedInitialCheck.current = false;
    } catch (error) {
      console.error('Erro ao resetar modal mostrado na home:', error);
    }
  }, []);

  const getDriverHours = useCallback(async () => {
    if (!userDriverFind?.idDriver) {
      return;
    }

    setLoadingHours(true);

    try {
      const response = await apiMainDriver.post('driver/GetDriverHours', {
        stdObject: [{ driverId: userDriverFind.idDriver }]
      });

      if (response?.status && response?.data && response.data.data) {
        setDriverHours(response.data.data);

        const horasReais = response.data.data;
        const horasTrabalhadas = Number(horasReais.hours_worked);
        const limiteHoras = Number(horasReais.hours_open);

        if (!isNaN(horasTrabalhadas) && !isNaN(limiteHoras)) {
          if (horasTrabalhadas === 0 && limiteHoras === 0) {
            setShouldShowModal(false);
            setCanDriverGoOnline(true);
            setHasShownModalThisSession(false);
            resetModalShownInHome();
          } else if (horasTrabalhadas >= limiteHoras && limiteHoras > 0) {
            if (!hasShownModalThisSession && !hasShownModalInHome) {
              setShouldShowModal(true);
              setHasShownModalThisSession(true);
              saveModalShownInHome();
            }

            setCanDriverGoOnline(false);

            if (userDriverFind?.status === 'disponivel' || userDriverFind?.status === 'corrida') {

              try {
                const location = await Location.getCurrentPositionAsync({ accuracy: 1 });
                await toogleDriverStatus('desligado', {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                });
              } catch (error) {
                console.error('Erro ao desligar motorista automaticamente:', error);
              }
            }
          } else {
            setShouldShowModal(false);
            setCanDriverGoOnline(true);
            setHasShownModalThisSession(false);
            resetModalShownInHome();
          }
        }
      } else {
        setDriverHours(null);
        setShouldShowModal(false);
        setCanDriverGoOnline(true);
        setHasShownModalThisSession(false);
      }
    } catch (error) {
      setDriverHours(null);
    } finally {
      setLoadingHours(false);
    }
  }, [userDriverFind?.idDriver, userDriverFind?.status, hasShownModalThisSession]);

  const refreshHours = useCallback(async () => {
    await getDriverHours();
  }, [getDriverHours]);

  const checkHorasLimites = useCallback(async (showModalCallback?: () => void) => {
    await refreshHours();
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!driverHours) {
      setShouldShowModal(false);
      setCanDriverGoOnline(true);
      return true;
    }

    const horasTrabalhadas = Number(driverHours.hours_worked);
    const limiteHoras = Number(driverHours.hours_open);


    if (isNaN(horasTrabalhadas) || isNaN(limiteHoras)) return true;

    if (horasTrabalhadas === 0 && limiteHoras === 0) {
      setShouldShowModal(false);
      setCanDriverGoOnline(true);
      return true;
    }

    if (horasTrabalhadas >= limiteHoras && limiteHoras > 0) {
      setShouldShowModal(true);
      setCanDriverGoOnline(false);
      if (showModalCallback) showModalCallback();
      return false;
    }

    setShouldShowModal(false);
    setCanDriverGoOnline(true);
    return true;
  }, [driverHours, refreshHours]);

  const checkHorasLimitesRealtime = useCallback(async () => {
    setLoadingRealtime(true);

    try {
      if (!userDriverFind?.idDriver) {
        setLoadingRealtime(false);
        return true;
      }

      const response = await apiMainDriver.post('driver/GetDriverHours', {
        stdObject: [{ driverId: userDriverFind.idDriver }]
      });

      if (response?.status && response?.data && response.data.data) {
        const horasReais = response.data.data;
        const horasTrabalhadas = Number(horasReais.hours_worked);
        const limiteHoras = Number(horasReais.hours_open);

        if (!isNaN(horasTrabalhadas) && !isNaN(limiteHoras)) {
          if (horasTrabalhadas === 0 && limiteHoras === 0) {
            setShouldShowModal(false);
            setCanDriverGoOnline(true);
            setLoadingRealtime(false);
            return true;
          } else if (horasTrabalhadas >= limiteHoras && limiteHoras > 0) {
            setShouldShowModal(true);
            setCanDriverGoOnline(false);
            setLoadingRealtime(false);
            return false;
          }
        }

        setDriverHours(horasReais);
        setShouldShowModal(false);
        setCanDriverGoOnline(true);
        setLoadingRealtime(false);
        return true;
      } else {
        setShouldShowModal(false);
        setCanDriverGoOnline(true);
        setLoadingRealtime(false);
        return true;
      }
    } catch (error) {
      console.error('Erro na verificação em tempo real:', error);
      setLoadingRealtime(false);
    }

    setLoadingRealtime(false);
    return canDriverGoOnline;
  }, [userDriverFind?.idDriver, canDriverGoOnline]);

  const checkDriverStatusAndHours = useCallback(async () => {

    if (!userDriverFind?.idDriver) {
      return;
    }

    try {
      const response = await apiMainDriver.post('driver/GetDriverHours', {
        stdObject: [{ driverId: userDriverFind.idDriver }]
      });

      if (response?.status && response?.data && response.data.data) {
        const horasReais = response.data.data;
        const horasTrabalhadas = Number(horasReais.hours_worked);
        const limiteHoras = Number(horasReais.hours_open);

        if (!isNaN(horasTrabalhadas) && !isNaN(limiteHoras)) {
          if (horasTrabalhadas === 0 && limiteHoras === 0) {
            setShouldShowModal(false);
            setCanDriverGoOnline(true);
            setHasShownModalThisSession(false);
          } else if (horasTrabalhadas >= limiteHoras && limiteHoras > 0) {
            if (!hasShownModalThisSession) {
              setShouldShowModal(true);
              setHasShownModalThisSession(true);
            }

            setCanDriverGoOnline(false);

            if (userDriverFind?.status === 'disponivel') {

              try {
                const location = await Location.getCurrentPositionAsync({ accuracy: 1 });
                await toogleDriverStatus('desligado', {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                });
              } catch (error) {
                console.error('Erro ao desligar motorista automaticamente:', error);
              }
            }
          } else {
            setShouldShowModal(false);
            setCanDriverGoOnline(true);
            setHasShownModalThisSession(false);
          }
        } else {
          setShouldShowModal(false);
          setCanDriverGoOnline(true);
          setHasShownModalThisSession(false);
        }

        setDriverHours(horasReais);
      } else {
        setShouldShowModal(false);
        setCanDriverGoOnline(true);
        setHasShownModalThisSession(false);
      }
    } catch (error) {
      // falha de rede em modo offline — ignorar
    }
  }, [userDriverFind?.idDriver, userDriverFind?.status, toogleDriverStatus, hasShownModalThisSession]);

  const closeModal = useCallback(() => {
    setShouldShowModal(false);
    setHasShownModalThisSession(false);
  }, []);

  const forceModalState = useCallback((show: boolean) => {
    setShouldShowModal(show);
  }, []);

  useEffect(() => {
    if (!driverHours) {
      setShouldShowModal(false);
      setCanDriverGoOnline(true);
      return;
    }

    const horasTrabalhadas = Number(driverHours.hours_worked);
    const limiteHoras = Number(driverHours.hours_open);

    if (!isNaN(horasTrabalhadas) && !isNaN(limiteHoras)) {
      if (horasTrabalhadas === 0 && limiteHoras === 0) {
        setShouldShowModal(false);
        setCanDriverGoOnline(true);
        resetModalShownInHome();
        return;
      } else if (horasTrabalhadas >= limiteHoras && limiteHoras > 0) {
        setShouldShowModal(true);
        setCanDriverGoOnline(false);
        return;
      }
    }

    setShouldShowModal(false);
    setCanDriverGoOnline(true);
    resetModalShownInHome();
  }, [driverHours]);

  const executeInitialCheck = useCallback(async () => {
    if (!userDriverFind?.idDriver || hasExecutedInitialCheck.current || shouldSkipChecks) {
      return;
    }

    if (lastDriverId.current !== userDriverFind.idDriver) {
      hasExecutedInitialCheck.current = false;
      lastDriverId.current = userDriverFind.idDriver;
    }
    await checkModalShownInHome();
    await getDriverHours();
    setHasShownModalThisSession(true);
    hasExecutedInitialCheck.current = true;
  }, [userDriverFind?.idDriver, shouldSkipChecks, checkModalShownInHome, getDriverHours]);

  useEffect(() => {
    executeInitialCheck();
  }, [executeInitialCheck]);


  return {
    driverHours,
    loadingHours,
    loadingRealtime,
    getDriverHours,
    checkHorasLimites,
    checkHorasLimitesRealtime,
    checkDriverStatusAndHours,
    refreshHours,
    closeModal,
    forceModalState,
    shouldShowModal,
    canDriverGoOnline,
    hasShownModalInHome,
    saveModalShownInHome,
    resetModalShownInHome
  };
};

