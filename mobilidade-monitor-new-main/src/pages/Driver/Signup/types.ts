export interface FormsStepProps {
	created_at: Date;
	description: string;
	formStepId: number;
	id: number;
	statusId: string;
	step: string;
	updated_at: Date;
	userTypeId: string;
}

export interface CarsProps {
	licensePlate: string;
	renavam: string;
	markCar: string;
	modelCar: string;
	colorCar: string;
	numberSeatingCar: string;
	year: string;
}

export interface ImagesDocumentsProps {
	data: any;
	name: string;
}

export interface DocumentsProps {
	docId: string;
	image: ImagesDocumentsProps;
	inArray: boolean;
}

export interface DocumentsDriverProps {
	docId: string;
	text?: string;
}
export interface DriverUserProps {
	userTypeId: string;
	name: string;
	nickname: string;
	phone: string;
	password: string;
	document: string;
	gender: string;
	email: string;
	stationId: string;
	cityId: string;
	cooperativeId: string;
	militaryUser: string;
	cnh: string;
	created_at: string;
	hasCardReader: boolean;
	numberCNH: any;
	numberCRLV: string;
	numberAlvara: any;
	numberCriminalRecord: any;
	docs: DocumentsDriverProps[];
	rentalCarl: boolean;
	rentalCompanyDocument: string;
}

export interface ProfileProps {
	data: any;
	name: string;
}
export interface ImageDocumentsProps {
	CNH: any;
	CRLV: any;
	ALVARA: any;
	PROFILE: ProfileProps;
	CRIMINAL_RECORD: any;
	PROOF_OF_RESIDENCE: any;
	RG_FRONT: any;
	RG_BACK: any;
	DOCUMENTS: DocumentsProps[];
}
export interface DatasUserProps {
	driver: DriverUserProps;
	image: ImageDocumentsProps;
	car: CarsProps;
}

export interface DatasFormProps {
	dataPersonal: {
		cpf_cnpj: string;
		email: string;
		gender: string;
		name: string;
		phone: string;
	};
	datasVehicle: {
		brandCar: string;
		colorCar: string;
		documentCar: string;
		modelCar: string;
		numberRenavam: string;
		numberSeats: string;
		plateCar: string;
		yearCar: string;
	};
	docs: DocumentsDriverProps[];
	documentChoosed: DocumentsProps[];
	imageProfile: {
		data: File;
		imageChoosed: string;
	};
	stateSelected: {
		city: string;
	};
}
