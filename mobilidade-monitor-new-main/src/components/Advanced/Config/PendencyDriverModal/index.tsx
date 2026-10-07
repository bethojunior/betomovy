import { Button, Modal } from 'antd';
import { FC, useState } from 'react';
import api from '../../../../services/api';
import Mask from '../../../../services/Mask';
import Alert from '../../../Utils/Alert';
import Preload from '../../../Utils/Preload';
import { InputModal, ModalContainer, TextModal } from './styled';

interface PendencyProps {
	isModalVisible: boolean;
	setIsModalVisible: (res: boolean) => void;
	pendacyId: number;
	penaltiesTypeRequest: () => void;
}

const PendencyDriverModal: FC<PendencyProps> = ({
	isModalVisible,
	setIsModalVisible,
	pendacyId,
	penaltiesTypeRequest,
}) => {
	const [inputValue, setInputValue] = useState('0,00');
	const [loading, setLoading] = useState(false);
	const [messageAlert, setMessageAlert] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [typeAlert, setTypeAlert] = useState<
		'success' | 'info' | 'warning' | 'error'
	>('success');

	const penaltiesEdit = () => {
		const voucher = Mask.setRemoveMaskMoney(inputValue);
		if (voucher > 0.5) {
			setMessageAlert('Valor inserido não é permitido');
			setTypeAlert('warning');
			setShowAlert(true);
			return;
		}
		setLoading(true);
		api.put(`userPenaltiesType/${pendacyId}`, {
			value: Mask.setMaskUSAFormatMoney(inputValue),
		}).then((result) => {
			setLoading(false);
			if (result.status === 200) {
				penaltiesTypeRequest();
				setIsModalVisible(false);
				setMessageAlert('Valor inserido com sucesso');
				setTypeAlert('success');
				return setShowAlert(true);
			}
			setMessageAlert('Erro ao inserir o valor');
			setTypeAlert('warning');
			return setShowAlert(true);
		});
	};

	return (
		<>
			<Preload visible={loading} />
			<Alert
				visibility={showAlert}
				setVisibility={setShowAlert}
				message={messageAlert}
				typeAlert={typeAlert}
			/>
			<Modal
				title="Editar Pontuação"
				open={isModalVisible}
				width={300}
				onCancel={() => setIsModalVisible(false)}
				footer={[
					<Button key="back" onClick={() => setIsModalVisible(false)}>
						Cancelar
					</Button>,
					<Button
						onClick={() => penaltiesEdit()}
						key="submit"
						type="primary"
					>
						Salvar
					</Button>,
				]}
			>
				<ModalContainer>
					<TextModal>Insira um valor de até 0.5</TextModal>
					<InputModal
						maxLength={5}
						value={inputValue}
						onChange={(e) =>
							setInputValue(Mask.setMaskMoney(e.target.value))
						}
					/>
				</ModalContainer>
			</Modal>
		</>
	);
};

export default PendencyDriverModal;
