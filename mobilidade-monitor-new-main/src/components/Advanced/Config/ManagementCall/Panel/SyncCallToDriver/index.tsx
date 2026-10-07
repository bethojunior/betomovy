import { FC, useEffect, useState } from 'react';
import { Checkbox, Select } from 'antd';
import { CheboxContent, Title, Selectt, Loader } from './styles';
import Alert from '../../../../../Utils/Alert';
import api from '../../../../../../services/api';

const { Option } = Select;

interface DriverArray extends Array<Driver> {}

interface Driver {
	description: string;
	iconMapDriverId: number;
	idUserType: number;
	isActive: number;
	isDeliveryMan: number;
	isDriver: number;
	name: string;
	picture: string;
}

interface TripTypeOfDriverArray extends Array<TripTypeOfDriver> {}

interface TripTypeOfDriver {
	id: number;
	tripTypeId: number;
	userTypeId: number;
	user_type: {
		description: string;
		idUserType: number;
		isActive: boolean;
		isDriver: boolean;
		name: string;
		picture: string;
	};
}

interface TripTypeDriverArray extends Array<TripTypeDriver> {}

interface TripTypeDriver {
	deliveryOption: boolean;
	description: string;
	freightOption: number;
	gender_id: number;
	idTripType: number;
	messageNoDriversFound: string;
	onlyCentral: boolean;
	openPrice: number;
	order: number;
	picture: string;
	returnOption: number;
	showType: number;
	trip_type_drivers: TripTypeOfDriverArray;
}

interface TripTypeArray extends Array<TripType> {}

interface TripType {
	deliveryOption: number;
	description: string;
	freightOption: number;
	gender: {
		id: number;
		name: string;
	};
	gender_id: number;
	idTripType: number;
	messageNoDriversFound: string;
	onlyCentral: boolean;
	picture: string;
	returnOption: number;
	showType: number;
	type: string;
}

interface DriverArray extends Array<Driver> {}

interface Driver {
	description: string;
	iconMapDriverId: number;
	idUserType: number;
	isActive: number;
	isDeliveryMan: number;
	isDriver: number;
	name: string;
	picture: string;
}

const SyncCallToDriver: FC = () => {
	const [loading, setLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [messageAlert, setMessageAlert] = useState('');
	const [typeAlert, setTypeAlert] = useState<
		'success' | 'info' | 'warning' | 'error'
	>('success');

	const [typeSelectedToSync, setTypeSelectedToSync] = useState<Array<number>>(
		[],
	);
	const [listTripTypeDriver, setListTripTypeDriver] =
		useState<TripTypeDriverArray>([]);
	const [showListDriverType, setShowListDriverType] = useState(false);
	const [idOfCallSelected, setIdOfCallSelected] = useState(0);
	const [disabledTypes, setDisabledTypes] =
		useState<Array<number | undefined>>();
	const [tripType, setTripType] = useState<TripTypeArray>([]);
	const [driver, setDriver] = useState<DriverArray>([]);

	const [selectedTripTypeId, setSelectedTripTypeId] = useState<number | undefined>(undefined);


	const getTripTypeDriver = () => {
		setLoading(true);
		const requestTypeDriver = api('tripTypeDriver');
		const requestTripType = api('tripType');
		const requestDrivers = api('userType/drivers');

		Promise.all([requestTypeDriver, requestTripType, requestDrivers]).then(
			(result) => {
				setLoading(false);
				if (!result[0].data.status) {
					setMessageAlert(
						'Ocorreu um erro ao carregar as informações, tente novamente',
					);
					setTypeAlert('error');
					return setShowAlert(true);
				}
				setListTripTypeDriver(result[0].data.response);
				setTripType(result[1].data.response);
				return setDriver(result[2].data.response);
			},
		);
	};

	useEffect(() => {
		getTripTypeDriver();
	}, []);

	const mountListTypeDriver = (id: number) => {
		setIdOfCallSelected(id);
		const typeSelected = listTripTypeDriver.find(
			(el) => el.idTripType === id,
		);

		if (typeSelected?.trip_type_drivers) {
			setTypeSelectedToSync([
				...typeSelected?.trip_type_drivers
					.filter((item) => item.user_type)
					.map((item: TripTypeOfDriver) => item.userTypeId),
			]);
			setShowListDriverType(true);
		}

		setDisabledTypes(
			typeSelected?.trip_type_drivers
				.filter((item) => item.user_type === null)
				.map((item: TripTypeOfDriver) => item.userTypeId),
		);
	};

	const editSync = (id: number, checked: boolean) => {
		setLoading(true);
		const tripTypeDriver = [
			{
				tripTypeId: idOfCallSelected,
				userTypeId: id,
			},
		];

		if (checked) {
			api.post(`tripTypeDriver`, {
				tripTypeDriver,
			}).then((result) => {
				setLoading(false);
				if (!result.data.status) {
					setMessageAlert(
						'Ocorreu um erro ao adicionar esse tipo de motorista, tente novamente',
					);
					setTypeAlert('error');
					return setShowAlert(true);
				}

				setTypeSelectedToSync([...typeSelectedToSync, id]);

				setMessageAlert('Motorista vinculado com sucesso!');
				setTypeAlert('success');
				return setShowAlert(true);
			});
		} else {
			api.delete(`tripTypeDriver`, {
				data: {
					tripTypeDriver,
				},
			}).then((result) => {
				setLoading(false);
				if (!result.data.status) {
					setMessageAlert(
						'Ocorreu um erro ao remover esse tipo de motorista, tente novamente',
					);
					setTypeAlert('error');
					return setShowAlert(true);
				}

				setTypeSelectedToSync(typeSelectedToSync.filter((el) => el !== id));

				setMessageAlert('Tipo de motorista removido com sucesso!');
				setTypeAlert('success');
				return setShowAlert(true);
			});
		}
	};
	if (loading) return <Loader spinning />;

	return (
		<div>
			 
			<Alert
				visibility={showAlert}
				message={messageAlert}
				typeAlert={typeAlert}
				setVisibility={setShowAlert}
			/>
			<Selectt
				value={selectedTripTypeId}
				placeholder="Selecione um tipo de chamado"
				onChange={(e) => {
					const selectedId = Number(e);
					setSelectedTripTypeId(selectedId);
					mountListTypeDriver(selectedId);
				}}
				>
				{tripType.map((type) => (
					<Option key={type.idTripType} value={type.idTripType}>
					{type.type}
					</Option>
				))}
			</Selectt>
			{showListDriverType && (
				<div>
					<Title>
						Selecione os tipos de motoristas que corresponderão ao chamado
						selecionado
					</Title>
					<CheboxContent>
						{driver.map((typeDriver) => {
							return (
								<Checkbox
									checked={typeSelectedToSync.some(
										(el: number) =>
											Number(el) === typeDriver.idUserType,
									)}
									disabled={disabledTypes?.some(
										(el: number | undefined) =>
											el === typeDriver.idUserType,
									)}
									key={typeDriver.idUserType}
									id={String(typeDriver.idUserType)}
									onChange={(e) =>
										editSync(Number(e.target.id), e.target.checked)
									}
								>
									{typeDriver.name}
								</Checkbox>
							);
						})}
					</CheboxContent>
				</div>
			)}
		</div>
	);
};

export default SyncCallToDriver;
