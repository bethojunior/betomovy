import styled from 'styled-components';
import { Modal, Input } from 'antd';

const { TextArea } = Input;

export const AnnotationsModal = styled(Modal)``;

export const AnnotationsInput = styled(TextArea)`
	height: 120px;
	max-height: 200px;
	width: 100%;
`;
