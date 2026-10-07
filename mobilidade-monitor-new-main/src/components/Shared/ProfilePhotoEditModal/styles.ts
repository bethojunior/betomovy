import styled from 'styled-components';

export const CropArea = styled.div`
	position: relative;
	width: 100%;
	height: 320px;
	background: #333;
`;

export const CurrentPhotoPreview = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
`;

export const CurrentPhotoImage = styled.img`
	width: 140px;
	height: 140px;
	border-radius: 50%;
	object-fit: cover;
	border: 1px solid #f0f0f0;
`;

export const ZoomControl = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	margin-top: 16px;

	.ant-slider {
		flex: 1;
	}
`;
