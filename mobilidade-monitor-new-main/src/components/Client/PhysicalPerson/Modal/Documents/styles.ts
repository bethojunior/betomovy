import styled from 'styled-components';
import { Button, Modal, Menu, Select } from 'antd';

export const DocumentsModal = styled(Modal)`
	&.ant-modal {
		max-width: 96vw;
	}
`;

type VisibilityProps = {
	visibility: boolean;
};

export const ButtonRequestNewDoc = styled(Button)<VisibilityProps>`
	display: ${(props) => (props.visibility ? '' : 'none')};
`;

export const TabBody = styled.div`
	min-height: 400px;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

export const SolicitationDocContainerGlobal = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`;

export const SolicitationDocContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 100%;
	max-width: 340px;
	margin: 0 auto;
`;

export const SolicitationField = styled.div`
	width: 100%;
`;

export const LabelItemSolicitationDoc = styled.label`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 13px;
	font-weight: 600;
	color: #262626;
	margin-bottom: 8px;

	.anticon {
		color: #262626;
		font-size: 15px;
	}
`;

export const FullWidthSelect = styled(Select)`
	width: 100%;
	flex: 1;

	.ant-select-selector {
		height: 40px !important;
		border-radius: 8px !important;
	}
`;

export const DocumentsNavbar = styled(Menu)`
	display: flex;
	justify-content: center;
	margin-bottom: 16px;
`;

export const PersonalDocContainerGlobal = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
`;

export const PersonalDocContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	border: 1px solid #f0f0f0;
	border-radius: 10px;
	padding: 12px 16px;
	width: 100%;
`;

export const PersonalDataConatiner = styled.div`
	flex: 1;
`;

export const PersonalDataLabel = styled.p`
	margin-bottom: 0;
	font-weight: 500;
`;

export const HaventDocumentsLabel = styled.p`
	margin-bottom: 0;
	font-size: 15px;
	color: #8c8c8c;
	margin-top: 30px;
	text-align: center;
`;

export const ContainerSelectFromSolicitation = styled.div`
	width: 100%;
`;

export const SelectTest = styled(Select)`
	width: 135px;
`;

export const PersonalStatusSelect = styled(Select)`
	min-width: 160px;

	.ant-select-selector {
		border-radius: 8px !important;
	}
`;
