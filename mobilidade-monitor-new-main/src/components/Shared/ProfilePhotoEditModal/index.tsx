import { FC, useState } from 'react';
import { Button, Modal, Slider, Upload, UploadProps, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Cropper, { Area } from 'react-easy-crop';
import api from '../../../services/api';
import { resizeLogo } from '../../../hooks/resizeLogo';
import { getCroppedImageBlob } from './cropImage';
import { ProfilePhotoEditModalProps } from './types';
import { CropArea, CurrentPhotoImage, CurrentPhotoPreview, ZoomControl } from './styles';

const COMPRESSED_SIZE = 200;

export const ProfilePhotoEditModal: FC<ProfilePhotoEditModalProps> = ({
	visible,
	onClose,
	entityType,
	entityId,
	currentImageUrl,
	onSuccess,
}) => {
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [saving, setSaving] = useState(false);

	const resetState = () => {
		setImageSrc(null);
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setCroppedAreaPixels(null);
	};

	const handleClose = () => {
		resetState();
		onClose();
	};

	const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
		const file = newFileList[0]?.originFileObj as File | undefined;
		if (!file) return;

		setImageSrc(URL.createObjectURL(file));
	};

	const handleSave = async () => {
		if (!imageSrc || !croppedAreaPixels) return;

		setSaving(true);
		try {
			const croppedBlob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
			const croppedFile = new File([croppedBlob], 'profile.jpg', { type: 'image/jpeg' });

			const compressedBlob = (await resizeLogo(
				croppedFile,
				COMPRESSED_SIZE,
				COMPRESSED_SIZE,
				'JPEG',
				'blob',
			)) as Blob;

			const formData = new FormData();
			formData.append('image', croppedFile);
			formData.append('imageCompressed', compressedBlob, 'profile-compressed.jpg');

			const endpoint =
				entityType === 'driver'
					? `driver/${entityId}/profileImage`
					: `customer/${entityId}/profileImage`;

			await api.post(endpoint, formData);

			message.success('Foto de perfil atualizada com sucesso');
			handleClose();
			onSuccess();
		} catch (error) {
			message.error('Não foi possível atualizar a foto de perfil');
		} finally {
			setSaving(false);
		}
	};

	return (
		<Modal
			open={visible}
			onCancel={handleClose}
			title="Editar foto de perfil"
			centered
			zIndex={1100}
			footer={[
				<Button key="cancel" onClick={handleClose}>
					Cancelar
				</Button>,
				<Button key="save" type="primary" loading={saving} disabled={!imageSrc} onClick={handleSave}>
					Salvar
				</Button>,
			]}
			destroyOnClose
		>
			{!imageSrc && (
				<CurrentPhotoPreview>
					{currentImageUrl && <CurrentPhotoImage src={currentImageUrl} />}

					<Upload
						listType="picture"
						maxCount={1}
						accept=".jpeg, .jpg, .png"
						multiple={false}
						showUploadList={false}
						onChange={handleChange}
						beforeUpload={() => false}
					>
						<Button icon={<UploadOutlined />}>Escolher foto</Button>
					</Upload>
				</CurrentPhotoPreview>
			)}

			{imageSrc && (
				<>
					<CropArea>
						<Cropper
							image={imageSrc}
							crop={crop}
							zoom={zoom}
							aspect={1}
							cropShape="round"
							onCropChange={setCrop}
							onZoomChange={setZoom}
							onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
						/>
					</CropArea>

					<ZoomControl>
						<span>Zoom</span>
						<Slider min={1} max={3} step={0.1} value={zoom} onChange={setZoom} />
					</ZoomControl>
				</>
			)}
		</Modal>
	);
};
