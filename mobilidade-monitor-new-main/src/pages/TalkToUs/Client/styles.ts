import { Button } from 'antd';
import styled from 'styled-components';
import { Spin } from 'antd';

export const Body = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
`;

export const Content = styled.div`
	background-color: #fff;
	padding: 15px;
	border-radius: 5px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	width: 80%;
	margin-bottom: 30px;

	@media (max-width: 800px) {
		width: 100%;
	}
`;

export const LinksContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
`;

export const LinkButton = styled(Button)`
	padding-left: 0;
`;

export const PaginationContainer = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 20px;
`;

export const EmptyMessage = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;

