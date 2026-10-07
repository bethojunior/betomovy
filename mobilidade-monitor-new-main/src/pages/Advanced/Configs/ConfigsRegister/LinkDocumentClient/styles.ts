import styled from "styled-components";
import { Spin } from 'antd';

export const Container = styled.div``;

export const DescriptionDocument = styled.small`
  display: block;
  margin: 0.5rem;
  font-size: 12px;
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;
