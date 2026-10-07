export interface FinancialMirrorProps {
  canceledByCustomer: number;
  canceledByDriver: number;
  cardRefused: number;
  finishedTrips: number;
  firstTrip: number;
  numUniqueCustomer: number;
  totalPrice: string;
  totalTrips: number;
  uniqueDriverIds: number;
}

export interface SelectFilterData {
  id: string;
  text: string;
}

export interface TripsData {
  canceledBy: string;
  customerComment: string;
  customerId: number;
  customerName: string;
  date: string;
  driverId: number;
  idTrip: number;
  paymentForm: string;
  price: number;
  situation: string;
  status: string;
  tripReference: string;
  userId: number;
}

export interface UserAndDrivers {
  alvara: string;
  appVersion: string;
  balance: number;
  blockedBalance: number;
  carBrand: string;
  carModel: string;
  carPlate: string;
  city: string;
  cityId: number;
  created_at: string;
  document: string;
  driverRegisterStatusId: number;
  email: string;
  gender: string;
  idDriver: number;
  idUser: number;
  militaryForce: string;
  militaryPatent: string;
  militaryPatentPicture: string;
  militaryStatus: string;
  name: string;
  nickname: string;
  observation: string;
  om: string;
  phone: string;
  platform: string;
  prepaid: number;
  profileImage: string;
  proofOfResidence: string;
  rating: number;
  registerStatus: string;
  rg: string;
  rgBackPicture: string;
  rgFrontPicture: string;
  station: null;
  userType: string;
  userTypeId: number;
}
