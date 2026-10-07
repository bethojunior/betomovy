import { Form } from 'antd';
import styled from 'styled-components';

export const ModalBody = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

export const ItemForm = styled(Form.Item)`
	margin-bottom: 0px;
`;

export const Label = styled.p`
	&:first-child {
		margin-top: 0px;
	}
	margin-top: 10px;
	margin-bottom: 0px;
`;

export const ButtonContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;
`;
