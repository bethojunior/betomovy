import { DriverData } from "../../../pages/Driver/List/types";

export interface CardDriverProps {
  datas: DriverData;
  message: string;
  menu: (res: DriverData) => JSX.Element;
  setLoading: (data: boolean) => void;
  baseImageLink: string;
  enableZafiraValidationMonitor?: boolean;
}

export interface DocumentDriverGroup {
  response: {
    agency: string;
    agencyDigit: string;
    alvara: string;
    alvaraPicture: string;
    balance: number;
    bankAccountDocument: string;
    bankAccountId: number;
    bankId: number;
    bankName: string;
    bankNumber: string;
    blockedBalance: number;
    brand: string;
    cnh: string;
    cnhPicture: string;
    color: string;
    created_at: string;
    criminalRecord: string;
    criminalRecordPicture: string;
    crlv: string;
    crlvPicture: string;
    docs_user: [];
    document: string;
    driverRegisterStatusId: number;
    email: string;
    gender: string;
    holderName: string;
    idCar: number;
    idDriver: number;
    idUser: number;
    latitude: string;
    longitude: string;
    militaryForce: string;
    militaryStatus: string;
    model: string;
    name: string;
    nickname: string;
    numberAccount: string;
    numberAccountDigit: string;
    observation: string;
    om: string;
    op: string;
    patent: string;
    patentPicture: string;
    phone: string;
    pix: string;
    plate: string;
    preAvailable: number;
    profileImage: string;
    profileImageStatus: string;
    profileImageStatusId: number;
    profileImageTemp: string;
    proofOfResidence: string;
    registerStatus: string;
    renavam: string;
    rentalCar: string;
    rentalCompanyDocument: string;
    seatsNumber: number;
    stationId: number;
    status: string;
    typeAccount: string;
    userId: number;
    userType: string;
    userTypeId: number;
    year: string;
  };
  status: boolean;
}

export interface TripPaymentFormData {
  tripPaymentFormId: number;
  active: boolean;
  idTripPaymentForm: number;
  paymentFormTypeId: number;
  name: string;
}

export interface TripPaymentFormGroup {
  response: TripPaymentFormData[];
  status: boolean;
}

export interface FormOfPaymentData {
  tripPaymentFormId: number;
  trip_payment_form: {
    active: boolean;
    idTripPaymentForm: number;
    name: string;
    paymentFormTypeId: number;
  };
}

export interface FormOfPaymentGroup {
  response: FormOfPaymentData[];
  status: boolean;
}
