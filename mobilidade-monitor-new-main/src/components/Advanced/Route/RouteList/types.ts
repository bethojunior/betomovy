import { ReactNode } from "react";

export interface RouteData {
  id: number;
  name: string;
  origin: {
    address: string;
    tag?: string;
    complement?: string;
  };
  destination: {
    address: string;
    tag?: string;
    complement?: string;
  };
  route_trip_item_types?: RouteTripItemType[];
  active: number;
}

export interface CorporateUser {
  name: ReactNode;
  id: number;
  routeId: number;
  companyId: number;
  statusId: number;
  created_at: string;
  updated_at: string;
  company: {
    id: number;
    name: string;
    fantasyName: string;
    address: string;
    document: string;
    cityId: number;
    email: string | null;
    phone: string;
    voucherLimit: number;
    latitude: number | null;
    longitude: number | null;
    site: string | null;
    instagram: string | null;
    billingDay: number;
    facebook: string | null;
    logo_picture: string | null;
    balanceId: number;
    companyRegisterStatusId: number;
    created_at: string;
    updated_at: string;
    establishmentCollectionManagementId: number;
    registration: string;
    observation: string;
  };
}

export interface RouteTripItemType {
  id: number;
  routeId: number;
  tripItemTypeId: number;
  value: number;
  trip_item_type: {
    id: number;
    name: string;
    picture: string;
  };
}
