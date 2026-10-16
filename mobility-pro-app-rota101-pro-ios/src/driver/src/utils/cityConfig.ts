import {CityConfig} from '../../../context/auth/types';

export function IsToShowField(field: string, cityConfig: CityConfig | null | undefined) {
  return cityConfig?.enabledDriverFields?.accept[field] === true || false;
}
