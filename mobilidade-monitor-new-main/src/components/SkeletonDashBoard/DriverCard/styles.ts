import { Card, Image } from 'antd';
import styled from 'styled-components';

export const CardDriverContainer = styled.div`
	display: flex !important;
	justify-content: center;
	@media (max-width: 800px) {
		padding-bottom: 30px;
	}
`;

export const CardDriver = styled(Card)`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	border-radius: 5px;
	margin-right: 10px;
	width: 100%;
	height: auto;

	.ant-card-body {
		padding-bottom: 14px;
		padding-top: 14px;
	}
	@media (min-width: 800px) {
		width: 20%;
	}
`;

export const DriverImageContainer = styled.div`
	display: flex;
	justify-content: center;
	padding-bottom: 10px;
`;

export const DriverImage = styled(Image)`
	min-height: 100px;
	max-height: 100px;
`;

export const TypeDriverContainer = styled.div`
	margin-bottom: 10px;
	color: #404040;
  width: 100%;
`;