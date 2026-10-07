declare type ChildrenTypeProps = {children: React.ReactNode}

export interface ClientSearchProps {
	label: string;
	value: {
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
}

export interface DriverSearchProps {
	label: string;
	value: {
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
		state: string;
		station: string;
		userType: string;
		userTypeId: number;
	}
}
export interface SessionCitiesProps {
    cityId: string;
    nome: string;
    shortName: string;
    polygon: string;
}

export type AlertProps = 'success' | 'info' | 'warning' | 'error' | 'success';

export type MonitoringMapProps = {
	onMapLoaded: () => void;
	trips: TripDto[];
	drivers: DriverRealtime[];
	driversRef?: React.MutableRefObject<DriverRealtime[]>;
	driversUpdateKey?: number;
	tripsLoading?: boolean;
	driverRecencyMode?: 'all' | 'recent';
	mobileLayoutKey?: string | number;
	selectedArea?: SelectedMonitoringArea | null;
	onAreaChange?: (area: SelectedMonitoringArea | null) => void;
	/** Mobile Monitoring, aba Mapa: linha do mapa com slot à direita do hamburger para o select de cidade. */
	mountMobileMapCityRow?: boolean;
	/** Ref do slot no mapa para portal do select (aba Mapa). */
	onMobileCitySelectSlotChange?: (element: HTMLElement | null) => void;
}

export type DriversMarkersProps = {
  driversRef: React.MutableRefObject<DriverRealtime[]>;
  selectedArea?: { area: { lat: number; lng: number }[] } | null;
  selectedDriver?: DriverRealtime | null;
  driversUpdateKey?: number;
  tripStatusByDriverId?: Record<number, string>;
  tripsLoading?: boolean;
  onDriverClick?: (driver: DriverRealtime) => void;
}

export type LocationsProps = {
  last_lat?: string;
  last_lon?: string;
  latitude?: string;
  longitude?: string;
  originLatitude?: string;
  originLongitude?: string;
  date?: any;
  neighborhood?: string;
}

export type ActiveCustomerProps = {
  name: string;
  email?: string;
  phone?: string;
  latitude: string | number;
  longitude: string | number;
  cityId: number;
}

export type SelectedMonitoringArea = {
  id: number;
  name: string;
  cityId: number;
  active: number;
  area: { lat: number; lng: number }[];
}

export type CustomerAreaHeatMapItem = {
  last_lat: string;
  last_lon: string;
};

export type CustomerAreaHeatMapProps = CustomerAreaHeatMapItem[];
