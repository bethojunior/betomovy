import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Linking } from 'react-native';
import { NavigationProp, ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useUserDriver } from '../../context/userDriver';
import { useAuth } from '../../../../context/auth';
import { useSupportNumber } from '../../../../hooks/useSupportNumber';
import { UserDriverFind } from '../../context/userDriver/types';
import { resolveDriverRegisterStatus, DriverRegisterStatusInfo } from '../../constants/driverRegisterStatus';

export interface UseStatusPendingDataResult {
  loading: boolean;
  refreshing: boolean;
  userDriverFind: UserDriverFind | null;
  email?: string;
  statusInfo: DriverRegisterStatusInfo;
  hasPendingDocuments: boolean;
  onContactSupport?: () => void;
  onRefresh: () => Promise<void>;
  onTrackStatus: () => void;
  showSignOutConfirm: boolean;
  requestSignOut: () => void;
  cancelSignOut: () => void;
  confirmSignOut: () => void;
}

export function useStatusPendingData(): UseStatusPendingDataResult {
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const { userDriverFind, getDriverFind } = useUserDriver();
  const { userDriver, signOutDriver, newActionFb, setNewActionFb } = useAuth();
  const { getSupportNumberFormatted } = useSupportNumber();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const fetchStatus = useCallback(async () => {
    const response = await getDriverFind();
    if (response?.driverRegisterStatusId === '1') {
      navigate('Home');
    }
  }, [getDriverFind, navigate]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchStatus();
      setLoading(false);
    })();
  }, []);

  // Precisa ser useFocusEffect, não useEffect([]) — o StatusPending fica montado no fundo da pilha
  // quando navega pra DocumentList/DocumentSend, e um useEffect([]) nunca desregistra o listener,
  // fazendo o back físico dessas telas abrir o modal de sair em vez de voltar.
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        setShowSignOutConfirm(true);
        return true;
      });
      return () => subscription.remove();
    }, []),
  );

  useEffect(() => {
    if (newActionFb.length > 0) {
      fetchStatus();
      setNewActionFb('');
    }
  }, [newActionFb]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStatus();
    setRefreshing(false);
  }, [fetchStatus]);

  const hasPendingDocuments = (userDriverFind?.docsUser || []).some(doc => doc.docStatusId !== '1');
  const supportNumber = getSupportNumberFormatted();

  return {
    loading,
    refreshing,
    userDriverFind,
    email: userDriver?.email,
    statusInfo: resolveDriverRegisterStatus(userDriverFind?.driverRegisterStatusId),
    hasPendingDocuments,
    onContactSupport: supportNumber ? () => Linking.openURL(`https://wa.me/${supportNumber}/`) : undefined,
    onRefresh,
    onTrackStatus: () => navigate('DocumentPending'),
    showSignOutConfirm,
    requestSignOut: () => setShowSignOutConfirm(true),
    cancelSignOut: () => setShowSignOutConfirm(false),
    confirmSignOut: () => {
      setShowSignOutConfirm(false);
      signOutDriver();
    },
  };
}
