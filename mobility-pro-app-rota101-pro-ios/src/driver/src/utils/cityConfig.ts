import {useAuth} from '../../../context/auth';
import {useLocalProvider} from '../context/local';

export function IsToShowField(field: string) {
  const {cityConfig, getConfigByPosition} = useAuth();
  const {location} = useLocalProvider();

  if (cityConfig === null || cityConfig === undefined) {
    getConfigByPosition(location?.coords);
  }

  return cityConfig?.enabledDriverFields?.accept[field] === true || false;
}
