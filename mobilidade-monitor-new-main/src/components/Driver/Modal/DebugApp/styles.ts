import styled from 'styled-components';

export const ListItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 10px 4px;
	border-bottom: 1px solid #f0f0f0;

	&:last-child {
		border: none;
	}
`;

export const Label = styled.p`
	display: flex;
	align-items: center;
	gap: 8px;
	flex: 1;
	margin-bottom: 0;
	color: #444;
`;

export const Configuration = styled.p<{ danger?: boolean }>`
	font-weight: bold;
	white-space: nowrap;
	flex-shrink: 0;
	margin-bottom: 0;
	color: ${({ danger }) => (danger ? 'red' : 'inherit')};
`;

export const ContentButton = styled.div`
	width: 100%;
	display: flex;
	padding-top: 10px;
	justify-content: center;
`;

export const ScrollArea = styled.div`
	max-height: 55vh;
	overflow-y: auto;
`;

export const FilterRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 16px;
`;

export const PanelContent = styled.div`
	display: flex;
	flex-direction: column;
`;
