interface DriverTypeProps {
  driverType: string;
  userTypeId: string;
}

declare type ServicesListProps = {
  cancellationFee: number;
  cashback: any;
  color: string;
  description: string;
  idPrice: string;
  multiplierPriceDynamic: string;
  picture: string;
  price: number;
  priceDynamicValue: number;
  priceName: string;
  priceRange: any;
  tag: string;
  taxes: any;
  tripType: {
    deliveryOption: string;
    description: string;
    freightOption: string;
    idTripType: string;
    offerOption: string;
    onlyCentral: string;
    openPrice: string;
    picture: string;
    returnOption: string;
    serviceOption: string;
    type: string;
  };
  tripTypeId: string;
  turbinedPrice: number;
  typeDrivers: DriverTypeProps[];
  order?: string;
};
