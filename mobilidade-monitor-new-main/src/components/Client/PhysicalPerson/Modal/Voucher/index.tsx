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
	const [voucherValue, setVoucherValue] = useState('0,00');
	const [messageAlert, setMessageAlert] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [typeAlert, setTypeAlert] = useState<
		'success' | 'info' | 'warning' | 'error'
	>('success');
	const { Option } = Select;

	const insertVoucher = (idCustomer: number) => {
		setLoadingProps(true);
		api.put(`balance/${idCustomer}/flow`, {
			action: statusVoucher,
			balance: Mask.setMaskUSAFormatMoney(voucherValue),
			idCustomer,
		}).then((values) => {
			setLoadingProps(false);
			if (values.status) {
				setMessageAlert('Ação efetuada com sucesso!');
				setVoucherValue('0,00');
				onSearchProps();
				setShowAlert(true);
				return setTypeAlert('success');
			}
			let errorMsg = 'Erro ao efetuar ação.';
			try {
				if (values?.data?.message) {
					errorMsg = values.data.message;
				} else if (values?.request?.response) {
					const parsed = JSON.parse(values.request.response);
					if (parsed?.response?.[0]) errorMsg = parsed.response[0];
				}
			} catch {}
			setMessageAlert(errorMsg);
			setShowAlert(true);
			return setTypeAlert('error');
		});
		setVoucherModalProps(false);
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
				width={300}
				title="Voucher"
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
							if (customerProps != null)
								insertVoucher((customerProps as ListClient)?.idCustomer);
						}}
					>
						Salvar
					</Button>,
				]}
			>
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
