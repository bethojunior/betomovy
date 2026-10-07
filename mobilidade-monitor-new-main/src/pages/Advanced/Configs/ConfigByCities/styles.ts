import { Input } from 'antd';
import styled from 'styled-components';
import { Spin } from 'antd';

const { Search } = Input;

export const Div = styled.div`
	padding-bottom: 75px;

	@media (max-width: 800px) {
		padding-bottom: 50px;
	}
`;

export const Body = styled.div`
	background-color: #fff;
	border-radius: 5px;

	.cardSwitch {
		flex-direction: row;
	}
	.firstColumnSwitch {
		width: 80%;
	}
	.secondColumnSwitch {
		width: 20%;
	}

	.ant-input-affix-wrapper .ant-input-affix-wrapper-focused {
	}
`;

export const ErrorLoadingData = styled.div`
	display: flex;
	justify-content: center;
	align-items: flex-end;
	height: 100px;
`;

export const MessageError = styled.p`
	margin-bottom: 0px;
`;

export const Card = styled.div`
	display: flex;
	align-items: center;
	padding: 5px;

	@media (max-width: 800px) {
		flex-direction: column;
	}

	:hover {
		box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	}
`;

export const FirstColumn = styled.div`
	width: 70%;
	padding: 10px;

	@media (max-width: 800px) {
		width: 100%;
	}
`;

export const Label = styled.p`
	margin-bottom: 0px;
	word-break: break-word;
`;

export const SecondColumn = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 30%;
	padding: 10px;
	@media (max-width: 800px) {
		width: 100%;
	}
`;

export const InputRow = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const SearchInput = styled(Search)`
	.ant-input-search-button {
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;