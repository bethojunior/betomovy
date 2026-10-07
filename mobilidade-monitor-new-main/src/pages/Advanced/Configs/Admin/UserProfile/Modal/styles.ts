import styled from 'styled-components';
import { Collapse } from 'antd';

const { Panel } = Collapse;

export const ItemsContent = styled.div`
	display: flex;
	flex-direction: column;

	.ant-checkbox-wrapper {
		margin-left: 8px;
	}
`;

export const Pannel = styled(Panel)`
	.ant-collapse-content-box {
		padding-top: 0 !important;
	}

	.ant-collapse-header {
		padding-left: 0 !important;
	}
`;

export const Title = styled.h3`
	margin-top: 10px;
	font-weight: bold;
`;
