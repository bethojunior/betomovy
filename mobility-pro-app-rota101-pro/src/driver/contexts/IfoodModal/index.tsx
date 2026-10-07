import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from 'react';
import { DeliveryCodeModal } from '../../../driver/src/components/Modal/FinishTrip/CodeIfood';
import { IfoodModalContextProps } from './types';

export const IfoodModalContext = createContext<IfoodModalContextProps>({
  openCodeModal: async () => { },
});

export const IfoodModalProvider = ({ children }: { children: ReactNode }) => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [tripReference, setTripReference] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [flag, storedRef] = await Promise.all([
        AsyncStorage.getItem('deliveryModalVisible'),
        AsyncStorage.getItem('tripReference'),
      ]);
      if (storedRef) {
        setTripReference(storedRef);
      }
      if (flag === 'true' && storedRef) {
        setShowCodeModal(true);
      }
    })();
  }, []);

  const openCodeModal = useCallback(async (ref: string) => {
    await Promise.all([
      AsyncStorage.setItem('tripReference', ref),
      AsyncStorage.setItem('deliveryModalVisible', 'true'),
    ]);
    setTripReference(ref);
    setShowCodeModal(true);
  }, []);

  const handleTrueClose = useCallback(async () => {
    await Promise.all([
      AsyncStorage.setItem('deliveryModalVisible', 'false'),
      AsyncStorage.removeItem('tripReference'),
    ]);
    setShowCodeModal(false);
  }, []);

  const onCodeValidated = useCallback(() => {
    handleTrueClose();
  }, [handleTrueClose]);

  return (
    <IfoodModalContext.Provider value={{ openCodeModal }}>
      {children}
      {tripReference && (
        <DeliveryCodeModal
          visible={showCodeModal}
          tripReference={tripReference}
          onClose={handleTrueClose}
          onCodeValidated={onCodeValidated}
        />
      )}
    </IfoodModalContext.Provider>
  );
};
