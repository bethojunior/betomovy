import styled from "styled-components";
import { Spin } from 'antd';

export const Container = styled.div``;

export const ContentServicesMaps = styled.div`
  width: 100%;
  border-bottom: 1px solid #000000;
  padding-bottom: 1rem;
`;

export const HeaderServiceMaps = styled.div`
  width: 100%;
  background-color: #001529;
  color: #ffffff;
  padding: 1rem;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
`;

export const BodyServiceMaps = styled.div``;

export const RowService = styled.div`
  padding: 0.8rem;
  border-right: 1px solid gray;
  border-left: 1px solid gray;
  border-bottom: 1px solid gray;
  display: flex;
  justify-content: space-between;

  > span {
    font-size: 14px;
    font-weight: bold;
  }

  > span:nth-child(2) {
    font-size: 16px;
    font-weight: normal;
    font-style: italic;
  }

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > span {
      text-align: center;
    }
  }
`;

export const ContentRotatePriorityService = styled.div`
  margin: 1rem 0;
  > h1 {
    font-size: 20px;
    text-align: center;
  }
`;

export const ContentCards = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
`;

export const ContentItems = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
  margin: 0.8rem 0;
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;