import { Image } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import styled from 'styled-components';

export const DriverModal = styled(Modal)`
	@media (max-width: 800px) {
		.ant-modal-body {
			padding-left: 0px;
			padding-right: 0px;
		}
	}
`;

export const Content = styled.div`
	display: flex;
	align-items: center;

	.ant-image-mask {
		border-radius: 100% !important;
	}

	@media (max-width: 800px) {
		flex-direction: column;
	}
`;

export const Columns = styled.div``;

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

export const Section = styled.div`
	margin-bottom: -5px;

	&:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 800px) {
		display: flex;
	}
`;

export const DriverImage = styled(Image)`
	border-radius: 100%;
	width: 150px;
	max-width: 150px;
	min-width: 150px;
	height: 150px;
	max-height: 150px;
	min-height: 150px;
`;

export const GeneralContent = styled.div`
	margin-left: 20px;
	width: 80%;
	white-space: nowrap;

	@media (max-width: 800px) {
		margin-left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
`;

export const ContentInformation = styled.div`
	display: flex;
	justify-content: space-between;

	@media (max-width: 800px) {
		flex-direction: column;
		width: 100%;
	}
`;

export const Name = styled.p`
	font-size: 17px;
	font-weight: bold;
	margin-bottom: 0px;

	@media (max-width: 800px) {
		margin-top: 20px;
		margin-bottom: 10px;
		font-size: 20px;
	}
`;
