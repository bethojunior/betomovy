export class DriverLocationDTO {
  idDriver: number;
  driverId?: number;
  userId: number;
  status: string;
  lastLat?: string;
  lastLon?: string;
  latitude?: string;
  longitude?: string;
  profileImage: string;
  userName: string;
  userPhone: string;
  userNickname: string;
  driverRegisterStatusId: number;
  userTypeId: number;
  userRating: number;
  userType: string;
  driverRegisterStatus: string;
  cityName?: string;
  cityId: number;
  tripReference?: string;
  lastConnection?: Date;
  lastSocketClientId?: string;
  car?: any;

  constructor(partial: Partial<DriverLocationDTO>) {
    Object.assign(this, partial);
  }
}

export type TypeDriverLocationDTO = {
  idDriver: number;
  driverId?: number;
  userId: number;
  status: string;
  lastLat?: string | number;
  lastLon?: string | number;
  latitude?: string | number;
  longitude?: string | number;
  profileImage: string;
  userName: string;
  userPhone: string;
  userNickname: string;
  driverRegisterStatusId: number;
  userTypeId: number;
  userRating: number;
  userType: string;
  driverRegisterStatus: string;
  cityName?: string;
  cityId: number;
  tripReference?: string;
  lastConnection?: Date;
  lastSocketClientId?: string;
  car?: any;
  ts?: number;
};
