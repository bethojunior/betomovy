import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';
import Preload from '../../../../components/Utils/Preload';
import { Container, Content, Loader } from './style';
import CardCodeConfirmation from '../../../../components/Advanced/Config/CodeConfirmation';
import Alert from '../../../../components/Utils/Alert';

interface ConfirmationCodeCustomerProps {
	compelField: number;
	description: string;
	field: string;
	id: number;
	required: number;
	userTypeId: number;
}

interface ExternalServicesProps {
	id: number;
	name: string;
}

interface ExternalServiceActivesProps {
	externalServiceActionId: number;
	externalServiceTypeId: number;
	external_service_action: ExternalServicesProps;
	external_service_type: ExternalServicesProps;
	id: number;
	status: number;
}

type TypeMessageAlert = 'success' | 'info' | 'warning' | 'error';

const ConfirmationCode = () => {
	/*eslint-disable*/
	const [loading, setLoading] = useState<boolean>(false);
	const [confirmationCodeCustomer, setConfirmationCodeCustomer] = useState<
		ConfirmationCodeCustomerProps[]
	>([]);
	const [externalServiceActive, setExternalServiceActive] = useState<
		ExternalServiceActivesProps[]
	>([]);

	const [messageAlert, setMessageAlert] = useState<string>('');
	const [typeMessageAlert, setTypeMessageAlert] =
		useState<TypeMessageAlert>('success');
	const [showAlert, setShowAlert] = useState<boolean>(false);

	const handleMessageAlert = (message: string, type: TypeMessageAlert) => {
		setShowAlert(true);
		setMessageAlert(message);
		setTypeMessageAlert(type);
	};

	const getAllDatas = async () => {
		setLoading(true);
		const responseConfirmationCodeCustomer = await api.get(
			'requiredField/confirmationCodeCustomer',
		);
		const responseExternalServiceActive = await api.get(
			'externalServiceActiveChannel',
		);
		const responseExternalServiceType = await api.get(
			'externalServiceType?externalServiceGroupId=1',
		);

		Promise.all([
			responseConfirmationCodeCustomer,
			responseExternalServiceActive,
			responseExternalServiceType,
		])
			.then((values) => {
				setConfirmationCodeCustomer(values[0].data.response);
				setExternalServiceActive(values[1].data.response);
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
				handleMessageAlert('Erro nas requisições!', 'error');
			});
	};

	useEffect(() => {
		getAllDatas();
	}, []);

	const handleChangeConfirmCode = (
		dataInput: HTMLInputElement,
		isChecked: number,
	) => {
		setLoading(true);
		api.put('requiredField/changeConfirmationCode', {
			type: dataInput.name === 'validateSms' ? 'sms' : 'email',
			value: isChecked ? false : true,
		})
			.then((response) => {
				if (response.data.status) {
					setLoading(false);
					handleMessageAlert(
						'Tipo de código de confirmação alterado com sucesso!',
						'success',
					);
					getAllDatas();
				}
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
				handleMessageAlert(
					'Erro ao alterar o código de confirmação!',
					'error',
				);
			});
	};

	const handleChangeExternalServiceChannel = (
		id: number,
		currentStatus: number,
	) => {
		setLoading(true);
		api.put(`externalServiceActiveChannel/${id}`, {
			status: currentStatus === 1 ? 0 : 1,
		})
			.then((response) => {
				setLoading(false);
				if (response.data.status) {
					handleMessageAlert('Alteração feita com sucesso!', 'success');
					getAllDatas();
				}
			})
			.catch((error) => {
				setLoading(false);
				handleMessageAlert('Erro ao fazer a alteração!', 'error');
				console.log(error);
			});
	};

	if (loading) return <Loader spinning />;

	return (
		<Container>
			<Preload visible={loading} />
			<Alert
				message={messageAlert}
				typeAlert={typeMessageAlert}
				visibility={showAlert}
				setVisibility={setShowAlert}
			/>
			<Content>
				<CardCodeConfirmation
					title="Tipo do código de confirmação do cliente"
					content={confirmationCodeCustomer.map((value) => {
						return (
							<React.Fragment key={value.id}>
								<div>
									<input
										onChange={(event) =>
											handleChangeConfirmCode(
												event.target,
												value.compelField,
											)
										}
										type="checkbox"
										value={value.compelField}
										name={value.field}
										id={value.field}
										checked={value.compelField ? true : false}
									/>
									<label htmlFor={value.field}>
										{value.description}
									</label>
								</div>
							</React.Fragment>
						);
					})}
				/>
				{Object.values(
					externalServiceActive.reduce((acc: any, curr) => {
						const actionId = curr.external_service_action.id;
						if (!acc[actionId]) {
							acc[actionId] = {
								action: curr.external_service_action,
								channels: [],
							};
						}
						acc[actionId].channels.push(curr);
						return acc;
					}, {}),
				).map(({ action, channels }: any) => (
					<CardCodeConfirmation
						key={action.id}
						title={action.name}
						content={channels.map(
							(channel: ExternalServiceActivesProps) => (
								<React.Fragment key={channel.id}>
									<div>
										<input
											type="checkbox"
											checked={channel.status === 1}
											onChange={() =>
												handleChangeExternalServiceChannel(
													channel.id,
													channel.status,
												)
											}
										/>
										<label>
											{channel.external_service_type.name}
										</label>
									</div>
								</React.Fragment>
							),
						)}
					/>
				))}
			</Content>
		</Container>
	);
};

export default ConfirmationCode;
