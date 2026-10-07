import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { Container, Content, Input, Button, Loader } from './styles';
import api from '../../../../services/api';
import Session from '../../../../utils/Session';
import Alert from '../../../../components/Utils/Alert';

interface CityProps {
	cityId: number;
	nome: string;
	polygon: any;
	shortName: string;
}

interface DataZoneProps {
	cityId: number;
	greaterRadius: number;
	idZone: number;
	longDistanceRadius: number;
	radius: number;
}

type TypeMessageAlertProps = 'success' | 'info' | 'warning' | 'error';

const CallRadius = () => {
	/*eslint-disable*/
	const city = Session.getLocal('citySelected') as CityProps;

	const [dataZone, setDataZone] = useState<DataZoneProps>();
	const [valueRadius, setValueRadius] = useState<number>();
	const [valueGreaterRadius, setValueGreaterRadius] = useState<number>();
	const [loading, setLoading] = useState<boolean>(false);
	const [messageAlert, setMessageAlert] = useState<string>('');
	const [showMessageAlert, setShowMessageAlert] = useState<boolean>(false);
	const [typeMessageAlert, setTypeMessageAlert] =
		useState<TypeMessageAlertProps>('success');

	const handleCallMessageAlert = (
		message: string,
		type: TypeMessageAlertProps,
	) => {
		setMessageAlert(message);
		setTypeMessageAlert(type);
		setShowMessageAlert(true);
	};

	const handleGetDataZone = () => {
		setLoading(true);
		api.get(`city/${city.cityId}/zone`)
			.then((response) => {
				setLoading(false);
				setDataZone(response.data.response);
			})
			.catch((error) => {
				setLoading(false);
				handleCallMessageAlert('Erro na requisição!', 'error');
				console.log(error);
			});
	};

	const handleChangeRadius = (event: React.FormEvent) => {
		event.preventDefault();

		swal({
			title: 'Deseja mudar o raio de chamado?',
			text: 'Essa modificação irá alterar drasticamente o seu app',
			icon: 'info',
			buttons: ['Não', 'Sim'],
		}).then((isAccept) => {
			if (isAccept) {
				setLoading(true);
				api.put(`city/${city.cityId}/zone/${dataZone?.idZone}`, {
					greaterRadius: valueGreaterRadius,
					radius: valueRadius,
				})
					.then((response) => {
						setLoading(false);
						if (response.data.status) {
							handleCallMessageAlert(
								'Raio de chamamento atualizado!',
								'success',
							);
						}
					})
					.catch((error) => {
						setLoading(false);
						console.log(error);
						handleCallMessageAlert('Erro ao atualizar!', 'error');
					});
			}
		});
	};

	useEffect(() => {
		handleGetDataZone();
	}, []);

	useEffect(() => {
		setValueRadius(dataZone?.radius);
		setValueGreaterRadius(dataZone?.greaterRadius);
	}, [dataZone]);

	if (loading) return <Loader />;

	return (
		<Container>
			<Alert
				message={messageAlert}
				typeAlert={typeMessageAlert}
				visibility={showMessageAlert}
				setVisibility={setShowMessageAlert}
			/>
			<Content>
				<form onSubmit={handleChangeRadius}>
					<div>
						<label htmlFor="first_radius">Primeiro Raio</label>
						<Input
							id="first_radius"
							name="first_radius"
							type="number"
							value={valueRadius}
							onChange={(event) =>
								setValueRadius(Number(event.target.value))
							}
						/>
					</div>
					<div>
						<label htmlFor="second_radius">Segundo Raio</label>
						<Input
							id="second_radius"
							name="second_radius"
							type="number"
							value={valueGreaterRadius}
							onChange={(event) => {
								setValueGreaterRadius(Number(event.target.value));
							}}
						/>
					</div>
					<Button type="submit">Salvar</Button>
				</form>
			</Content>
		</Container>
	);
};
export default CallRadius;
