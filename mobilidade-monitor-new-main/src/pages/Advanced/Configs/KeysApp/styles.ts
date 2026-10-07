import styled from "styled-components";
import { Spin } from 'antd';

export const Content = styled.div`
  width: 100%;
`;

export const Card = styled.div`
  border-radius: 5px;
  align-self: center;
  width: 80%;
  margin-bottom: 50px;

  @media (min-width: 1500px) {
    width: 50%;
  }

  @media (max-width: 800px) {
    width: 100%;
  }
`;

export const Title = styled.p`
  width: 100%;
  margin-bottom: 5px;
`;

export const Section = styled.div`
  width: 100%;
  display: flex;
`;

export const ContentKeys = styled.div`
  width: 100%;
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;