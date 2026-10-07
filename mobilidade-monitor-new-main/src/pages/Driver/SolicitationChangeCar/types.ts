export interface CarPendingRequestItem {
	brand: string;
	carTypeId: number | null;
	cityId: number;
	color: string;
	created_at: Date;
	deleted_at: Date;
	document: string | null;
	driverName: string;
	idCar: number;
	idDriver: number;
	idUser: number;
	model: string;
	pending: number;
	plate: string;
	renavam: string;
	rentalCar: any;
	rentalCompanyDocument: any;
	seatsNumber: number;
	updated_at: Date;
	year: string;
}

export interface PaginationMeta {
	current_page: number;
	data: CarPendingRequestItem[];
	first_page_url: string;
	from: any;
	last_page: number;
	last_page_url: string;
	next_page_url: string;
	path: string;
	per_page: number;
	prev_page_url: string;
	to: any;
	total: number;
}

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface UseCarPendingRequestsReturn {
	data: CarPendingRequestItem[];
	pagination: PaginationMeta | undefined;
	loading: boolean;
	page: number;
	goToPage: (page: number) => void;
	listAll: boolean;
	toggleListAll: () => void;
	approve: (idCar: number) => Promise<boolean>;
	reject: (idCar: number) => Promise<boolean>;
}
