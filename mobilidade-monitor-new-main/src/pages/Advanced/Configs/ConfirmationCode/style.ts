import styled from 'styled-components';
import { Spin } from 'antd';

export const Container = styled.div`
	width: 100%;
`;

export const Content = styled.div`
	> div {
		margin: 1rem 0;
	}
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;