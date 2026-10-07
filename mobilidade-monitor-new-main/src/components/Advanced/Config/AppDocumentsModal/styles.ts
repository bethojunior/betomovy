import { Input, Divider, Modal } from 'antd';
import styled from 'styled-components';

export const EditModal = styled(Modal)`
	.ant-modal-body {
		padding-top: 10px !important;
		padding-bottom: 10px !important;
	}
`;

export const Label = styled.p`
	margin-bottom: 2px;
`;

export const InputEdit = styled(Input)``;

export const Description = styled.p`
	margin-bottom: 12px;
	color: #8c9399;
	font-size: 13px;
`;

export const Line = styled(Divider)`
	margin-top: 15px;
	margin-bottom: 14px;
`;

export const CheckBoxContainer = styled.div`
	display: flex;
	margin-bottom: 3px;
`;

export const CheckBoxLabel = styled.p`
	margin-bottom: 0;
	margin-left: 4px;
`;
