import { Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import swal from 'sweetalert';
import api from '../../../../services/api';
import { Constants } from '../../../../utils/constants';
import {
	Title,
	Section,
	DriverImage,
	Content,
	Columns,
	Name,
	DriverModal,
	GeneralContent,
	ContentInformation,
	Information,
} from './styles';
import Preload from '../../../Utils/Preload';
import Mask from '../../../../services/Mask';

interface Data {
	balance: number;
	bankAccountDocument: string;
	bankName: string;
	bankNumber: number;
	blockedBalance: number;
	brand: string;
	cnh: string;
	cnhPicture: string;
	color: string;
	document: string;
	email: string;
	gender: string;
	holderName: string;
	idDriver: number;
	idUser: number;
	model: string;
	name: string;
	nickname: string;
	numberAccount: number;
	numberAccountDigit: number;
	observation: string;
	om: number;
	op: number;
	phone: string;
	pix: string;
	plate: string;
	prepaid: number;
	profileImage: string;
	registerStatus: string;
	rentalCar: string;
	seatsNumber: number;
	status: string;
	userId: number;
	userType: string;
}

interface ModalProps {
	visibility: boolean;
	handleCloseModal: () => void;
	driverId: number | undefined;
}
const DriverProfile: FC<ModalProps> = ({
	visibility,
	handleCloseModal,
	driverId,
}) => {
	const [data, setData] = useState<Data>();
	const [showData, setShowData] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (visibility) {
			setLoading(true);
			api(`driver/${driverId}`)
				.then((result) => {
					const { response } = result.request;
					if (!JSON.parse(response).status) {
						return swal({
							title: 'Não foi possível mostrar o detalhamento',
							text: 'Tente novamente',
							icon: 'error',
						});
					}
					setLoading(false);
					return setData(result.data.response);
				})
				.finally(() => {
					setShowData(visibility);
				});
		}
	}, [driverId, visibility]);

	return (
		<>
			<Preload visible={loading} />
			<DriverModal
				title="Perfil do motorista"
				visible={showData}
				width={800}
				onCancel={() => {
					setShowData(false);
					handleCloseModal();
				}}
				footer={[
					<Button
						key="back"
						onClick={() => {
							setShowData(false);
							handleCloseModal();
						}}
					>
						Fechar
					</Button>,
				]}
			>
				<Content>
					<DriverImage
						src={
							`${Constants.url_photo_driver}${data?.profileImage}`
								? `${Constants.url_photo_driver}${data?.profileImage}`
								: Constants.url_photo_customer
						}
					/>
					<GeneralContent>
						<Name>{data?.name}</Name>
						<ContentInformation>
							<Columns>
								<Section>
									<Title>Status</Title>
									<Information style={{ textTransform: 'capitalize' }}>
										{data?.status}
									</Information>
								</Section>
								<Section>
									<Title>Saldo</Title>
									<Information>
										{' '}
										R${' '}
										{Mask.setMaskMoneyNumber(Number(data?.balance))}
									</Information>
								</Section>
								<Section>
									<Title>Saldo bloqueado</Title>
									<Information>
										R${' '}
										{Mask.setMaskMoneyNumber(
											Number(data?.blockedBalance),
										) || '0,00'}
									</Information>
								</Section>
							</Columns>
							<Columns>
								<Section>
									<Title>E-mail</Title>
									<Information>
										{data?.email || 'Não informado'}
									</Information>
								</Section>
								<Section>
									<Title>Telefone</Title>
									<Information>
										{data?.phone || 'Não informado'}
									</Information>
								</Section>
								<Section>
									<Title>CPF/CNPJ</Title>
									<Information>
										{data?.document || 'Não informado'}
									</Information>
								</Section>
							</Columns>
							<Columns>
								<Section>
									<Title>CNH</Title>
									<Information>
										{data?.cnh || 'Não informado'}
									</Information>
								</Section>
								<Section>
									<Title>Gênero</Title>
									<Information style={{ textTransform: 'capitalize' }}>
										{data?.gender || 'Não informado'}
									</Information>
								</Section>
								<Section>
									<Title>Carro </Title>
									<Information style={{ marginBottom: 0 }}>
										{data?.model || ''}
									</Information>
									<Information style={{ marginBottom: 0 }}>
										{data?.brand || ''}, {data?.color || ''}
									</Information>
								</Section>
							</Columns>
						</ContentInformation>
					</GeneralContent>
				</Content>
			</DriverModal>
		</>
	);
};

export default DriverProfile;
