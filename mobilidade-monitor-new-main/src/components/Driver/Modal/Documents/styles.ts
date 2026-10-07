import styled from 'styled-components';
import { Button, Menu, Modal, Select } from 'antd';

export const Content = styled(Modal)`
	&.ant-modal {
		max-width: 98vw;
	}
`;

export const Navbar = styled(Menu)`
	display: flex;
	justify-content: center;
	margin-bottom: 16px;
`;

type ButtonProp = {
	visible: boolean;
};

export const ButtonRequestNewDocuments = styled(Button)<ButtonProp>`
	display: ${(props) => (props.visible ? '' : 'none')};
`;

export const TabBody = styled.div`
	min-height: 400px;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

export const RequestNewDocumentContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	width: 100%;
	max-width: 340px;
	margin: 0 auto;
`;

export const RequestNewField = styled.div`
	width: 100%;
`;

export const RequestNewDocumentLabel = styled.p`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 8px;
	margin-top: 0;
	width: 100%;
	font-size: 13px;
	font-weight: 600;
	color: #595959;

	.anticon {
		color: #262626;
		font-size: 15px;
	}
`;

export const SelectStatusDocument = styled(Select)`
	width: 100%;

	.ant-select-selector {
		height: 38px !important;
		border-radius: 8px !important;
		display: flex;
		align-items: center;
	}
`;
