import styled from 'styled-components';
import { Card, Image, Modal, Select } from 'antd';
import Document from '../../../assets/documentIcon.png';

export const CARD_WIDTH = 240;

export const ListDocumentsContent = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, ${CARD_WIDTH}px);
	justify-content: center;
	gap: 24px;
	padding-top: 8px;
`;

export const EmptyMessage = styled.p`
	grid-column: 1 / -1;
	margin-top: 30px;
	margin-bottom: 0;
	text-align: center;
	color: #8c8c8c;
`;

export const DocumentImageContainer = styled.div<{ $dragging?: boolean }>`
	width: 100%;
	height: 200px;
	background-color: ${({ $dragging }) => ($dragging ? '#e6f4ff' : '#fafafa')};
	outline: ${({ $dragging }) => ($dragging ? '2px dashed #1677ff' : 'none')};
	outline-offset: -2px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background-color 0.15s ease, outline-color 0.15s ease;
`;

export const DocumentIcon = styled.div`
	background-image: url(${Document});
	background-size: cover;
	background-position: center;
	width: 100%;
	height: 100%;
`;

export const DocumentIconWrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 36px;
`;

export const DocumentImage = styled(Image)`
	width: 100%;
	height: 100%;
	object-fit: contain;
`;

export const ListDocuments = styled.div`
	display: flex;
	flex-direction: column;
	width: ${CARD_WIDTH}px;
`;

export const CARD_HEIGHT = 400;

export const CardDocument = styled(Card)`
	width: ${CARD_WIDTH}px;
	height: ${CARD_HEIGHT}px;
	border-radius: 12px;
	overflow: hidden;
	text-align: center;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	transition: box-shadow 0.15s ease, transform 0.15s ease;
	display: flex;
	flex-direction: column;

	&:hover {
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
		transform: translateY(-2px);
	}

	.ant-card-body {
		flex: 1;
		min-height: 0;
		display: flex !important;
		padding: 16px !important;
	}
`;

export const ListBody = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	gap: 12px;
`;

export const DocumentLabel = styled.p`
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	height: 44px;
	margin-bottom: 5px;
	font-size: 16px;
	font-weight: bold;
	margin-top: 10px;
`;

export const Description = styled.p`
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
	margin-bottom: 0;
	margin-top: 5px;
`;

export const Actions = styled.div`
	display: flex;
	gap: 8px;
	margin-top: 8px;
	flex-wrap: wrap;
	justify-content: center;
	width: 100%;
`;

export const SelectListDocuments = styled(Select)`
	width: 100%;

	.ant-select-selector {
		height: 42px !important;
		border-radius: 8px !important;
		display: flex;
		align-items: center;
	}

	.ant-select-selection-item {
		font-size: 14px;
		font-weight: 500;
	}
`;

// Preview de PDF
export const PdfPreviewModal = styled(Modal)`
	.ant-modal-body {
		padding: 0 !important;
		height: 80vh;
	}
`;

export const PdfPreviewContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 80vh;
	width: 100%;
	background: #f7f7f7;
`;

export const PdfFrame = styled.iframe`
	border: 0;
	width: 100%;
	height: 100%;
`;

export const PdfLoadingText = styled.p`
	padding: 20px;
	text-align: center;
`;

export const PdfFallback = styled.div`
	padding: 40px;
	text-align: center;
`;

export const PdfFallbackText = styled.p`
	margin-bottom: 20px;
	font-size: 16px;
`;
