import { useState } from 'react';
import swal from 'sweetalert';
import { Table, Pagination, Modal, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AiOutlineInbox } from 'react-icons/ai';
import { TbCheck } from 'react-icons/tb';
import { CgClose } from 'react-icons/cg';
import { FiExternalLink } from 'react-icons/fi';
import {
	Container,
	ContentHeader,
	ContentTable,
	ContentBtnActions,
	ButtonTypeList,
	BrandCell,
	BrandIcon,
	DocumentThumbnail,
	DocumentPreviewImage,
	EmptyState,
	ContentPagination,
} from './style';
import Alert from '../../../components/Utils/Alert';
import { theme_colors } from '../../../theme/theme';
import { vehicleBrandIcons } from '../../../constants/vehicleBrands';
import { useCarPendingRequests } from '../../../hooks/useCarPendingRequests';
import { AlertType, CarPendingRequestItem } from './types';

const SolicitationChangeCar = () => {
	const { data, pagination, loading, page, goToPage, listAll, toggleListAll, approve, reject } =
		useCarPendingRequests();

	const [messageAlert, setMessageAlert] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [typeAlert, setTypeAlert] = useState<AlertType>('success');
	const [previewDocument, setPreviewDocument] = useState<string | null>(null);

	const dataUserLogged = localStorage.getItem('@App:user') as string;
	const dataUserLoggedJson = JSON.parse(dataUserLogged);
	const idRole = dataUserLoggedJson.roleId;

	const renderAlert = (alertType: AlertType, message: string) => {
		setTypeAlert(alertType);
		setMessageAlert(message);
		setShowAlert(true);
	};

	const handleConfirmChange = (record: CarPendingRequestItem) => {
		swal({
			title: 'Deseja confirmar as mudanças?',
			icon: 'warning',
			buttons: {
				cancel: { text: 'Cancelar', value: null, visible: true, className: '' },
				confirm: { text: 'Confirmar', value: true, visible: true, className: 'swal-button--approve' },
			},
		}).then(async (confirmed) => {
			if (!confirmed) return;

			const success = await approve(record.idCar).catch(() => false);
			renderAlert(
				success ? 'success' : 'error',
				success ? 'Carro confirmado com sucesso!' : 'Ocorreu um erro na confirmação!',
			);
		});
	};

	const handleRejectChange = (record: CarPendingRequestItem) => {
		swal({
			title: 'Deseja rejeitar as mudanças?',
			icon: 'warning',
			buttons: ['Cancelar', 'Confirmar'],
			dangerMode: true,
		}).then(async (confirmed) => {
			if (!confirmed) return;

			const success = await reject(record.idCar).catch(() => false);
			renderAlert(
				success ? 'success' : 'error',
				success ? 'Carro rejeitado com sucesso!' : 'Ocorreu um erro na rejeição!',
			);
		});
	};

	const columns: ColumnsType<CarPendingRequestItem> = [
		{
			title: 'Nome',
			dataIndex: 'driverName',
			key: 'name',
		},
		{
			title: 'Marca',
			dataIndex: 'brand',
			key: 'brand',
			render: (brand: string) => (
				<BrandCell>
					{vehicleBrandIcons[brand] && <BrandIcon src={vehicleBrandIcons[brand]} alt={brand} />}
					{brand || '-'}
				</BrandCell>
			),
		},
		{
			title: 'Modelo',
			dataIndex: 'model',
			key: 'model',
		},
		{
			title: 'Placa',
			dataIndex: 'plate',
			key: 'plate',
		},
		{
			title: 'Cor',
			dataIndex: 'color',
			key: 'color',
		},
		{
			title: 'Ano',
			dataIndex: 'year',
			key: 'year',
		},
		{
			title: 'Renavam',
			dataIndex: 'renavam',
			key: 'renavam',
		},
		{
			title: 'Documento',
			dataIndex: 'document',
			key: 'document',
			render: (_, record) =>
				record.document ? (
					<DocumentThumbnail
						src={record.document}
						alt="Documento do veículo"
						onClick={() => setPreviewDocument(record.document)}
					/>
				) : null,
		},
		{
			title: 'Ações',
			key: 'acoes',
			render: (_, record) => (
				<ContentBtnActions>
					<TbCheck
						title="Confirmar troca de veículo"
						color={theme_colors.green}
						size={20}
						cursor="pointer"
						onClick={() => handleConfirmChange(record)}
					/>
					<CgClose
						title="Rejeitar troca de veículo"
						color={theme_colors.red_crismon}
						size={20}
						cursor="pointer"
						onClick={() => handleRejectChange(record)}
					/>
				</ContentBtnActions>
			),
		},
	];

	return (
		<Container>
			<Alert
				visibility={showAlert}
				setVisibility={setShowAlert}
				message={messageAlert}
				typeAlert={typeAlert}
			/>

			<ContentHeader>
				{pagination && <span>{pagination.total} pendente(s)</span>}
				{idRole <= 2 && (
					<ButtonTypeList type="button" onClick={toggleListAll}>
						{listAll ? 'Por Cidade' : 'Listar Todos'}
					</ButtonTypeList>
				)}
			</ContentHeader>

			<ContentTable>
				{loading || data.length > 0 ? (
					<Table
						dataSource={data}
						columns={columns}
						rowKey="idCar"
						pagination={false}
						loading={loading}
					/>
				) : (
					<EmptyState>
						<AiOutlineInbox />
						<span>No momento não existe nenhum carro pendente</span>
					</EmptyState>
				)}
			</ContentTable>

			{pagination && pagination.last_page > 1 && (
				<ContentPagination>
					<Pagination
						total={pagination.total}
						pageSize={pagination.per_page}
						showSizeChanger={false}
						current={page}
						onChange={goToPage}
					/>
				</ContentPagination>
			)}

			<Modal
				open={!!previewDocument}
				onCancel={() => setPreviewDocument(null)}
				title="Documento do veículo"
				footer={
					<Button
						type="primary"
						icon={<FiExternalLink />}
						href={previewDocument ?? undefined}
						target="_blank"
						rel="noopener noreferrer"
					>
						Abrir em outra janela
					</Button>
				}
			>
				{previewDocument && <DocumentPreviewImage src={previewDocument} alt="Documento do veículo" />}
			</Modal>
		</Container>
	);
};

export default SolicitationChangeCar;
