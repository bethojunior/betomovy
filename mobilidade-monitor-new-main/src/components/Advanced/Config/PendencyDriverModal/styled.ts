import { Input } from 'antd';
import styled from 'styled-components';

export const TextModal = styled.p`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	width: 70%;
	margin-bottom: 0;
`;

export const InputType = styled.p`
	display: flex;
`;

export const ModalContainer = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
`;

export const InputModal = styled(Input)`
	width: 30%;
`;
