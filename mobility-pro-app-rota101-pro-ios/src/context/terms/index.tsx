import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { storage } from '../../common/services/mmkv/storage';

export const STORAGE_KEY_TERMS = 'terms-accepted';

type TermsContextType = {
  showTerms: boolean;
  setShowTerms: (value: boolean) => void;
  termsAccepted: boolean;
  acceptTerms: (accepted: boolean) => void;
  loading: boolean;
};

const TermsContext = createContext<TermsContextType | undefined>(undefined);

export const TermsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const accepted = storage.getItem(STORAGE_KEY_TERMS, 'boolean');
      setTermsAccepted(!!accepted);
      setShowTerms(!accepted);
    } catch (error) {
      console.warn('Erro ao verificar termos:', error);
      setShowTerms(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptTerms = useCallback((accepted: boolean) => {
    storage.setItem(STORAGE_KEY_TERMS, accepted, 'boolean');
    setTermsAccepted(accepted);
    // setShowTerms(!accepted);
  }, []);

  return (
    <TermsContext.Provider value={{ showTerms, setShowTerms, termsAccepted, acceptTerms, loading }}>
      {children}
    </TermsContext.Provider>
  );
};

export const useTerms = (): TermsContextType => {
  const context = useContext(TermsContext);
  if (!context) {
    throw new Error('useTerms deve ser usado dentro de um TermsProvider');
  }
  return context;
};
