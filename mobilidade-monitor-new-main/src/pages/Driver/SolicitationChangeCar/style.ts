import styled from 'styled-components';
import { theme_colors } from '../../../theme/theme';

export const Container = styled.div``;

export const ContentHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 0 1rem;
`;

export const ContentTable = styled.div`
	width: 100%;
	overflow: auto;

	td {
		background-color: ${theme_colors.white};
	}

	.ant-table-thead > tr > th {
		font-weight: bold;
		text-align: center;
	}

	.ant-table-tbody > tr > td {
		text-align: center;
	}

	::-webkit-scrollbar {
		width: 7px !important;
		height: 10px;
		display: block !important;
	}

	::-webkit-scrollbar-thumb {
		background: ${theme_colors.light_gray} !important;
		border-radius: 5px !important;
	}
`;

export const ContentBtnActions = styled.div`
	display: flex;
	justify-content: center;
	gap: 1.5rem;
`;

export const BrandCell = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
`;

export const BrandIcon = styled.img`
	width: 20px;
	height: 20px;
	object-fit: contain;
`;

export const DocumentThumbnail = styled.img`
	width: 48px;
	height: 48px;
	object-fit: cover;
	border-radius: 5px;
	cursor: pointer;
`;

export const DocumentPreviewImage = styled.img`
	width: 100%;
	max-height: 70vh;
	object-fit: contain;
	border-radius: 5px;
`;

export const ButtonTypeList = styled.button`
	padding: 0.5rem 0.8rem;
	font-size: 14px;
	background-color: ${theme_colors.primary_antd};
	color: ${theme_colors.white};
	border: none;
	border-radius: 5px;
`;

export const EmptyState = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 3rem 0;
	color: ${theme_colors.gray};

	svg {
		font-size: 40px;
		margin-bottom: 0.75rem;
		color: ${theme_colors.light_gray};
	}

	span {
		font-size: 16px;
	}
`;

export const ContentPagination = styled.div`
	display: flex;
	justify-content: flex-end;
	margin: 1rem 0;
`;
