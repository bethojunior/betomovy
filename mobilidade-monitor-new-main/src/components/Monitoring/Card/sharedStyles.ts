import styled from 'styled-components';
import { Collapse } from 'antd';

const { Panel } = Collapse;

export const PanelCollapse = styled(Panel)`
	margin-top: 0px;

	.ant-collapse-header {
		display: none !important;
	}

	.ant-collapse-content-box {
		padding: 0 !important;
	}

	&.ant-collapse
		> .ant-collapse-item
		> .ant-collapse-header
		.ant-collapse-arrow {
		align-self: center;
	}
`;

export const CardBody = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	color: black;
	align-items: center;
	padding: 4px 0 0px 0;
`;

export const ContainerDetailsTrip = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0;
	padding: 0 16px;

	@media (max-width: 800px) {
		width: 100%;
	}
`;

export const DetailsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
	justify-content: center;
	flex: 1;
	min-width: 0;
`;

export const TitleDetails = styled.p`
	margin-bottom: -4px;
	font-size: 14px;
`;

export const ValueDetail = styled.p`
	margin-bottom: -4px;
	font-weight: bold;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const ContainerDestination = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-top: 18px;
	margin-bottom: 0px;
	padding: 0 16px;

	@media (max-width: 800px) {
		flex-direction: column;
		width: 100%;
	}
`;

export const SectionAdress = styled.div`
	width: 100%;
	font-size: 15px;
	
	.ant-timeline-item {
		padding-bottom: 0px !important;
		margin-bottom: 0 !important;
	}
	
	.ant-timeline-item:last-child {
		padding-bottom: 0 !important;
	}
`;

export const AdressWrapper = styled.div`
	display: flex;
	flex-direction: row;
	gap: 4px;
`;

export const TitleAdress = styled.p`
	width: 30%;
	font-size: 14px;
`;

export const Adress = styled.p`
	font-weight: bold;
	white-space: nowrap;
	font-size: 14px;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const FooterContainer = styled.div`
	width: 100%;
	border-top: 2px solid #e0e0e0;
	margin-top: 6px;
	border-bottom: none;
`;

export const FooterContent = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 6px 16px;
	width: 100%;

	@media (max-width: 800px) {
		flex-direction: row;
		align-items: center;
		gap: 10px;
		padding: 8px 12px;
	}
`;

export const ToggleButton = styled.button`
	background: none;
	border: none;
	color: rgba(0, 0, 0, 0.85);
	cursor: pointer;
	font-size: 14px;
	padding: 0;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-weight: 500;
	line-height: 1.5;
	min-width: fit-content;
	white-space: nowrap;
	font-family: inherit;
	
	&:hover {
		color: rgba(0, 0, 0, 0.65);
	}
	
	@media (max-width: 800px) {
		font-size: 13px;
		align-self: auto;
	}
`;
