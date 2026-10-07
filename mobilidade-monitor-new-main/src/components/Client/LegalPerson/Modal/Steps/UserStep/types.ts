export interface LocalArrayData {
  id?: number;
  user: {
    userId: number | undefined;
    name: string;
    email: string;
  };
}

export interface UserProps {
  appVersion: string;
  balanceId: number;
  city: string;
  cityId: number;
  comission: number;
  created_at: string;
  dateOfBirth: string;
  document: string;
  email: string;
  gender: string;
  idCustomer: number;
  idUser: number;
  latitude: string;
  longitude: string;
  militaryForce: string;
  militaryStatus: string;
  name: string;
  nickname: string;
  observation: string;
  om: string;
  patent: string;
  patentPicture: string;
  phone: string;
  platform: string;
  profileImage: string;
  quantityTripsFinished: number;
  rg: string;
  rgBackPicture: string;
  rgFrontPicture: string;
  status: string;
  voucherBalance: number;
}

export interface ThirdStep {
  setUserIdProps: (res: number) => void;
  setUserNameProps: (res: string) => void;
  userEmailProps: string;
  setUserEmailProps: (res: string) => void;
  arrayOfWorkersProps: LocalArrayData[];
  insertInArrayProps: () => void;
  setArrayOfWorkersProps: (res: LocalArrayData[]) => void;
  insertWorkersProps: () => void;
  registerOrEditProps: boolean;
  userPhoneProps: string;
  setUserPhoneProps: (res: string) => void;
  currentStep: number;
  setCurrentStep: (data: number) => void;
  handleRegisterAndEditUser: () => void;
}