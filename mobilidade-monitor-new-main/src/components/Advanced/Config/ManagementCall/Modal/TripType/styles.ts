import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Select } from "antd";
import styled, { createGlobalStyle } from "styled-components";

export const TripTypeGenderDropdownStyles = createGlobalStyle`
	.trip-type-modal-gender-dropdown .ant-select-item-option-content {
		text-transform: capitalize;
	}
`;

export const GenderSelect = styled(Select)`
	width: 100%;
	.ant-select-selector .ant-select-selection-item {
		text-transform: capitalize;
	}
`;

export const CategoryCheckbox = styled(Checkbox)`
	margin-left: 5px;
`;

export const CategoryTooltipIcon = styled(InfoCircleOutlined)`
	margin-left: 8px;
`;

export const TripTypeIconPreview = styled.img`
	width: 100px;
	height: 100px;
	border-radius: 5px;
`;

export const SelectMultipleFullWidth = styled(Select)`
	width: 100%;
`;

export const FormFooterActions = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 100%;
	margin-bottom: -30px;
`;

export const FormFooterCancelButton = styled(Button)`
	margin-right: 10px;
`;

export const Title = styled.p`
	margin-bottom: 0;
	margin-top: 10px;
	font-size: 15px;

	&:first-child {
		margin-top: 0;
	}
`;

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

export const Label = styled.p`
	border: 1px solid #ccc;
	display: inline-block;
	padding: 6px 12px;
	cursor: pointer;
`;

export const ContentImage = styled.div`
	display: flex;
	justify-content: space-between;

	@media (max-width: 800px) {
		flex-direction: column;
	}
`;

export const ContentCategories = styled.div`
	display: flex;
	flex-direction: column;
`;