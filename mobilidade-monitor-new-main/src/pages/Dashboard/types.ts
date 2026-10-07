export interface DatasDashboardProps {
  canceledbyCustomer: number;
  canceledbyDriver: number;
  paidOutCreditCard: number;
  paidOutMoney: number;
  paidOutVoucher: number;
  ticketMedia: number;
  totalBilled: number;
  todayTotalTrips: number;
  totalCanceled: number;
  totalTrips: number;
  tripAccepted: number;
  tripFinished: number;
}

export interface ClientRankingDataProps {
  idUser: number;
  name: string;
  quantityTrips: number;
  totalValue: number;
  phone?: string;
}

export interface DriversRankingDataProps {
  idDriver: number;
  name: string;
  quantityTrips: number;
  totalValue: number;
  phone?: string;
}

export interface ApiRankingDriverRaw {
  idDriver: number;
  name: string;
  quantityTrips: number;
  totalValue: string | number;
  phone?: string;
}

export interface ApiRankingClientRaw {
  idUser: number;
  name: string;
  quantityTrips: number;
  totalValue: string | number;
  phone?: string;
}

export interface CurrentQuantitiesProps {
  active: number;
  blocked: number;
  pending: number;
  total: number;
  type: string;
  picture?: string;
  waiting_answer?: number;
}

export interface ListCurrentQuantitiesProps {
  customers: CurrentQuantitiesProps[];
  customers_polygon: CurrentQuantitiesProps[];
  drivers: CurrentQuantitiesProps[];
}

export interface DriversData {
  picture: string;
  active: string;
  blacklist: string;
  blocked: string;
  pending: string;
  total: string;
  type: string;
  waiting_answer: string;
}

export interface UsersActivesProps {
  customerActives: {
    customerActives: number;
  };
  driverActives: {
    driversActives: number;
  };
}

export interface PercentProps {
  [key: string]: number;
}

export type RankingPeriod = "day" | "month" | "all";

export interface ModalParabensState {
  open: boolean;
  name: string;
  quantityTrips: number;
  phone?: string;
  type: "driver" | "client";
}
