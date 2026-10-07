import { List } from 'antd';
import styled from 'styled-components';
import { Spin } from 'antd';

export const Content = styled.div`
	margin-top: 10px;
	padding-bottom: 60px;
`;

export const ListContent = styled(List)`
	background-color: white;
	border-radius: 5px;
`;

export const ButtonContent = styled.div`
	width: 80px;
	display: flex;
	justify-content: space-between;

	@media (max-width: 800px) {
		width: 25%;
	}
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;

