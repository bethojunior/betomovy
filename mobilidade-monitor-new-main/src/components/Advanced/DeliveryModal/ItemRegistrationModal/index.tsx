import { Button, Input, Modal, Form, Image } from 'antd';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import api from '../../../../services/api';
import {
	InputFile,
	ContentImage,
	ButtonFooter,
	ImageContainer,
} from './styled';
import Alert from '../../../Utils/Alert';

interface PropsModal {
	isModalVisible: boolean;
	setIsModalVisible: (res: boolean) => void;
	setLoading: (res: boolean) => void;
	itemInformation: () => void;
}

type AlertProps = 'success' | 'info' | 'warning' | 'error';

interface CreateMessageProps {
	image: {
		target: {
			files: [Blob];
		};
	};
	name: string;
}

const LinkModal: FC<PropsModal> = ({
	isModalVisible,
	setIsModalVisible,
	setLoading,
	itemInformation,
}) => {
	const [messageAlert, setMessageAlert] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [typeAlert, setTypeAlert] = useState<AlertProps>('success');

	const [form] = Form.useForm();
	//@ts-ignore
	const inputFile = useRef() as React.MutableRefObject<HTMLInputElement>;
	const [imageValue, setImageValue] = useState('');

	const [imageItemModal, setImageModal] = useState<ChangeEvent<HTMLInputElement>>();
	const [textItemModal, setTextModal] = useState('');

	const [isSubmitting, setIsSubmitting] = useState(false);


	const resizeFile = (file: Blob, width: number, heigth: number) =>
		new Promise((resolve) => {
			Resizer.imageFileResizer(
				file,
				width,
				heigth,
				'PNG',
				100,
				0,
				(uri) => {
					resolve(uri);
				},
				'blob',
			);
		});

	const showMessageAlert = (type: AlertProps, message: string) => {
		setTypeAlert(type);
		setMessageAlert(message);
		setShowAlert(true);
	};

	const createMessage = (values: CreateMessageProps) => {
	if (isSubmitting) return; 
	setIsSubmitting(true);

	resizeFile(values.image.target.files[0], 100, 100).then((result) => {
		setLoading(true);
		const formData = new FormData();
		formData.append('name', values.name);
		formData.append('picture', result as Blob);

				api.post(`tripItemType`, formData)
					.then((res) => {
						if (res.status === 201) {
							setLoading(false);
							setIsSubmitting(false);
							itemInformation();
							setIsModalVisible(false);
							showMessageAlert('success', 'Item criado com sucesso');
						} else {
							setIsSubmitting(false);
							showMessageAlert('error', 'Erro ao criar item');
						}
					})
					.catch(() => {
						setIsSubmitting(false);
						showMessageAlert('error', 'Erro ao criar item');
					});
			});
		};


	useEffect(() => {
		setImageValue('');
	}, [isModalVisible]);

	useEffect(() => {
		if (imageItemModal && imageItemModal?.target?.files) {
			if (imageItemModal?.target?.files.length !== 0) {
				const fReader = new FileReader();
				fReader.readAsDataURL(imageItemModal.target.files[0]);
				fReader.onloadend = function (event) {
					setImageValue(event?.target?.result as string);
				};
			}
		}
	}, [imageItemModal]);

	return (
		<>
			<Alert
				visibility={showAlert}
				setVisibility={setShowAlert}
				message={messageAlert}
				typeAlert={typeAlert}
			/>
			<Modal
				title="Adicionar Item"
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<Form
					form={form}
					onFinish={createMessage}
					title="Adicionar Item"
					autoComplete="off"
					layout="vertical"
				>
					<Form.Item
						name="name"
						label="Nome do item"
						rules={[
							{
								required: true,
								message: 'Nome do item',
							},
						]}
					>
						<Input
							value={textItemModal}
							onChange={(e) => setTextModal(String(e))}
						/>
					</Form.Item>
					<ContentImage>
						<Form.Item
							name="image"
							label="Ícone do chamado"
							valuePropName="picture"
							rules={[
								{
									required: true,
									message: 'Escolha um ícone para o motorista',
								},
							]}
						>
							<InputFile
								onChange={(e) => setImageModal(e)}
								type="file"
								name="picture"
								accept=".png, .jpg, .svg, .jpeg"
							/>
						</Form.Item>
					</ContentImage>
					<ImageContainer
						style={{ display: 'flex', justifyContent: 'center' }}
					>
						<Image src={imageValue} />
					</ImageContainer>
					<ButtonFooter>
						<Button key="back" onClick={() => setIsModalVisible(false)}>
							Cancelar
						</Button>
						<Button type="primary" htmlType="submit" loading={isSubmitting} disabled={isSubmitting}>
							Enviar
						</Button>
					</ButtonFooter>
				</Form>
			</Modal>
		</>
	);
};

export default LinkModal;
