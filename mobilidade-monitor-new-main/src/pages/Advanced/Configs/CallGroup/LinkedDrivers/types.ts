import { ICallGroupProps } from "../ListCallGroups/types";


type UserLinkedDriversProps = {
  idUser: number;
  name: string;
  nickname: string;
  phone: string;
  email: string;
};

type DriversLinkedProps = {
  idDriver: number;
  userId: number;
  profileImage: string;
  user: UserLinkedDriversProps;
};

export interface ILinkedDrivers {
  id: number;
  driverId: number;
  call_group_id: number;
  created_at: string;
  updated_at: string;
  call_groups: ICallGroupProps;
  drivers: DriversLinkedProps;
}
