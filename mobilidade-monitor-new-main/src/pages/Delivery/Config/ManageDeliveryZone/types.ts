interface AreaProps {
  lat: number;
  lng: number;
}

export interface DeliveryNeighborhoodProps {
  area: AreaProps[];
  city: {
    estado: number;
    id: number;
    nome: string;
    shortName: string | null;
  };
  cityId: number;
  deliveryPrice: number;
  id: number;
  name: string;
}
