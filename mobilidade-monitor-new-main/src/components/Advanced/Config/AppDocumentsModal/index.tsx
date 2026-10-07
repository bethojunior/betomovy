import { Button, Checkbox, Input } from 'antd';
import { FC, useEffect, useState } from 'react';
import api from '../../../../services/api';
import Utils from '../../../../utils/Utils';
import Alert from '../../../Utils/Alert';
import Preload from '../../../Utils/Preload';
import {
	EditModal,
	Label,
	InputEdit,
	Description,
	Line,
	CheckBoxContainer,
	CheckBoxLabel,
} from './styles';

const { TextArea } = Input;

interface DocData {
	created_at: string;
	description: string;
	id: number;
	image: number;
	label: string;
	link: string;
	pdf: number;
	text: number;
	updated_at: string;
}

interface DocumentsModalProps {
	isModalVisible: boolean;
	setIsModalVisible: (res: boolean) => void;
	documentEditList: DocData | undefined;
	docRequest: () => void;
	editOrCreat: number;
}

const AppDocumentsModal: FC<DocumentsModalProps> = ({
	isModalVisible,
	setIsModalVisible,
	documentEditList,
	docRequest,
	editOrCreat,
}) => {
	const [loading, setLoading] = useState(false);
	const [messageAlert, setMessageAlert] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [typeAlert, setTypeAlert] = useState<
		'success' | 'info' | 'warning' | 'error'
	>('success');

	const [nameInput, setNameInput] = useState<string | undefined>('');
	const [linkInput, setLinkInput] = useState<string | undefined>('');
	const [descriptionInput, setDescriptionInput] = useState<string | undefined>(
		'',
	);
	const [photoCheckBox, setPhotoCheckBoxt] = useState<boolean>();
	const [textCheckBox, setTextCheckBox] = useState<boolean>();
	const [pdfCheckBox, setPdfCheckBox] = useState<boolean>();

	useEffect(() => {
		if (editOrCreat === 1) {
			setNameInput(documentEditList?.label);
			setLinkInput(documentEditList?.link);
			setDescriptionInput(documentEditList?.description);
			setPhotoCheckBoxt(!!documentEditList?.image);
			setTextCheckBox(!!documentEditList?.text);
			setPdfCheckBox(!!documentEditList?.pdf);
			return;
		}
		setNameInput('');
		setLinkInput('');
		setDescriptionInput('');
		setPhotoCheckBoxt(false);
		setTextCheckBox(false);
		setPdfCheckBox(false);
	}, [editOrCreat, isModalVisible]);

	const editDoc = () => {
		let link = linkInput;
		if (link === null) {
			link = '';
		}
		if (nameInput === '' || descriptionInput === '') {
			setTypeAlert('warning');
			setMessageAlert('O campo Nome e Descrição são obrigatórios!');
			setShowAlert(true);
			return;
		}
		if (link?.trim() !== '') {
			if (!Utils.checkURLIsValid(String(link))) {
				setLoading(false);
				setTypeAlert('warning');
				setMessageAlert('O link informado é inválido');
				setShowAlert(true);
				return;
			}
		}
		setLoading(true);
		api.put(`doc/${documentEditList?.id}`, {
			label: nameInput?.trim(),
			image: photoCheckBox,
			link: link?.trim(),
			description: descriptionInput?.trim(),
			text: textCheckBox,
			pdf: pdfCheckBox,
		}).then((values) => {
			setLoading(false);
			if (values.status === 200) {
				setIsModalVisible(false);
				setTypeAlert('success');
				setMessageAlert('Documento editado com sucesso!');
				docRequest();
				return setShowAlert(true);
			}
			setTypeAlert('error');
			setMessageAlert('Erro ao tentar editar documento!');
			return setShowAlert(true);
		});
	};

	const creatDoc = () => {
		if (nameInput === '' || descriptionInput === '') {
			setTypeAlert('warning');
			setMessageAlert('O campo Nome e Descrição são obrigatórios!');
			setShowAlert(true);
			return;
		}
		setLoading(true);
		api.post(`doc`, {
			label: nameInput?.trim(),
			image: photoCheckBox,
			link: linkInput?.trim(),
			description: descriptionInput?.trim(),
			text: textCheckBox,
			pdf: pdfCheckBox,
		}).then((values) => {
			setLoading(false);
			if (values.status === 201) {
				setIsModalVisible(false);
				setTypeAlert('success');
				setMessageAlert('Documento adicionado com sucesso!');
				docRequest();
				return setShowAlert(true);
			}
			setTypeAlert('error');
			setMessageAlert('Erro ao tentar adicionado documento!');
			return setShowAlert(true);
		});
	};

	return (
		<div>
			<Preload visible={loading} />
			<Alert
				visibility={showAlert}
				message={messageAlert}
				typeAlert={typeAlert}
				setVisibility={setShowAlert}
			/>
			<EditModal
				width={450}
				title="Editar Documento"
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={[
					<Button key="back" onClick={() => setIsModalVisible(false)}>
						Cancelar
					</Button>,
					<Button
						type="primary"
						key="submit"
						onClick={() => {
							if (editOrCreat === 0) {
								creatDoc();
								return;
							}
							editDoc();
						}}
					>
						Salvar
					</Button>,
				]}
			>
				<div>
					<div>
						<Label>Nome</Label>
						<InputEdit
							value={nameInput}
							onChange={(e) => setNameInput(e.target.value)}
						/>
						<Description>
							Descrição de como irá aparecer no aplicativo
						</Description>
					</div>
					<div>
						<Label>Link</Label>
						<InputEdit
							value={linkInput}
							onChange={(e) => setLinkInput(e.target.value)}
						/>
						<Description>
							Link de suporte para facilitar na solicitação do documento
						</Description>
					</div>
					<div>
						<Label>Descrição</Label>
						<TextArea
							value={descriptionInput}
							onChange={(e) => setDescriptionInput(e.target.value)}
							rows={4}
						/>
					</div>
					<Line />
					<div>
						<p>Solicitar no documento</p>
						<CheckBoxContainer>
							<Checkbox
								checked={photoCheckBox}
								onChange={(e) => setPhotoCheckBoxt(e.target.checked)}
							/>
							<CheckBoxLabel>Foto</CheckBoxLabel>
						</CheckBoxContainer>
						<CheckBoxContainer>
							<Checkbox
								checked={textCheckBox}
								onChange={(e) => setTextCheckBox(e.target.checked)}
							/>
							<CheckBoxLabel>Texto</CheckBoxLabel>
						</CheckBoxContainer>
						<CheckBoxContainer>
							<Checkbox
								checked={pdfCheckBox}
								onChange={(e) => setPdfCheckBox(e.target.checked)}
							/>
							<CheckBoxLabel>PDF</CheckBoxLabel>
						</CheckBoxContainer>
					</div>
				</div>
			</EditModal>
		</div>
	);
};

export default AppDocumentsModal;
