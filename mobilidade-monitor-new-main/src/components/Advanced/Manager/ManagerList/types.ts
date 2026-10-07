export interface User {
  idUser: number;
  name: string;
  phone: string;
  email: string;
}

export interface ManagerType {
  id: number;
  balanceId: number;
  userId: number;
  managerRegisterStatusId: number;
  cityId: number;
  valueCommission: number;
  valueTypeCommission: string;
  partnerCommission: number;
  partnerTypeCommission: string;
  user: User;
}

export interface ManagerResponse {
  status: boolean;
  response: ManagerType[];
  message: string;
}

export interface UserResponse {
  status: boolean;
  response: User[];
  message: string;
}

export interface City {
  cityId: number;
  nome: string;
}
