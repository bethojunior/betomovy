import { Button } from "antd";
import styled from "styled-components";

export const Content = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
`;

export const ButtonPaginate = styled(Button)`
  align-items: center;
  justify-content: center;
  display: flex;
`;

export const ContentPaginate = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 1rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  @media (max-width: 630px) {
    flex-direction: column;
    gap: 10px;

    > div:nth-child(2) {
      display: flex;
      align-self: center;
      margin: 0.5rem;
    }
  }
`;

export const ContentTable = styled.div`
  overflow: auto;

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }
`;
