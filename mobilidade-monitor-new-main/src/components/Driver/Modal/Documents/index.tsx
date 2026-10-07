import { FC, useState } from 'react';
import { Button, Menu, Select } from 'antd';
import { FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { SelectValue } from 'antd/lib/select';
import { DocUserList } from '../../../Shared/DocUserList';
import { TabTransition } from '../../../Shared/TabTransition';
import Preload from '../../../Utils/Preload';
import Alert from '../../../Utils/Alert';
import { useDocUserActions } from '../../../../hooks/useDocUserActions';
import {
	ButtonRequestNewDocuments,
	Content,
	Navbar,
	RequestNewDocumentContent,
	RequestNewDocumentLabel,
	RequestNewField,
	SelectStatusDocument,
	TabBody,
} from './styles';

const { Option } = Select;

interface DriverDocumentArray extends Array<DriverDocument> {}

interface DriverDocument {
	description: string;
	docStatus: string;
	id: number;
	image: string;
	isImage: number;
	isText: number;
	label: string;
	laravel_through_key: number;
	pdf: string;
	text: string;
	userId: number;
}

interface StatusDocumentDriverArray extends Array<StatusDocumentDriver> {}

interface StatusDocumentDriver {
	id: number;
	name: string;
}

interface TypeOfDocumentDriverArray extends Array<TypeOfDocumentDriverData> {}

interface TypeOfDocumentDriverData {
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

interface ModalProps {
	userId: number;
	driverDoc: DriverDocumentArray | undefined;
	typeOfDocument: TypeOfDocumentDriverArray | undefined;
	statusDriverDoc: StatusDocumentDriverArray | undefined;
	visibility: boolean | undefined;
	handleCloseModal: () => void;
	onDocumentsChanged: () => void;
}

const DocumentsDriverModal: FC<ModalProps> = ({
	userId,
	driverDoc,
	typeOfDocument,
	statusDriverDoc,
	visibility,
	handleCloseModal,
	onDocumentsChanged,
}) => {
	const { loading, requestNew } = useDocUserActions();

	const [step, setStep] = useState(1);
	const [isVisibleButtonRequestDocument, setIsVisibleButtonRequestDocument] = useState(false);
	const [newDocumentRequiredSelect, setNewDocumentRequiredSelect] = useState<SelectValue>();
	const [statusDocumentRequiredSelect, setStatusDocumentRequiredSelect] = useState<SelectValue>();
	const [showAlert, setShowAlert] = useState(false);
	const [messageAlert, setMessageAlert] = useState('');
	const [typeAlert, setTypeAlert] = useState<'success' | 'info' | 'warning' | 'error'>('success');

	const handleRequestDocuments = async () => {
		if (!newDocumentRequiredSelect || !statusDocumentRequiredSelect) {
			setMessageAlert('Selecione o documento e o status antes de solicitar');
			setTypeAlert('warning');
			setShowAlert(true);
			return;
		}

		try {
			await requestNew(userId, String(newDocumentRequiredSelect), String(statusDocumentRequiredSelect));
			setMessageAlert('Documento solicitado com sucesso!');
			setTypeAlert('success');
			setShowAlert(true);
			onDocumentsChanged();
		} catch (error) {
			setMessageAlert('O documento selecionado já está sendo utilizado');
			setTypeAlert('error');
			setShowAlert(true);
		}
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
		<Content
			title="Documentos do motorista"
			visible={visibility}
			width={step === 2 ? 600 : 840}
			centered
			styles={{ body: { maxHeight: '78vh', overflowY: 'auto' } }}
			onCancel={handleCloseModal}
			footer={[
				<Button key="back" onClick={handleCloseModal}>
					Fechar
				</Button>,
				<ButtonRequestNewDocuments
					visible={isVisibleButtonRequestDocument}
					type="primary"
					key="submit"
					onClick={handleRequestDocuments}
				>
					Solicitar
				</ButtonRequestNewDocuments>,
			]}
		>
			<Navbar
				selectedKeys={[step === 1 ? 'ListDocument' : 'NewDocument']}
				mode="horizontal"
			>
				<Menu.Item
					key="ListDocument"
					onClick={() => {
						setStep(1);
						setIsVisibleButtonRequestDocument(false);
					}}
				>
					Fornecidos
				</Menu.Item>
				<Menu.Item
					key="NewDocument"
					onClick={() => {
						setStep(2);
						setIsVisibleButtonRequestDocument(true);
					}}
				>
					Solicitar Novo
				</Menu.Item>
			</Navbar>

			<TabBody>
				{step === 1 && (
					<TabTransition key="list">
						<DocUserList
							documents={driverDoc}
							statusList={statusDriverDoc}
							onDocumentsChanged={onDocumentsChanged}
							emptyMessage="Esse motorista não forneceu documentos"
						/>
					</TabTransition>
				)}

				{step === 2 && (
					<TabTransition key="new">
						<RequestNewDocumentContent>
							<RequestNewField>
								<RequestNewDocumentLabel>
									<FileTextOutlined />
									Documento
								</RequestNewDocumentLabel>
								<SelectStatusDocument
									value={newDocumentRequiredSelect}
									onChange={(value) => setNewDocumentRequiredSelect(value as SelectValue)}
								>
									{typeOfDocument?.map((item) => (
										<Option key={item.id} value={item.id}>
											{item.label}
										</Option>
									))}
								</SelectStatusDocument>
							</RequestNewField>

							<RequestNewField>
								<RequestNewDocumentLabel>
									<CheckCircleOutlined />
									Status
								</RequestNewDocumentLabel>
								<SelectStatusDocument
									value={statusDocumentRequiredSelect}
									onChange={(value) => setStatusDocumentRequiredSelect(value as SelectValue)}
								>
									{statusDriverDoc?.map((status) => (
										<Option key={status.id} value={status.id}>
											{status.name}
										</Option>
									))}
								</SelectStatusDocument>
							</RequestNewField>
						</RequestNewDocumentContent>
					</TabTransition>
				)}
			</TabBody>
		</Content>
		</>
	);
};

export default DocumentsDriverModal;
