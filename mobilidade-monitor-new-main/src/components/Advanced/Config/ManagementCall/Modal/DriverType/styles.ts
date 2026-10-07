import styled from 'styled-components';

export const InputFile = styled.input`
	::-webkit-file-upload-button {
		background-color: #1890ff;
		color: #fff;
		border: none;
		padding: 5px 10px 5px 10px;
		border-radius: 5px;
	}
	color: #fff;
`;

export const ContentButtonIcon = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	margin-bottom: 10px;
`;

export const ContentButton = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 100%;
	margin-bottom: -30px;
`;

export const ModalBody = styled.div`
	max-height: 75vh;
	overflow-y: auto;
	padding-right: 8px;
`;

export const ContentImage = styled.div`
	display: flex;
	justify-content: space-between;

	@media (max-width: 800px) {
		flex-direction: column;
	} ;
`;
