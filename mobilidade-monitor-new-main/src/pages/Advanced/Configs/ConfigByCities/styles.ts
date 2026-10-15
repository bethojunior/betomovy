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

export const HeaderBar = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	background: #ffffff;
	padding: 20px;
	border-radius: 10px;
	margin-bottom: 20px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	border: 1px solid #f0f0f0;
`;

export const HeaderRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 16px;
`;

export const CitySelectWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	min-width: 280px;

	.city-label {
		font-size: 14px;
		font-weight: 600;
		color: #374151;
		white-space: nowrap;
	}
`;

export const SearchWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	flex: 1;
	max-width: 450px;
`;

export const CategoryFilterRow = styled.div`
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	align-items: center;
`;

export const CategoryChip = styled.button<{ $active?: boolean }>`
	background: ${(props) => (props.$active ? "#1677ff" : "#f3f4f6")};
	color: ${(props) => (props.$active ? "#ffffff" : "#4b5563")};
	border: 1px solid ${(props) => (props.$active ? "#1677ff" : "#e5e7eb")};
	padding: 6px 14px;
	border-radius: 20px;
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: ${(props) => (props.$active ? "#1677ff" : "#e5e7eb")};
	}
`;

export const ScrollToTopButton = styled.button`
	position: fixed;
	bottom: 30px;
	right: 30px;
	background-color: #1677ff;
	color: #fff;
	border: none;
	border-radius: 50%;
	width: 45px;
	height: 45px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	box-shadow: 0 4px 12px rgba(22, 119, 255, 0.35);
	cursor: pointer;
	z-index: 1000;
	transition: all 0.2s ease;

	&:hover {
		background-color: #0958d9;
		transform: translateY(-2px);
	}
`;