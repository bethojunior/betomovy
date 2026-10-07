import { Collapse } from 'antd';
import styled from 'styled-components';
import { Spin } from 'antd';

const { Panel } = Collapse;

export const Content = styled.div`
	display: flex;
	justify-content: center;
`;

export const CardReport = styled.div`
	width: 80%;
	background-color: white;
	margin-top: 10px;
	border-radius: 5px;

	@media (max-width: 800px) {
		width: 100%;
	}
`;

export const Pannel = styled(Panel)`
	.ant-collapse-content-box {
		display: flex !important;
		flex-direction: column !important;
		align-items: flex-start !important;
	}
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;