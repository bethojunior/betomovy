import styled from 'styled-components';
import { Collapse } from 'antd';

const { Panel } = Collapse;

export const Pannel = styled(Panel)`
	padding: 10px;
`;

export const Content = styled.div`
	background-color: #fff;
	border-radius: 5px;

	@media (max-width: 800px) {
		margin-top: 20px;
	}
`;
