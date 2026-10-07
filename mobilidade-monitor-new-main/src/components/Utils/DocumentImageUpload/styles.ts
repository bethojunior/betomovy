import styled from 'styled-components';
import { Button, Upload } from 'antd';

export const UploadTextButton = styled(Button)`
	width: 100%;
	height: 32px;
	font-size: 13px;
	border-radius: 8px;
`;

export const UploadDragger = styled(Upload.Dragger)`
	width: 100%;

	.ant-upload-drag-icon {
		color: #1677ff;
		font-size: 56px;
	}

	.ant-upload-btn {
		padding: 48px 24px !important;
	}

	.ant-upload-text {
		font-size: 18px !important;
	}

	.ant-upload-hint {
		font-size: 14px !important;
	}
`;

export const DropzoneContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 20px;
	min-height: 400px;
	width: 100%;
`;
