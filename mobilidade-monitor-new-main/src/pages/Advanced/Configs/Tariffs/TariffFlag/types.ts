export interface TariffsFlagsProps {
  id: number;
  active: number;
  city: {
    estado: number;
    id: number;
    nome: string;
    shortName: string | null;
  };
  cityId: number;
  dayOfWeek: number;
  idPriceDynamic: number;
  multiplierValue: number;
  timeEnd: string;
  timeStart: string;
  timezone: string | null;
  tripTypeId: number;
  trip_type: {
    idTripType: number;
    picture: string;
    type: string;
  };
  week_day: {
    day: number;
    description: string;
    id: number;
    slug: string;
  };
}

export interface TripTypesProps {
  tripTypeId: number;
  type: string;
}
