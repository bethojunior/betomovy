import styled from 'styled-components';
import { Modal, Table } from 'antd';

export const DependentsModal = styled(Modal)`
	display: flex;
	justify-content: center;
`;

export const TableOfDependent = styled(Table)`
	.ant-table-pagination-right {
		display: none;
	}

	@media (max-width: 380px) {
		.ant-table-cell {
			font-size: 11.5px;
		}
	}
`;
