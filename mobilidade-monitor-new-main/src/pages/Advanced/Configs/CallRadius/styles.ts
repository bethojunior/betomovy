import styled from 'styled-components';
import { Spin } from 'antd';

export const Container = styled.div`
	width: 100%;
`;

export const Content = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	margin: 1rem 0;

	> form {
		width: 500px;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		background-color: #dddddd;
		border-radius: 5px;
	}

	> form label {
		display: block;
	}

	> form > div {
		margin-bottom: 1rem;
	}
`;

export const Input = styled.input`
	width: 100%;
	padding: 6px 12px;
	border: 1px solid #000;
	border-radius: 5px;
`;

export const Button = styled.button`
	padding: 6px 12px;
	color: #f1f1f1;
	border: none;
	border-radius: 5px;
	background-color: #27283c;
	cursor: pointer;

	:hover {
		transition: all ease 0.3s;
		background-color: #323466;
	}
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 50vh;
`;