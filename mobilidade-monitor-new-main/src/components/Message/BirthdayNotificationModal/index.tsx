import { Button, Input, Select, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { FC, useEffect, useState } from 'react';
import api from '../../../services/api';
import Alert from '../../Utils/Alert';
import Preload from '../../Utils/Preload';
import { SelectItem, TitleText, TextAtualize } from './styles';

const { Option } = Select;

interface ModalData {
	isModalVisible: boolean;
	setIsModalVisible: (res: boolean) => void;
	notificationRequest: () => void;
}

const BirthdayModal: FC<ModalData> = ({
	isModalVisible,
	setIsModalVisible,
	notificationRequest,
}) => {
	const [loading, setLoading] = useState(false);
	const [messageAlert, setMessageAlert] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [typeAlert, setTypeAlert] = useState<
		'success' | 'info' | 'warning' | 'error'
	>('success');

	const [inputName, SetInputName] = useState('');
	const [inputDescripton, SetInputDescription] = useState('');
	const [inputSelect, SetInputSelect] = useState('1');

	const newNotification = () => {
		if (inputDescripton.trim() === '' || inputName.trim() === '') {
			setMessageAlert('Todos os campos são obrigatórios!');
			setTypeAlert('warning');
			setShowAlert(true);
			return;
		}

		setLoading(true);
		api.post(`eventNotification`, {
			description: inputDescripton,
			eventNotificationTypeId: inputSelect,
			title: inputName,
		}).then((result) => {
			setLoading(false);
			if (result.status === 200) {
				setIsModalVisible(false);
				notificationRequest();
				setMessageAlert('Notificação cadastrada com sucesso!');
				setTypeAlert('success');
				return setShowAlert(true);
			}
			setMessageAlert('Erro ao cadastrar notificação!');
			setTypeAlert('error');
			return setShowAlert(true);
		});
	};

	useEffect(() => {
		SetInputName('');
		SetInputDescription('');
	}, [isModalVisible]);

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
				title="Criar nova notificação de aniversário"
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={[
					<Button key="back" onClick={() => setIsModalVisible(false)}>
						Cancelar
					</Button>,
					<Button onClick={newNotification} type="primary" key="submit">
						Salvar
					</Button>,
				]}
			>
				<div>
					<TextAtualize>
						<TitleText> Título da notificação </TitleText>
						<Input
							value={inputName}
							onChange={(e) => SetInputName(e.target.value)}
						/>
					</TextAtualize>
					<TextAtualize>
						<TitleText> Mensagem de aniversário</TitleText>
						<TextArea
							rows={4}
							value={inputDescripton}
							onChange={(e) => SetInputDescription(e.target.value)}
						/>
					</TextAtualize>
					<TextAtualize>
						<TitleText>Tipo da mensagem</TitleText>
						<SelectItem
							value={inputSelect}
							onChange={(e) => SetInputSelect(String(e))}
						>
							<Option value="1">Aniversário de nascimento</Option>
							<Option value="2">Aniversário de cadastro</Option>
						</SelectItem>
					</TextAtualize>
				</div>
			</Modal>
		</>
	);
};

export default BirthdayModal;
