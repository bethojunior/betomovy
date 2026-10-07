import styled from 'styled-components';
import { Input, Select, Modal } from 'antd';

export const VoucherModal = styled(Modal)`
	.ant-modal-footer {
		display: flex;
		justify-content: center;
	}
	.ant-btn {
		width: 46.5%;
	}
`;

export const VoucherLabel = styled.p`
	margin: 0px;
	margin-left: 5px;
`;

export const VoucherInput = styled(Input)`
	height: 40px;
	width: 98%;
	margin: 5px;
	.ant-input-suffix {
		color: #d3d3d3;
	}
`;

export const SelectTypeOfVoucher = styled(Select)`
	width: 98%;
	margin: 5px;
	.ant-select-selector {
		height: 40px !important;
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
	}
`;
