import { FC, useState } from 'react';
import { Modal, Button, Input, Select } from 'antd';
import api from '../../../../../services/api';
import Preload from '../../../../Utils/Preload';
import Alert from '../../../../Utils/Alert';
import Mask from '../../../../../services/Mask';

const { Option } = Select;

interface ModalProps {
	visibility: boolean;
	closeModal: () => void;
	legalId: number;
	handleSearchProps: () => void;
	voucherValueProps: number;
	quantityBalancePJ: string;
	setQuantityBalancePJ: (res: string) => void;
	actionSelected: number;
	setActionSelected: (res: number) => void;
}

const VoucherModal: FC<ModalProps> = ({
	visibility,
	closeModal,
	legalId,
	handleSearchProps,
	voucherValueProps,
	quantityBalancePJ,
	setQuantityBalancePJ,
	actionSelected,
	setActionSelected,
}) => {
	const [loading, setLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [messageAlert, setMessageAlert] = useState('');
	const [typeAlert, setTypeAlert] = useState<
		'success' | 'info' | 'warning' | 'error'
	>('success');

	const handleChangeBalancePJ = () => {
		setLoading(true);
		const voucher = Mask.setRemoveMaskMoney(quantityBalancePJ);
		if (actionSelected === 1) {
			if (voucher > voucherValueProps) {
				setMessageAlert(
					`O valor limite dessa PJ é no máximo ${voucherValueProps.toLocaleString(
						'pt-br',
						{
							style: 'currency',
							currency: 'BRL',
						},
					)}`,
				);
				setTypeAlert('warning');
				setShowAlert(true);
				setLoading(false);
				return;
			}
		}
		api.post(`company/${legalId}/voucher/increment`, {
			legalId,
			value: actionSelected === 2 ? -voucher : voucher,
		}).then((result) => {
			setLoading(false);
			if (!result.data.status) {
				setMessageAlert('Não foi possível alterar o saldo dessa PJ');
				setTypeAlert('warning');
				return setShowAlert(true);
			}
			setMessageAlert('Saldo foi atualizado!');
			setTypeAlert('success');
			setShowAlert(true);
			closeModal();
			return handleSearchProps();
		});
	};

	return (
		<>
			<Preload visible={loading} />
			<Alert
				visibility={showAlert}
				message={messageAlert}
				typeAlert={typeAlert}
				setVisibility={setShowAlert}
			/>
			<Modal
				title="Voucher"
				visible={visibility}
				width={300}
				onCancel={() => closeModal()}
				footer={[
					<Button
						key="back"
						onClick={() => {
							closeModal();
							setQuantityBalancePJ('0,00');
						}}
					>
						Cancelar
					</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={() => handleChangeBalancePJ()}
					>
						Salvar
					</Button>,
				]}
			>
				<div>
					<p style={{ marginBottom: 2, marginLeft: 2 }}>Quantia</p>
					<Input
						id="quantityInput"
						type="text"
						value={quantityBalancePJ}
						onChange={(e) =>
							setQuantityBalancePJ(Mask.setMaskMoney(e.target.value))
						}
						suffix={
							<p style={{ marginBottom: 0, color: '#d3d3d3' }}>R$</p>
						}
					/>
					<p style={{ marginBottom: -18, marginLeft: 2, marginTop: 15 }}>
						Ação
					</p>
					<Select
						value={actionSelected}
						onChange={(value) => setActionSelected(value)}
						style={{ width: '100%', marginTop: 20 }}
					>
						<Option value={1}>Inserir</Option>
						<Option value={2}>Remover</Option>
					</Select>
				</div>
			</Modal>
		</>
	);
};

export default VoucherModal;
