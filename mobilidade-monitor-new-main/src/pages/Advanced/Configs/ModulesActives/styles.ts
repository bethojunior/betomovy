import styled from "styled-components";
import { Image } from "antd";

export const Container = styled.div`
  display: flex;
  gap: 2rem;
  overflow-y: auto;
  max-height: calc(100vh - 90px);
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    justify-content: center;
  }
`;

export const ContentTable = styled.div`
  overflow: auto;
  max-width: 900px;
  width: 100%;

  td {
  }
  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }

  @media (max-width: 900px) {
    height: 400px;
  }
`;

export const ContentLogo = styled.div`
  width: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

export const Logo = styled(Image)``;

export const ContentSimulator = styled.div`
  @media (max-width: 900px) {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
  }
`;
