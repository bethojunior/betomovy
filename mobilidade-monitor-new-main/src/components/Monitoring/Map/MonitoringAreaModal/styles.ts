import { Image } from 'antd';
import styled from 'styled-components';

export const ClientAvatar = styled.div`
	width: clamp(72px, 14vw, 120px);
	aspect-ratio: 1 / 1;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	background: #f3f4f6;
`;

export const Imageclient = styled(Image)`
	&& {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
`;
export const Status = styled.div`
	display: flex;
	align-items: center;
`;
export const CardClient = styled.div`
	width: 100%;
	padding: 12px;
	border: 1px solid #f0f0f0;
	border-radius: 8px;
	background-color: #fff;
`;

export const ClientInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex: 1;

	> p {
		margin: 0;
		text-align: left;
	}

	> p:first-child {
		font-size: 16px;
		font-weight: 600;
		color: #1f2937;
	}

	> p:nth-child(2) {
		font-size: 14px;
		color: #6b7280;
	}

	> p:nth-child(3) {
		font-size: 15px;
		color: #111827;
		font-weight: 500;
	}
`;

export {
	ModalContainer,
	ModalHeader,
	SearchInput,
	ScrollableList,
	EmptyState,
} from '../sharedModalStyles';

export const AreaCard = styled.div`
	width: 100%;
	padding: 16px;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	transition: all 0.2s ease;

	&:hover {
		border-color: #1677ff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
`;

export const AreaInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex: 1;
`;

export const AreaStatus = styled.div`
	display: flex;
	align-items: center;
	flex-shrink: 0;
`;
