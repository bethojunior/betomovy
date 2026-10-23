import { Button, Modal } from 'antd';
import { FC } from 'react';
import Mask from '../../../../../services/Mask';
import { Constants } from '../../../../../utils/constants';
import {
	ModalBody,
	ImageContainer,
	ClientName,
	InformationContainer,
	Columns,
	ResponseContainer,
	Title,
	Information,
} from './styles';

interface UserInformationProps {
	profileImage: string;
	name: string;
	document: string;
	email: string;
	gender: string;
	phone: string;
	rg: string;
	status: string;
	quantityTripsFinished: number;
	voucherBalance: number;
	city: string;
}

interface ProfileProps {
	showProfileModal: boolean;
	setShowProfileModal: (res: boolean) => void;
	userInformation: UserInformationProps | undefined;
}

const ClientProfileModal: FC<ProfileProps> = ({
	showProfileModal,
	setShowProfileModal,
	userInformation,
}) => {
	const handleOk = () => {
		setShowProfileModal(false);
	};

	const handleCancel = () => {
		setShowProfileModal(false);
	};

	const iconClient = import.meta.env.S3_LINK;

	return (
		<>
			<Modal
				title="Perfil do cliente"
				width={800}
				visible={showProfileModal}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button key="back" onClick={handleCancel}>
						Fechar
					</Button>,
				]}
			>
				<ModalBody>
					<ImageContainer src={userInformation?.profileImage || Constants.defaultImgNotFound}
						onError={(e) => {
						e.currentTarget.onerror = null;
						e.currentTarget.src = Constants.defaultImgNotFound;
					}}
					/>
					<div style={{ width: '100%' }}>
						<ClientName>{userInformation?.name}</ClientName>
						<InformationContainer>
							<Columns>
								<ResponseContainer>
									<Title>Status</Title>
									<Information>{userInformation?.status}</Information>
								</ResponseContainer>
								<ResponseContainer>
									<Title>Viagens finalizadas</Title>
									<Information>
										{userInformation?.quantityTripsFinished || '0'}
									</Information>
								</ResponseContainer>
								<ResponseContainer>
									<Title>Voucher</Title>
									<Information>
										{userInformation?.voucherBalance.toLocaleString(
											'pt-br',
											{
												style: 'currency',
												currency: 'BRL',
											},
										) || 'R$ 0,00'}
									</Information>
								</ResponseContainer>
							</Columns>
							<Columns>
								<ResponseContainer>
									<Title>RG</Title>
									<Information>
										{Mask.setMaskRg(String(userInformation?.rg)) ||
											'Não informado'}
									</Information>
								</ResponseContainer>
								<ResponseContainer>
									<Title>Telefone</Title>
									<Information>
										{Mask.setMaskPhoneValue(
											String(userInformation?.phone),
										) || 'Não informado'}
									</Information>
								</ResponseContainer>
								<ResponseContainer>
									<Title>CPF</Title>
									<Information>
										{Mask.setMaskCpf(
											Mask.setRemoveMaskCpf(
												String(userInformation?.document),
											),
										) || 'Não informado'}
									</Information>
								</ResponseContainer>
							</Columns>
							<Columns>
								<ResponseContainer>
									<Title>E-mail</Title>
									<Information>
										{userInformation?.email || 'Não informado'}
									</Information>
								</ResponseContainer>
								<ResponseContainer>
									<Title>Gênero</Title>
									<Information>
										{userInformation?.gender || 'Não informado'}
									</Information>
								</ResponseContainer>
								<ResponseContainer>
									<Title>Cidade</Title>
									<Information>
										{userInformation?.city || 'Não informado'}
									</Information>
								</ResponseContainer>
							</Columns>
						</InformationContainer>
					</div>
				</ModalBody>
			</Modal>
		</>
	);
};

export default ClientProfileModal;
