export interface StateData {
  countryId: number;
  id: number;
  name: string;
  sigla: string;
  statusId: number;
}

export type StateInterface = StateData[];

export interface CityData {
  estado: number;
  id: number;
  nome: string;
  shortName: string | null;
}

export type LegalSearchBy = "fantasyName" | "document" | "phone";

export interface UseClientLegalListReturn {
  listLegalPerson: Data[];
  loading: boolean;
  hasMore: boolean;
  filters: {
    valueSearch: string;
    filter: LegalSearchBy;
  };
  setValueSearch: (value: string) => void;
  setFilter: (value: LegalSearchBy) => void;
  fetchMore: () => void;
  refresh: () => void;
  setListLegalPerson: React.Dispatch<React.SetStateAction<Data[]>>;
}

export interface Data {
	address: string;
	balance: { idBalance: number; tripBalance: number };
	balanceId: number;
	billingDay: number;
	cityId: number;
	companyRegisterStatusId: number;
	company_register_status: { id: number; name: string };
	created_at: string;
	document: string;
	email: string;
	establishmentCollectionManagementId: string;
	facebook: string;
	fantasyName: string;
	id: number;
	instagram: string;
	latitude: string;
	logo_picture: string;
	longitude: string;
	name: string;
	observation: string;
	phone: string;
	registration: string;
	site: string;
	updated_at: string;
	voucherLimit: number;
	stateId: number;
}