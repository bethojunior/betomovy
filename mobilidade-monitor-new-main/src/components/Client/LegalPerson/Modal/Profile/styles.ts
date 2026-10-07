import { Image } from 'antd';
import styled from 'styled-components';

export const ModalBody = styled.div`
	display: flex;
	height: auto;
	align-items: center;

	.ant-image-mask {
		border-radius: 100% !important;
	}
	@media (max-width: 800px) {
		flex-direction: column;
		width: 100%;
	}
`;

export const ImageContainer = styled(Image)`
	border-radius: 100%;
	width: 150px;
	max-width: 150px;
	min-width: 150px;
	height: 150px;
	max-height: 150px;
	min-height: 150px;

	.ant-image-mask {
		border-radius: 100% !important;
	}
`;

export const ClientName = styled.p`
	margin-bottom: 10;
	margin-left: 34px;
	font-size: 18px;
	font-weight: bold;

	@media (max-width: 800px) {
		margin-top: 15px;
	}
`;

export const InformationContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 97%;
	margin-left: 30px;
	white-space: nowrap;
	@media (max-width: 800px) {
		flex-direction: column;
		align-items: flex-start;
	}
`;

export const Columns = styled.div`
	@media (max-width: 800px) {
		width: 100%;
	}
`;

export const ResponseContainer = styled.div`
	margin-bottom: 10px;

	@media (max-width: 800px) {
		display: flex;
		margin-bottom: 0px;
	}
`;

export const Title = styled.p`
	margin-bottom: 0;
	font-size: 13px;
	color: #696969;

	@media (max-width: 800px) {
		font-size: 18px;
		margin-right: 5px;
	}
`;

export const Information = styled.p`
	@media (max-width: 800px) {
		font-size: 18px;
		overflow: hidden;
		text-overflow: ellipsis !important;
		-webkit-line-clamp: 1;
	}
`;
