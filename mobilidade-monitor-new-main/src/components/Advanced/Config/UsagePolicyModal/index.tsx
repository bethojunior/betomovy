import { FC, useState } from 'react';
import { Button, Input, Modal } from 'antd';
import api from '../../../../services/api';
import Preload from '../../../Utils/Preload';
import Alert from '../../../Utils/Alert';

const { TextArea } = Input;

interface PolicyProps {
	isModalVisible: boolean;
	setIsModalVisible: (res: boolean) => void;
	descriptionValue: string;
	setDescriptionValue: (res: string) => void;
	typeValue: string;
	usagePolicyRequest: () => void;
}

const UsagePolicyModal: FC<PolicyProps> = ({
	isModalVisible,
	setIsModalVisible,
	descriptionValue,
	setDescriptionValue,
	typeValue,
	usagePolicyRequest,
}) => {
	const [loading, setLoading] = useState(false);
	const [messageAlert, setMessageAlert] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [typeAlert, setTypeAlert] = useState<
		'success' | 'info' | 'warning' | 'error'
	>('success');

	const editPolicy = () => {
		if (descriptionValue.trim().length === 0) {
			setTypeAlert('error');
			setMessageAlert('Os termos não podem estar vazios!');
			setShowAlert(true);
			return;
		}
		setLoading(true);
		api.post(`termsUsePolicy/update`, {
			description: descriptionValue,
			type: typeValue,
		}).then((result) => {
			setLoading(false);
			if (result.status === 200) {
				usagePolicyRequest();
				setIsModalVisible(false);
				setTypeAlert('success');
				setMessageAlert('Termos adicionados com sucesso!');
			}
			setTypeAlert('success');
			setMessageAlert('Erro ao adcionar termos!');
			return setShowAlert(true);
		});
	};

	return (
		<div>
			<Preload visible={loading} />
			<Alert
				visibility={showAlert}
				setVisibility={setShowAlert}
				message={messageAlert}
				typeAlert={typeAlert}
			/>
			<Modal
				width={800}
				title="Termos de política de uso"
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={[
					<Button key="back" onClick={() => setIsModalVisible(false)}>
						Fechar
					</Button>,
					<Button key="submit" onClick={editPolicy} type="primary">
						Salvar
					</Button>,
				]}
			>
				<TextArea
					value={descriptionValue}
					onChange={(e) => setDescriptionValue(e.target.value)}
					rows={15}
				/>
			</Modal>
		</div>
	);
};

export default UsagePolicyModal;
