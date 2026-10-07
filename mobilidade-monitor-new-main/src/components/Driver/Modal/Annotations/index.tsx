import { Button, Modal } from 'antd';
import { FC, useEffect, useState } from 'react';
import api from '../../../../services/api';
import Preload from '../../../Utils/Preload';
import Alert from '../../../Utils/Alert';
import dayjs from 'dayjs';
import { AnnotationsInput } from './styles';

interface ModalProps {
	visibility: boolean;
	handleCloseModal: () => void;
	onSearch: () => void;
	userId: number;
	annotations: string;
}

const AnnotationsModal: FC<ModalProps> = ({
	visibility,
	handleCloseModal,
	onSearch,
	userId,
	annotations,
}) => {
	const [loading, setLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [messageAlert, setMessageAlert] = useState('');
	const [typeAlert, setTypeAlert] = useState<'success' | 'info' | 'warning' | 'error'>('success');
	const [newAnnotation, setNewAnnotation] = useState('');
	const [annotationList, setAnnotationList] = useState<string[]>([]);

	const updateAnnotationsDriver = () => {
		if (newAnnotation.trim() === '') return;

		setLoading(true);
		const currentDate = dayjs().format('DD/MM/YYYY HH:mm');
		const formatted = `[${currentDate}] ${newAnnotation.trim()}`;
		const updatedList = [formatted, ...annotationList];

		api.put(`user/${userId}/observation`, {
			observation: updatedList.join('\n'),
		})
			.then((res) => {
				setLoading(false);
				if (res.data.status) {
					setMessageAlert('Anotação salva com sucesso!');
					setTypeAlert('success');
					setShowAlert(true);
					setNewAnnotation('');
					setAnnotationList(updatedList);
					onSearch();
					handleCloseModal();
				} else {
					throw new Error();
				}
			})
			.catch(() => {
				setLoading(false);
				setMessageAlert('Erro ao salvar anotação');
				setTypeAlert('error');
				setShowAlert(true);
			});
	};

	const deleteAnnotation = (index: number) => {
		const updatedList = annotationList.filter((_, i) => i !== index);

		setLoading(true);
		api.put(`user/${userId}/observation`, {
			observation: updatedList.join('\n'),
		})
			.then((res) => {
				setLoading(false);
				if (res.data.status) {
					setMessageAlert('Anotação removida!');
					setTypeAlert('success');
					setShowAlert(true);
					setAnnotationList(updatedList);
					onSearch();
				} else {
					throw new Error();
				}
			})
			.catch(() => {
				setLoading(false);
				setMessageAlert('Erro ao remover anotação');
				setTypeAlert('error');
				setShowAlert(true);
			});
	};

	useEffect(() => {
		if (visibility) {
			const parsed = annotations
				?.split('\n')
				.filter((line) => line.trim() !== '') ?? [];
			setAnnotationList(parsed);
			setNewAnnotation('');
		}
	}, [visibility, annotations]);

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
				width={400}
				title="Anotações"
				visible={visibility}
				onCancel={handleCloseModal}
				footer={[
					<Button key="back" onClick={handleCloseModal}>
						Voltar
					</Button>,
					<Button key="submit" type="primary" onClick={updateAnnotationsDriver} disabled={newAnnotation.trim() === ''}>
						Salvar
					</Button>,
				]}
			>
				<AnnotationsInput
					placeholder="Digite uma nova anotação..."
					value={newAnnotation}
					onChange={(e) => setNewAnnotation(e.target.value)}
					rows={3}
				/>

				{annotationList.length > 0 && (
					<div style={{ marginTop: 16 }}>
						<strong>Histórico:</strong>
						<ul style={{ paddingLeft: 16, marginTop: 8 }}>
							{annotationList.map((item, index) => (
								<li key={index} style={{ marginBottom: 8 }}>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<span>{item}</span>
										<Button
											size="small"
											danger
											onClick={() => deleteAnnotation(index)}
										>
											Excluir
										</Button>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}
			</Modal>
		</>
	);
};

export default AnnotationsModal;
