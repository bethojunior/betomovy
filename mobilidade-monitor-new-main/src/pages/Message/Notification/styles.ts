import { Button } from "antd";
import styled from "styled-components";
import { Spin } from 'antd';

export const NewNotificationButton = styled(Button)`
	margin-bottom: 10px
`;

export const ButtonContainer = styled.div`
	display: flex; 
	justify-content: center
`;

export const PaginationButton = styled(Button)`
	margin: 10px
`;

export const MessageListEmpty = styled.p`
	text-align: center
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;