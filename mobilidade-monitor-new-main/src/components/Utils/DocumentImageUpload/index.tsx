import { FC } from 'react';
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import { DocumentImageUploadProps } from './types';
import { UploadTextButton } from './styles';

export const DocumentImageUpload: FC<DocumentImageUploadProps> = ({ uploading, onClick }) => {
	return (
		<UploadTextButton icon={uploading ? <LoadingOutlined /> : <CameraOutlined />} disabled={uploading} onClick={onClick}>
			Anexar/Substituir
		</UploadTextButton>
	);
};
