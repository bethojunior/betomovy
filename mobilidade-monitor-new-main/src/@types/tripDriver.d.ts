declare type TripDriver = {
  idDriver: string;
  userId: string;
  status: string;
  driverRegisterStatusId: string;
  latitude: string;
  longitude: string;
  profileImage: string;
  profileImageTemp: string;
  profilePicture: string;
  balanceId: string;
  stationId: any;
  prepaid: string;
  userTypeId: string;
  userTypeName: string;
  driverRating: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  document: string;
  deviceToken: string;
  preAvailable: string;
  cityId: string;
  bankAccountId: any;
  rating: string;
  quantityTrips: string;
  iconMapDriver: any;
  appVersion: string;
  location: {
    latitude: string;
    longitude: string;
    created_at: string;
    userId: string;
  };
  car: {
    plate: string;
    year: string;
    model: string;
    color: string;
    brand: string;
    renavam: string;
  };
  estimative: {
    distance: number;
    duration: number;
  };
  tripPreAccepted: any;
};
