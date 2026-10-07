import { DragEvent, FC, useEffect, useState } from 'react';
import { Button, Select, UploadProps } from 'antd';
import { EyeOutlined, DownloadOutlined, InboxOutlined } from '@ant-design/icons';
import { SelectValue } from 'antd/lib/select';
import Preload from '../../Utils/Preload';
import Alert from '../../Utils/Alert';
import { DocumentImageUpload } from '../../Utils/DocumentImageUpload';
import { DropzoneContainer, UploadDragger } from '../../Utils/DocumentImageUpload/styles';
import { useDocUserActions } from '../../../hooks/useDocUserActions';
import { useDocUserImageUpload } from '../../../hooks/useDocUserImageUpload';
import { DocUserListProps } from './types';
import {
	Actions,
	CardDocument,
	Description,
	DocumentIcon,
	DocumentIconWrapper,
	DocumentImage,
	DocumentImageContainer,
	DocumentLabel,
	EmptyMessage,
	ListBody,
	ListDocuments,
	ListDocumentsContent,
	PdfFallback,
	PdfFallbackText,
	PdfFrame,
	PdfLoadingText,
	PdfPreviewContainer,
	PdfPreviewModal,
	SelectListDocuments,
} from './styles';

const { Option } = Select;

export const DocUserList: FC<DocUserListProps> = ({
	documents,
	statusList,
	onDocumentsChanged,
	emptyMessage = 'Esse usuário não forneceu documentos',
}) => {
	const { loading, changeStatus } = useDocUserActions();
	const { uploadDocImage } = useDocUserImageUpload();

	const [imageOverrides, setImageOverrides] = useState<Record<number, string>>({});
	const [uploadingDocId, setUploadingDocId] = useState<number | null>(null);

	useEffect(() => {
		setImageOverrides({});
	}, [documents]);
	const [dragOverId, setDragOverId] = useState<number | null>(null);
	const [uploadTargetDocId, setUploadTargetDocId] = useState<number | null>(null);

	const [showAlert, setShowAlert] = useState(false);
	const [messageAlert, setMessageAlert] = useState('');
	const [typeAlert, setTypeAlert] = useState<'success' | 'info' | 'warning' | 'error'>('success');

	const notify = (message: string, type: typeof typeAlert) => {
		setMessageAlert(message);
		setTypeAlert(type);
		setShowAlert(true);
	};

	const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
	const [pdfUrlPreview, setPdfUrlPreview] = useState<string | null>(null);
	const [pdfObjectUrl, setPdfObjectUrl] = useState<string | null>(null);
	const [pdfLoading, setPdfLoading] = useState(false);
	const [pdfLoadError, setPdfLoadError] = useState(false);

	const handleOpenPdfPreview = async (url?: string | null) => {
		if (!url) return;
		setIsPdfModalVisible(true);
		setPdfUrlPreview(url);
		setPdfLoading(true);
		setPdfLoadError(false);
		setPdfObjectUrl(null);
		try {
			const response = await fetch(url, { mode: 'cors' });
			if (!response.ok) throw new Error('erro_fetch_pdf');
			const blob = await response.blob();
			setPdfObjectUrl(URL.createObjectURL(blob));
			setPdfLoading(false);
		} catch (e) {
			setPdfLoading(false);
			setPdfLoadError(true);
		}
	};

	const handleClosePdfPreview = () => {
		setIsPdfModalVisible(false);
		setPdfUrlPreview(null);
		setPdfLoading(false);
		setPdfLoadError(false);
		if (pdfObjectUrl) {
			URL.revokeObjectURL(pdfObjectUrl);
			setPdfObjectUrl(null);
		}
	};

	const handleChangeStatus = async (docId: number, docStatusId: SelectValue) => {
		try {
			await changeStatus(docId, docStatusId as string);
			notify('O status do documento foi alterado!', 'success');
			onDocumentsChanged();
		} catch (error) {
			notify('Não foi possível mudar o status desse documento', 'error');
		}
	};

	const handleImageFile = async (docId: number, file: File) => {
		setUploadingDocId(docId);
		try {
			const updated = await uploadDocImage(docId, file);
			if (updated?.image) {
				setImageOverrides((prev) => ({ ...prev, [docId]: updated.image }));
			}
			notify('A imagem do documento foi atualizada!', 'success');
			onDocumentsChanged();
		} catch (error) {
			notify('Não foi possível enviar a imagem do documento', 'error');
		} finally {
			setUploadingDocId(null);
		}
	};

	const handleDragOver = (docId: number) => (e: DragEvent) => {
		e.preventDefault();
		setDragOverId(docId);
	};

	const handleDragLeave = (docId: number) => () => {
		setDragOverId((current) => (current === docId ? null : current));
	};

	const handleDrop = (docId: number) => (e: DragEvent) => {
		e.preventDefault();
		setDragOverId(null);
		const file = e.dataTransfer.files?.[0];
		if (file) handleImageFile(docId, file);
	};

	const handleDropzoneChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
		const file = newFileList[0]?.originFileObj as File | undefined;
		if (!file || uploadTargetDocId === null) return;

		handleImageFile(uploadTargetDocId, file);
		setUploadTargetDocId(null);
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

			{uploadTargetDocId !== null ? (
				<DropzoneContainer>
					<UploadDragger
						accept=".jpeg, .jpg, .png"
						multiple={false}
						showUploadList={false}
						onChange={handleDropzoneChange}
						beforeUpload={() => false}
					>
						<p className="ant-upload-drag-icon">
							<InboxOutlined />
						</p>
						<p className="ant-upload-text">Arraste a imagem aqui</p>
						<p className="ant-upload-hint">ou clique para escolher um arquivo (JPG ou PNG)</p>
					</UploadDragger>
					<Button onClick={() => setUploadTargetDocId(null)}>Cancelar</Button>
				</DropzoneContainer>
			) : (
			<ListDocumentsContent>
				{documents?.length === 0 ? (
					<EmptyMessage>{emptyMessage}</EmptyMessage>
				) : (
					documents?.map((item) => (
						<ListDocuments key={item.id}>
							<CardDocument
								hoverable
								cover={
									<DocumentImageContainer
										$dragging={dragOverId === item.id}
										onDragOver={handleDragOver(item.id)}
										onDragLeave={handleDragLeave(item.id)}
										onDrop={handleDrop(item.id)}
									>
										{imageOverrides[item.id] || item.image ? (
											<DocumentImage
												src={imageOverrides[item.id] ?? item.image}
												width="100%"
												height="100%"
											/>
										) : (
											<DocumentIconWrapper>
												<DocumentIcon />
											</DocumentIconWrapper>
										)}
									</DocumentImageContainer>
								}
							>
								<ListBody>
									<div>
										<DocumentLabel>{item.label}</DocumentLabel>
										{item.description && <Description>{item.description}</Description>}
										{item.pdf && (
											<Actions>
												<Button
													size="small"
													shape="round"
													icon={<EyeOutlined />}
													onClick={() => handleOpenPdfPreview(item.pdf)}
												>
													Visualizar
												</Button>
												<Button
													size="small"
													shape="round"
													icon={<DownloadOutlined />}
													href={item.pdf}
													download
												>
													Baixar
												</Button>
											</Actions>
										)}
									</div>

									<SelectListDocuments
										defaultValue={item.docStatus}
										onChange={(value) => handleChangeStatus(item.id, value as SelectValue)}
									>
										{statusList?.map((status) => (
											<Option key={status.id} value={status.id}>
												{status.name}
											</Option>
										))}
									</SelectListDocuments>

									<DocumentImageUpload
										uploading={uploadingDocId === item.id}
										onClick={() => setUploadTargetDocId(item.id)}
									/>
								</ListBody>
							</CardDocument>
						</ListDocuments>
					))
				)}
			</ListDocumentsContent>
			)}

			<PdfPreviewModal
				open={isPdfModalVisible}
				title="Visualizar documento"
				width="90%"
				style={{ top: 20 }}
				zIndex={2000}
				centered
				destroyOnClose
				onCancel={handleClosePdfPreview}
				footer={[
					<Button key="close" onClick={handleClosePdfPreview}>
						Fechar
					</Button>,
					pdfUrlPreview ? (
						<Button key="download" type="primary" href={pdfUrlPreview} download>
							Baixar
						</Button>
					) : null,
				]}
			>
				<PdfPreviewContainer>
					{pdfLoading && <PdfLoadingText>Carregando documento...</PdfLoadingText>}
					{pdfUrlPreview && !pdfLoading && (
						<>
							{!pdfLoadError && pdfObjectUrl ? (
								<PdfFrame
									title="pdf-preview"
									src={`${pdfObjectUrl}#toolbar=1`}
									onLoad={() => setPdfLoadError(false)}
									onError={() => setPdfLoadError(true)}
								/>
							) : (
								<PdfFallback>
									<PdfFallbackText>
										Não foi possível exibir o PDF diretamente no navegador.
									</PdfFallbackText>
									<Button type="primary" href={pdfUrlPreview} target="_blank" rel="noopener noreferrer">
										Abrir PDF em nova aba
									</Button>
								</PdfFallback>
							)}
						</>
					)}
				</PdfPreviewContainer>
			</PdfPreviewModal>
		</>
	);
};
