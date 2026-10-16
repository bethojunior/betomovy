import { useState, useCallback, useRef, useEffect } from 'react';
import { Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/auth';
import apiMain from '../api/apiMain';
import { customToast } from '../../utils/FlashMessage';
import { translate } from '../locales';
import { coinTypePerApi } from '../utils/money';
import { StatusPayment } from '../components/PixPayment/constants';
import { PIX_CACHE_KEY, TRIP_CACHE_KEY, PIX_EXPIRATION_SECONDS } from '../constants/pixCache';
import type { AddressProps, DestinationProps, InitialStateProps, SelectedOptionTravelProps, SelectedPaymentMethodProps } from '../contexts/Trip/types';

export interface PixKeyProps {
  key: string;
}

export interface StatusPaymentProps {
  status: StatusPayment;
}

export interface PixData {
  payment_code: string;
  transactionStatusId: number;
  idTransaction: string;
}

// Cache separado para dados do PIX
export interface PixCacheData {
  pixKey: PixKeyProps;
  transactionStatusId: number;
  idTransaction: string;
  pixValue: number;
  price: number | string;
  priceId: number | null;
  couponId: number | null;
  expirationSeconds: number;
  timestamp: number;
  user: string;
}

// Cache separado para dados da viagem
export interface TripCacheData {
  origin: {
    address: string;
    latitude: number;
    longitude: number;
    street?: string;
    type?: string;
  };
  destination: DestinationProps;
  selectedOptionTravel: SelectedOptionTravelProps;
  selectedPaymentMethod?: SelectedPaymentMethodProps;
  waypoints?: AddressProps[];
  distance?: number;
  estimatedTripTime?: number;
  polylineCoordinates?: Array<{ latitude: number; longitude: number }>;
  calculateAllData?: any;
  timestamp: number;
  user: string;
}

export interface UsePixProps {
  price: number | string;
  pixCode?: string;
  onPixConfirmed?: (idTransaction: string) => void;
  confirmPixPayment?: () => void;
  onError?: (error: boolean) => void;
  tripData?: InitialStateProps; // Dados da viagem para cache
  expirationSeconds?: number;
}

export interface UsePixReturn {
  // States
  pixKey: PixKeyProps;
  paymentDone: boolean;
  statusPayment: StatusPaymentProps;
  itsLoadingPayment: boolean;
  loadingPix: boolean;
  transactionStatusId: number | null;
  idTransaction: string | null;
  pixValue: number | null;
  pixExpirationSeconds: number;

  // Functions
  handleConfirmPix: () => void;
  handleClick: () => void;
  copyToClipboard: () => Promise<void>;
  getToPixKey: () => Promise<void>;
  checkPixStatus: (idTransaction: string) => Promise<any>;
  startPixVerification: (transactionId: string, intervalMs?: number) => NodeJS.Timeout;
  clearPixVerification: () => void;
  resetPixGeneration: () => Promise<void>;
  resetPixAfterPayment: () => Promise<void>;
  resetPixOnClose: () => Promise<void>;
  refreshPixExpiration: () => Promise<void>;

  // Cache Functions
  savePixToCache: (pixData: Omit<PixCacheData, 'timestamp' | 'user'>) => Promise<void>;
  saveTripToCache: (tripData: InitialStateProps) => Promise<void>;
  getPixFromCache: () => Promise<PixCacheData | null>;
  getTripFromCache: () => Promise<TripCacheData | null>;
  clearPixCache: () => Promise<void>;
  clearTripCache: () => Promise<void>;
  clearAllCachesAfterTripStart: () => Promise<void>;
}

export function getRemainingPixExpirationSeconds(
  cachedData: Pick<PixCacheData, 'timestamp' | 'expirationSeconds'>,
  fallbackExpirationSeconds: number = PIX_EXPIRATION_SECONDS,
): number {
  const totalExpirationSeconds = cachedData.expirationSeconds ?? fallbackExpirationSeconds;
  const elapsedSeconds = Math.floor((Date.now() - cachedData.timestamp) / 1000);
  return Math.max(0, totalExpirationSeconds - elapsedSeconds);
}

export const usePix = ({
  price,
  pixCode,
  onPixConfirmed,
  confirmPixPayment,
  onError,
  tripData,
  expirationSeconds = PIX_EXPIRATION_SECONDS,
}: UsePixProps): UsePixReturn => {
  const { user, cityConfig } = useAuth();
  const [pixKey, setPixKey] = useState<PixKeyProps>({} as PixKeyProps);
  const [paymentDone, setPaymentDone] = useState(false);
  const [statusPayment, setStatusPayment] = useState<StatusPaymentProps>({} as StatusPaymentProps);
  const [itsLoadingPayment, setItsLoadingPayment] = useState(false);
  const [loadingPix, setLoadingPix] = useState(false);
  const [transactionStatusId, setTransactionStatusId] = useState<number | null>(null);
  const [idTransaction, setIdTransaction] = useState<string | null>(null);
  const [pixValue, setPixValue] = useState<number | null>(null);
  const [pixExpirationSeconds, setPixExpirationSeconds] = useState<number>(expirationSeconds);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pixGeneratedRef = useRef<boolean>(false);
  const currentPriceRef = useRef<number | string | null>(null);
  const onPixConfirmedRef = useRef(onPixConfirmed);
  onPixConfirmedRef.current = onPixConfirmed;

  // Constantes para cache separado
  const PIX_CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutos em millisegundos
  const TRIP_CACHE_EXPIRY = 60 * 60 * 1000; // 1 hora em millisegundos

  const handleConfirmPix = useCallback(() => {
    if (confirmPixPayment) {
      confirmPixPayment();
    }
  }, [confirmPixPayment]);

  const copyToClipboard = useCallback(async () => {
    await Clipboard.setString(pixKey?.key);
    setItsLoadingPayment(true);
  }, [pixKey?.key]);

  const handleClick = useCallback(() => {
    if (!paymentDone) {
      copyToClipboard();
      return;
    }
    handleConfirmPix();
  }, [paymentDone, copyToClipboard, handleConfirmPix]);

  // Funções de cache do PIX
  // Função para salvar apenas dados do PIX
  const savePixToCache = useCallback(async (pixData: Omit<PixCacheData, 'timestamp' | 'user'>) => {
    try {
      const cacheData: PixCacheData = {
        ...pixData,
        timestamp: Date.now(),
        user: user?.nameUser || 'Usuário',
      };

      await AsyncStorage.setItem(PIX_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('❌ Erro ao salvar PIX no cache:', error);
    }
  }, [user?.nameUser]);

  // Função para salvar dados da viagem separadamente
  const saveTripToCache = useCallback(async (tripData: InitialStateProps) => {
    try {
      // Verificar se selectedOptionTravel tem tripTypeId
      if (!tripData.selectedOptionTravel || !tripData.selectedOptionTravel.tripTypeId) {
        throw new Error('selectedOptionTravel não tem tripTypeId');
      }

      // Verificar se selectedPaymentMethod tem os campos necessários
      if (!tripData.selectedPaymentMethod || (!tripData.selectedPaymentMethod.idTripPaymentForm && !tripData.selectedPaymentMethod.paymentFormTypeId)) {
        throw new Error('selectedPaymentMethod não tem forma de pagamento válida');
      }

      const essentialTripData: TripCacheData = {
        origin: tripData?.origin,
        destination: tripData?.destination,
        selectedOptionTravel: tripData?.selectedOptionTravel,
        selectedPaymentMethod: tripData?.selectedPaymentMethod,
        waypoints: tripData?.waypoints,
        distance: tripData?.distance,
        estimatedTripTime: tripData?.estimatedTripTime,
        polylineCoordinates: tripData?.polylineCoordinates,
        calculateAllData: tripData?.calculateAllData,
        timestamp: Date.now(),
        user: user?.nameUser || 'Usuário',
      };

      await AsyncStorage.setItem(TRIP_CACHE_KEY, JSON.stringify(essentialTripData));
    } catch (error) {
      console.error('❌ Erro ao salvar dados da viagem no cache:', error);
    }
  }, [user?.nameUser]);

  // Função para recuperar dados do PIX do cache
  const getPixFromCache = useCallback(async (): Promise<PixCacheData | null> => {
    try {
      const raw = await AsyncStorage.getItem(PIX_CACHE_KEY);
      if (!raw) {
        return null;
      }

      const cachedData = JSON.parse(raw);
      const now = Date.now();
      const isExpired = (now - cachedData.timestamp) > PIX_CACHE_EXPIRY;

      if (isExpired) {
        await clearPixCache();
        return null;
      }

      return cachedData;
    } catch (error) {
      console.error('❌ Erro ao recuperar PIX do cache:', error);
      return null;
    }
  }, []);

  // Função para recuperar dados da viagem do cache
  const getTripFromCache = useCallback(async (): Promise<TripCacheData | null> => {
    try {
      const raw = await AsyncStorage.getItem(TRIP_CACHE_KEY);
      if (!raw) {
        return null;
      }

      const cachedData = JSON.parse(raw);
      const now = Date.now();
      const isExpired = (now - cachedData.timestamp) > TRIP_CACHE_EXPIRY;

      if (isExpired) {
        await clearTripCache();
        return null;
      }

      return cachedData;
    } catch (error) {
      console.error('❌ Erro ao recuperar viagem do cache:', error);
      return null;
    }
  }, []);

  // Função para limpar cache do PIX
  const clearPixCache = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(PIX_CACHE_KEY);
    } catch (error) {
      console.error('❌ Erro ao limpar cache do PIX:', error);
    }
  }, []);

  // Função para limpar cache da viagem
  const clearTripCache = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(TRIP_CACHE_KEY);
    } catch (error) {
      console.error('❌ Erro ao limpar cache da viagem:', error);
    }
  }, []);

  // Função para limpar ambos os caches quando corrida for iniciada com sucesso
  const clearAllCachesAfterTripStart = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(PIX_CACHE_KEY);
      await AsyncStorage.removeItem(TRIP_CACHE_KEY);
    } catch (error) {
      console.error('❌ Erro ao limpar caches após corrida:', error);
    }
  }, []);

  const loadPixFromCache = useCallback(async (cachedData: PixCacheData) => {
    setPixKey(cachedData.pixKey);
    setTransactionStatusId(cachedData.transactionStatusId);
    setIdTransaction(cachedData.idTransaction);
    setPixValue(cachedData.pixValue);
    pixGeneratedRef.current = true;
    currentPriceRef.current = cachedData.price;

    const remainingSeconds = getRemainingPixExpirationSeconds(cachedData, expirationSeconds);
    setPixExpirationSeconds(remainingSeconds);
  }, [expirationSeconds]);

  const refreshPixExpiration = useCallback(async () => {
    const cachedData = await getPixFromCache();
    if (!cachedData) return;

    setPixExpirationSeconds(getRemainingPixExpirationSeconds(cachedData, expirationSeconds));
  }, [getPixFromCache, expirationSeconds]);

  const getToPixKey = useCallback(async () => {

    if (pixCode && pixCode.trim() !== '') {
      // Se pixCode foi fornecido, tenta carregar dados completos do cache
      const cachedData = await getPixFromCache();
      if (cachedData && cachedData.pixKey.key === pixCode) {
        // Carrega todos os dados do cache
        await loadPixFromCache(cachedData);
        return;
      } else {

        setPixKey({
          key: pixCode,
        });
        pixGeneratedRef.current = true;
        return;
      }
    }

    if (pixGeneratedRef.current && currentPriceRef.current === price) {
      return;
    }


    try {
      setLoadingPix(true);

      const nome = user?.nameUser || 'Usuário';

      if (!price || price === 0) {
        throw new Error('Valor da corrida não informado');
      }

      let valorLimpo = String(price);
      if (typeof price === 'string') {
        const moedaAtual = coinTypePerApi(cityConfig?.typeMoney);
        valorLimpo = price
          .replace(new RegExp(moedaAtual.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')
          .replace(/\s/g, '')
          .replace(',00', '')
          .replace(',', '.')
      }

      const valorNumerico = parseFloat(valorLimpo);

      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        throw new Error('Valor inválido para gerar PIX');
      }

      // Escopo do cache: mesmo valor não basta, precisa ser a mesma opção de viagem + mesmo cupom (ou ausência dele)
      const priceId = tripData?.selectedOptionTravel?.idPrice ?? null;
      const couponId = tripData?.selectedCoupon?.id ?? null;

      // Verifica se existe PIX em cache para a mesma viagem/cupom/valor
      const cachedPix = await getPixFromCache();
      if (
        cachedPix &&
        cachedPix.price === price &&
        cachedPix.user === nome &&
        cachedPix.priceId === priceId &&
        cachedPix.couponId === couponId
      ) {
        await loadPixFromCache(cachedPix);
        setLoadingPix(false);
        return;
      }

      const payload = {
        name: nome,
        amount: valorNumerico,
      };

      const response = await apiMain.post('/trip/pix', payload);
      if (response.data?.data?.payment_code) {
        const pixData = {
          pixKey: { key: response.data.data.payment_code },
          transactionStatusId: response.data.data.transactionStatusId,
          idTransaction: response.data.data.idTransaction,
          pixValue: response.data.data.value,
          price: price,
          priceId,
          couponId,
          expirationSeconds,
        };
        await savePixToCache(pixData);
        if (tripData && tripData.selectedOptionTravel) {
          await saveTripToCache(tripData);
        } else {
          console.error('❌ TripData inválido ou sem selectedOptionTravel:', tripData);
        }

        setPixKey(pixData.pixKey);
        setTransactionStatusId(pixData.transactionStatusId);
        setIdTransaction(pixData.idTransaction);
        setPixValue(pixData.pixValue);
        setPixExpirationSeconds(expirationSeconds);
        pixGeneratedRef.current = true;
        currentPriceRef.current = price;
      } else {
        throw new Error('QR Code PIX não foi retornado pela API');
      }
    } catch (error) {
      customToast(translate('pix.text_qrcode_generation_error'), 'error');
      if (onError) {
        onError(true);
      }
    } finally {
      setLoadingPix(false);
    }
  }, [pixCode, price, tripData, user?.nameUser, cityConfig?.typeMoney, onError, expirationSeconds, getPixFromCache, loadPixFromCache, savePixToCache]);

  const checkPixStatus = useCallback(async (idTransaction: string) => {
    try {
      const response = await apiMain.get(`/trip/pixStatus?transactionId=${idTransaction}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao verificar status do PIX:', error);
      return null;
    }
  }, []);

  const resetPixAfterPayment = useCallback(async () => {
    setPaymentDone(false);
    setStatusPayment({} as StatusPaymentProps);
    setTransactionStatusId(null);
    setIdTransaction(null);
    setPixValue(null);
    setPixKey({} as PixKeyProps);

  }, []);

  const startPixVerification = useCallback((transactionId: string, intervalMs: number = 10000) => {
    const interval = setInterval(async () => {
      const statusData = await checkPixStatus(transactionId);

      if (statusData) {
        if (statusData.transactionStatusId === 1 || statusData.transactionStatusId === "1") {
          setStatusPayment({ status: StatusPayment.PAID });
          setPaymentDone(true);
          clearInterval(interval);
          intervalRef.current = null;

          // Reseta o estado do PIX após confirmação do pagamento
          await resetPixAfterPayment();

          if (onPixConfirmedRef.current && idTransaction) {
            onPixConfirmedRef.current(idTransaction);
          } else {
            handleConfirmPix();
          }
        } else if (statusData.transactionStatusId === 3 || statusData.transactionStatusId === "3") {
          setStatusPayment({ status: StatusPayment.PENDING });
        }
      }
    }, intervalMs);

    intervalRef.current = interval;
    return interval;
  }, [checkPixStatus, idTransaction, handleConfirmPix, resetPixAfterPayment]);

  const clearPixVerification = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetPixGeneration = useCallback(async () => {
    pixGeneratedRef.current = false;
    currentPriceRef.current = null;
    setPixKey({} as PixKeyProps);
    setPaymentDone(false);
    setStatusPayment({} as StatusPaymentProps);
    setTransactionStatusId(null);
    setIdTransaction(null);
    setPixValue(null);
  }, []);

  const resetPixOnClose = useCallback(async () => {
    // Limpa o interval de verificação se estiver ativo
    clearPixVerification();

    // Reseta todos os estados do PIX
    pixGeneratedRef.current = false;
    currentPriceRef.current = null;
    setPixKey({} as PixKeyProps);
    setPaymentDone(false);
    setStatusPayment({} as StatusPaymentProps);
    setTransactionStatusId(null);
    setIdTransaction(null);
    setPixValue(null);
    setLoadingPix(false);
    setItsLoadingPayment(false);

  }, [clearPixVerification]);

  useEffect(() => {
    return () => {
      clearPixVerification();
    };
  }, [clearPixVerification]);

  useEffect(() => {
    if (idTransaction) {
      const interval = startPixVerification(idTransaction, 3000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [idTransaction, startPixVerification]);


  return {
    // States
    pixKey,
    paymentDone,
    statusPayment,
    itsLoadingPayment,
    loadingPix,
    transactionStatusId,
    idTransaction,
    pixValue,
    pixExpirationSeconds,

    // Functions
    handleConfirmPix,
    handleClick,
    copyToClipboard,
    getToPixKey,
    checkPixStatus,
    startPixVerification,
    clearPixVerification,
    resetPixGeneration,
    resetPixAfterPayment,
    resetPixOnClose,
    refreshPixExpiration,

    // Cache Functions
    savePixToCache,
    saveTripToCache,
    getPixFromCache,
    getTripFromCache,
    clearPixCache,
    clearTripCache,
    clearAllCachesAfterTripStart,
  };
};
