import {useContext} from 'react';
import {ConfigAppPartnerContext} from './index';

export const useConfigAppPartner = () => {
  const context = useContext(ConfigAppPartnerContext);

  if (!context) {
    throw new Error(
      'useConfigAppPartner precisa ser usado dentro de ConfigAppPartnerProvider',
    );
  }

  return context;
};
