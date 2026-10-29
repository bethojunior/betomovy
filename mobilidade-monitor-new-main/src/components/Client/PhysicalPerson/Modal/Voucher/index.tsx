import { FC, useState } from 'react';
import { Select, Button } from 'antd';
import Alert from '../../../../Utils/Alert';
import Mask from '../../../../../services/Mask';
import {
	VoucherLabel,
	VoucherModal,
	VoucherInput,
	SelectTypeOfVoucher,
} from './styles';
import api from '../../../../../services/api';
import { ListClient } from '../Edition/type';

type ListClientFormProps = Record<keyof ListClient, string | ListClient>

interface VoucherProps {
	voucherModalProps: boolean;
	handleCancelProps: () => void;
	customerProps: ListClient | ListClientFormProps | undefined;
	onSearchProps: () => void;
	setLoadingProps: (val: boolean) => void;
	setVoucherModalProps: (val: boolean) => void;
}

const Voucher: FC<VoucherProps> = ({
	voucherModalProps,
	handleCancelProps,
	customerProps,
	setLoadingProps,
	onSearchProps,
	setVoucherModalProps,
}) => {
	const [statusVoucher, setStatusVoucher] = useState('insert');
	const [targetType, setTargetType] = useState<'voucher' | 'balance'>('voucher');
	const [voucherValue, setVoucherValue] = useState('0,00');
	const [messageAlert, setMessageAlert] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [typeAlert, setTypeAlert] = useState<
		'success' | 'info' | 'warning' | 'error'
	>('success');
	const { Option } = Select;

	const insertVoucher = (idCustomer: number) => {
		const rawAmount = Mask.setMaskUSAFormatMoney(voucherValue);
		const numAmount = parseFloat(rawAmount);
		if (isNaN(numAmount) || numAmount <= 0) {
			setMessageAlert('Informe um valor maior que zero.');
			setShowAlert(true);
			setTypeAlert('warning');
			return;
		}

		setLoadingProps(true);
		setVoucherModalProps(false);
		api.put(`balance/${idCustomer}/flow`, {
			action: statusVoucher,
			balance: rawAmount,
			target: targetType,
			idCustomer,
		})
			.then((values) => {
				setLoadingProps(false);
				if (values?.data?.status || values?.status === 200) {
					const labelTarget = targetType === 'balance' ? 'Saldo' : 'Voucher';
					setMessageAlert(`${labelTarget} atualizado com sucesso!`);
					setVoucherValue('0,00');
					onSearchProps();
					setShowAlert(true);
					return setTypeAlert('success');
				}
				let errorMsg = 'Erro ao efetuar ação.';
				try {
					if (values?.data?.response?.[0]) {
						errorMsg = values.data.response[0];
					} else if (values?.data?.message) {
						errorMsg = values.data.message;
					}
				} catch {}
				setMessageAlert(errorMsg);
				setShowAlert(true);
				return setTypeAlert('error');
			})
			.catch((err) => {
				setLoadingProps(false);
				let errorMsg = 'Erro ao efetuar ação.';
				if (err?.response?.data?.response?.[0]) {
					errorMsg = err.response.data.response[0];
				} else if (err?.response?.data?.message) {
					errorMsg = err.response.data.message;
				}
				setMessageAlert(errorMsg);
				setShowAlert(true);
				setTypeAlert('error');
			});
	};

	return (
		<>
			<Alert
				visibility={showAlert}
				setVisibility={setShowAlert}
				message={messageAlert}
				typeAlert={typeAlert}
			/>
			<VoucherModal
				width={340}
				title="Movimentar Saldo / Voucher"
				visible={voucherModalProps}
				onCancel={handleCancelProps}
				footer={[
					<Button key="back" onClick={() => handleCancelProps()}>
						Voltar
					</Button>,
					<Button
						key="submit"
						type="primary"
						onClick={() => {
							const id =
								(customerProps as any)?.idCustomer ??
								(customerProps as any)?.id;
							if (id) {
								insertVoucher(Number(id));
							} else {
								setMessageAlert('Cliente não identificado.');
								setShowAlert(true);
								setTypeAlert('error');
							}
						}}
					>
						Salvar
					</Button>,
				]}
			>
				<VoucherLabel>Destino da Movimentação:</VoucherLabel>
				<SelectTypeOfVoucher
					value={targetType}
					onChange={(value) => {
						setTargetType(value as 'voucher' | 'balance');
					}}
				>
					<Option value="voucher">Voucher (Saldo Voucher)</Option>
					<Option value="balance">Saldo (Saldo Atual / Carteira)</Option>
				</SelectTypeOfVoucher>
				<VoucherLabel>Valor:</VoucherLabel>
				<VoucherInput
					suffix="R$"
					value={voucherValue}
					type="tel"
					onChange={(e) => {
						setVoucherValue(Mask.setMaskMoney(e.target.value));
					}}
				/>
				<VoucherLabel>Ação:</VoucherLabel>
				<SelectTypeOfVoucher
					value={statusVoucher}
					onChange={(value) => {
						setStatusVoucher(String(value));
					}}
				>
					<Option value="insert">Inserir</Option>
					<Option value="block">Retirar</Option>
				</SelectTypeOfVoucher>
			</VoucherModal>
		</>
	);
};
export default Voucher;
