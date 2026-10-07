import { Button, Menu, Radio } from 'antd';
import Search from 'antd/lib/input/Search';
import styled from 'styled-components';
import Lottie from 'lottie-react';

export const ItemMenuSettings = styled(Menu.Item)`
	margin-top: -3px;
`;

export const ItemMenuSettingsDanger = styled(Menu.Item)`
	margin-top: -3px;
	color: #ff4d4f;
`;

export const InstructionsLottie = styled(Lottie)`
	width: 30%;
`;

export const Content = styled.div`
	flex-direction: column;
	width: 98%;
	@media (max-width: 800px) {
		display: flex;
		justify-content: center;
		align-items: center;

		.buttonJuridic {
			margin: 0 auto;
			margin-top: 2px;
			width: 89%;
		}
	}
`;

export const SearchContent = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-direction: row;
	margin-top: 10px;
	margin-left: 20px;
	width: 95%;
	border-bottom: solid #e0e0e0;
	padding-bottom: 20px;
	border-width: 1px;
	@media (max-width: 800px) {
		flex-direction: column;
		margin-left: 0;
		width: 95%;
	}
`;

export const Section = styled.div`
	width: 50%;
	display: flex;
	justify-content: flex-start;
	flex-direction: column;

	@media (max-width: 800px) {
		width: 100%;
	}
`;

export const SearchLabel = styled.p`
	margin-bottom: 0;
`;
export const SearchInput = styled(Search)`
	.ant-input {
		width: 100%;
	}

	@media (max-width: 800px) {
		width: 100%;
		margin-bottom: 3px;
	}
`;
export const AllRadios = styled.div`
	margin-left: 2px;
	margin-top: 5px;
	white-space: nowrap;
	@media (max-width: 800px) {
		width: 100%;
		margin-left: 10px;
	}
`;

export const Radios = styled(Radio)`
	white-space: nowrap;
	@media (max-width: 800px) {
		font-size: 14px;
	}
`;

export const NewregisterButton = styled(Button)`
	margin-top: 18px;
	margin-left: 30px;

	@media (max-width: 800px) {
		margin-left: 0;
	}
`;

export const ShowMoreButton = styled(Button)`
	margin-top: 10px;
	margin-bottom: 5px;
	align-self: center;
`;

export const ContentIconSearch = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 30px;
`;

export const ContentInstructionsSearch = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 20px;
	h3 {
		margin-bottom: 10px;
	}
	div {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		span {
			margin-bottom: 5px;
		}
	}
`;

export const MsgObservation = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  margin-left: 20px;
  font-size: 14px;
  color: #6c757d;
`;