import {ReactNode} from 'react';
import {ObjectThemeAppPartnerProps} from '../../client/pages/SelectAppPartners/types';

interface IConfigAppPartnerContextProps {
  isModuleAppPartnerActive: boolean;
  setIsModuleAppPartnerActive: (data: boolean) => void;
  handleCheckAppPartnerSelected: () => Promise<void>;
  appPartnerSelected: ObjectThemeAppPartnerProps | null;
}

interface IConfigAppPartnerProviderProps {
  children: ReactNode;
}

export type {IConfigAppPartnerContextProps, IConfigAppPartnerProviderProps};
