import styled from 'styled-components';
import { CanceledByValue } from '../../../../utils/tripCancellation';

export const SectionList = styled.div`
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #d3d3d3;
	padding: 5px;
`;

export const SectionTolls = styled.div`
	border-bottom: 1px solid #d3d3d3;
	padding: 5px;
`;

export const DetailsTolls = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-top: 5px;
	padding-right: 5px;
	padding-left: 5px;
`;

export const ItemList = styled.p`
	margin-bottom: 0;
	font-weight: bold;
`;

export const Title = styled.p`
	color: green;
	font-weight: bold;
	font-size: 17px;
	margin-bottom: 0;
`;

export const Information = styled.p`
	margin-bottom: 0;
`;

export const Situation = styled.p`
	margin-bottom: 0;

	@media (max-width: 800px) {
		width: 60%;
		margin-right: -20px;
	}
`;

export const HeaderDetailing = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
`;

export const HeaderRow = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
`;

export const ClientDetails = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const TitleChatButton = styled.p`
	color: #1890ff;
	margin: 0;
	white-space: nowrap;
`;


export const ClientImage = styled.img`
	border-radius: 50%;
	width: clamp(72px, 12vw, 120px);
	aspect-ratio: 1 / 1;
	object-fit: cover;
	display: block;
	flex-shrink: 0;
	background: #f3f4f6;
`;

export const HeaderMessage = styled.p`
	margin: 12px 0 0;
	padding: 10px 14px;
	background: #f9fafb;
	color: #374151;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	font-size: 14px;
`;

export const HeaderActions = styled.div`
	display: flex;
	align-items: center;
	flex-shrink: 0;
	gap: 4px;
`;

const CANCELED_BY_COLORS: Record<CanceledByValue, { background: string; color: string }> = {
	customer: { background: '#e6f4ff', color: '#0958d9' },
	driver: { background: '#fff3cd', color: '#856404' },
	admin: { background: '#f3e8ff', color: '#6b21a8' },
	system: { background: '#e2e3e5', color: '#41464b' }
};

export const CanceledByBadge = styled.span<{ $type: CanceledByValue }>`
	display: inline-block;
	padding: 2px 8px;
	border-radius: 999px;
	font-size: 12px;
	font-weight: 600;
	background: ${({ $type }) => CANCELED_BY_COLORS[$type].background};
	color: ${({ $type }) => CANCELED_BY_COLORS[$type].color};
`;
