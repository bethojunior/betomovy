import { Select } from 'antd';
import styled from 'styled-components';
import { Spin } from 'antd';

export const CheboxContent = styled.div`
	display: flex;
	flex-direction: column;

	.ant-checkbox-wrapper {
		margin-left: 8px;
	}
`;

export const Title = styled.p`
	margin-bottom: 5px;
	margin-top: 15px;
	font-size: 16px;
`;

export const Selectt = styled(Select)`
	width: 30%;

	@media (max-width: 800px) {
		width: 100%;
	}
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;