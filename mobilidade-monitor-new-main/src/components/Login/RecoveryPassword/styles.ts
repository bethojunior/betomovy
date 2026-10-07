import styled from 'styled-components';
import { Alert, Input } from 'antd';

export const ErrorTitle = styled.p`
	color: red;
	margin-left: 3px;
	margin-top: 10px;
	margin-bottom: -10px;
`;

export const PasswordLabel = styled.p`
	margin-bottom: 5px;
	margin-top: 20px;
`;

export const AlertSuccess = styled(Alert)`
	position: absolute;
	top: 10px;
	left: 10px;
`;

export const InputCodeVerification = styled(Input)`
	width: 30%;
	height: 50px;
	font-size: 20px;
	text-align: center;
`;
