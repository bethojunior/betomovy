export interface CountryProps {
  id: number;
  name: string;
}

export interface StateProps {
  country_id: number;
  id: number;
  name: string;
  sigla: string;
}

export interface FeatureCityProps {
  geometry: {
    coordinates: any;
    type: string;
  };
  properties: {
    id: string;
    name: string;
    description: string;
  };
  type: string;
}

export interface CitySelectedFormatedProps {
  polygon: string;
  key: number;
  id: number;
  estate_id: number;
  name: string;
}

export interface CityJsonProps {
  features: FeatureCityProps[];
  type: string;
}

export interface CityProps {
  state: CountryProps;
  estate_id: number;
  id: number;
  name: string;
  polygon: string;
  short_name: string | null;
}

export interface DeafaultOptionsAntd {
  label: string;
  value: any;
}

export interface CitiesFullyProps {
  cityId: number;
  nome: string;
  polygon: string;
  shortName: string;
}
