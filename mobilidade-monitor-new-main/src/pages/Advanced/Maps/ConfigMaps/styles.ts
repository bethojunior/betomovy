import styled from "styled-components";
import { Spin } from 'antd';

export const Container = styled.div`
  padding: 1rem;
`;

export const Content = styled.div`
  padding-bottom: 1rem;
  border-bottom: 1px solid #a0a0a0b2;

  > h1 {
    font-size: 20px;
    margin: 1rem 0;
  }
`;

export const ContentInput = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

export const ContentBtnCollapse = styled.div`
  max-width: 150px;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;  