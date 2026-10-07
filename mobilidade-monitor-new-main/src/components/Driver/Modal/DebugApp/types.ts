export interface ConfigDriver {
	created_at: string;
	driverId: number;
	id: number;
	permissionGps: number;
	permissionIgnoreBatteryOptimization: number;
	permissionLocationBackground: number;
	permissionSystemOverlay: number;
	permissionWriteExternalStorage: number;
	statusId: number;
	updated_at: string;
	version: string;
}

export interface ConfigDriverArray extends Array<ConfigDriver> {}

export interface ModalProps {
	visibility: boolean;
	handleCloseModal: () => void;
	driverConfigs: ConfigDriverArray;
	driverId: number;
	page: number;
	nextPageDebugApp: string;
	debugAppInfo: (idDriver: number, page?: number, date?: string) => void;
}
