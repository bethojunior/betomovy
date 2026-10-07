import { useEffect, useState } from 'react';
import Session from '../utils/Session';

interface ICitySelected {
  cityId: number;
  nome: string;
  polygon: string;
  shortName: string;
}

export const useCitySelected = () => {
  const [citySelected, setCitySelected] = useState<ICitySelected | null>(null);
  const [hasCitySelected, setHasCitySelected] = useState<boolean>(false);

  useEffect(() => {
    const city = Session.getLocal('citySelected');
    const isValid = Session.hasCitySelected();
    
    setHasCitySelected(isValid);
    setCitySelected(isValid ? city : null);
  }, []);

  return { citySelected, hasCitySelected };
};
