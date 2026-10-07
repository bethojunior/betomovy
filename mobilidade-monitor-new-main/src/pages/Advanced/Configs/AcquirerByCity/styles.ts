import styled from 'styled-components';
import { Spin } from 'antd';

export const AcquirerBody = styled.div`
	flex-direction: column;
	display: flex;
	align-items: center;

	.ant-form-item {
		margin-bottom: 0px;
	}
`;

export const SearchContainer = styled.div`
	width: 100%;
	padding-left: 10px;
	padding-right: 10px;
	margin-bottom: 20px;
	background-color: #fff;

	@media (max-width: 800px) {
		width: 100%;
	}
`;

export const LabelSelect = styled.div`
	margin-bottom: 10px;
`;

export const BankContainer = styled.div`
	border-radius: 5px;
	padding-left: 10px;
`;

export const Title = styled.p`
	margin-bottom: 0px;
	font-weight: bolder;
`;

export const CardDataContainer = styled.div`
	width: 60%;
	background-color: #fff;
	padding: 10px;
	border-radius: 5px;
	@media (max-width: 800px) {
		width: 100%;
	}
`;

export const Container = styled.div``;

export const DataContainer = styled.div`
	padding: 10px;
`;

export const ButtonContainer = styled.div`
	padding-right: 10px;
	display: flex;
	justify-content: flex-end;
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;
