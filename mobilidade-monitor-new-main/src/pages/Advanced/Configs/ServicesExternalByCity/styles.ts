import styled from "styled-components";
import { Spin } from 'antd';

export const Container = styled.div``;

export const ContentInput = styled.div`
    margin: 1rem 0;
`;

export const LabelInput = styled.label`
    display: block;
    font-size: 14px;
    margin-bottom: 0.5rem;
`;

export const ContentBtnSave = styled.div`
    margin: 1rem 0;
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;