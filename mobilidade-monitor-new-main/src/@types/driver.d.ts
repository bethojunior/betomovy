declare type Driver = {
  idDriver: number;
  cityId: number;
  estateId: number;
  status: "disponivel" | "desligado" | "corrida";
  preAvailable: boolean;
  stationId: number;
  userId: number;
  balanceId: number;
  driverRegisterStatusId: number;
  latitude: string;
  longitude: string;
  last_position_update: Date;
  user: User;
  balance: Balance;
};

declare type DriverUserTypesProps = {
  acceptedText: string;
  boardingText: string;
  description: string | null;
  iconMapDriverId: number;
  idUserType: number;
  inProgressText: string;
  isActive: number;
  isDeliveryMan: number;
  isDriver: number;
  name: string;
  picture: string;
  vehicleType?: string | null;
};

declare type DriverRealtime = {
  idDriver: number;
  userId: number;
  status: "disponivel" | "desligado" | "corrida" | "boarding" | "accepted" | "in_progress";
  latitude?: string | number;
  longitude?: string | number;
  profileImage: string;
  userName: string;
  userPhone: string;
  userNickname: string;
  nickname: string;
  driverRegisterStatusId: number;
  userTypeId: number;
  userRating: number;
  userType: string;
  vehicleType?: string | null;
  driverRegisterStatus: string;
  cityId: number;
  lastConnection?: Date;
  lastSocketClientId?: string;
  car?: any;
  name?: string;
  updatedAt?: string;
}
