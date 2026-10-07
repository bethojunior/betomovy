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

export const ContentImage = styled.div`
	display: flex;
	justify-content: right;

	@media (max-width: 800px) {
		flex-direction: column;
	} ;
`;

export const ImageContainer = styled.div`
	display: flex;
	margin-left: 25%;
	margin-right: auto;
	width: 200px;
	height: 200px;
`;

export const ButtonFooter = styled.div`
	display: flex;
	margin-top: 30px;
	justify-content: right;

	 button:last-child {
    background-color: #1890ff !important;
    border-color: #1890ff !important;
    color: #fff !important;

    &:hover,
    &:focus {
      background-color: #40a9ff !important;
      border-color: #40a9ff !important;
      color: #fff !important;
    }

    &[disabled],
    &[aria-disabled="true"] {
      opacity: 1 !important;
      background-color: #1890ff !important;
      border-color: #1890ff !important;
      color: #fff !important;
      cursor: not-allowed !important;
    }

    .ant-btn-loading-icon {
      color: white !important;
    }
  }
`;
