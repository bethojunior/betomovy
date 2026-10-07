import styled from "styled-components";
import { Spin } from 'antd';

export const Container = styled.div`
  margin: 1rem 0.5rem;

  @media (max-width: 768px) {
    > h1 {
      font-size: 20px;
    }
  }
`;

export const Content = styled.div`
  margin: 1rem 0;
  border-radius: 5px;
`;

export const Button = styled.button`
  padding: 6px 12px;
  background-color: #27283c;
  border: none;
  border-radius: 5px;
  color: #f1f1f1;
  font-size: 16px;

  :hover {
    transition: all ease 0.3s;
    background-color: #30325c;
  }
`;

export const Input = styled.input`
  padding: 6px 12px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #000;
`;

export const ContentButton = styled.div`
  margin: 1rem 0;
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;
