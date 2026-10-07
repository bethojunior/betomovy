import { Image } from "antd";
import styled from "styled-components";

export const Container = styled.div``;

export const ContentSelectCallGroups = styled.div`
  display: flex;
  gap: 15px;
`;

export const Avatar = styled(Image)`
  min-width: 100px;
  max-width: 100px;
  min-height: 100px;
  max-height: 100px;
  border-radius: 5px;
  object-fit: cover;

  @media (max-width: 800px) {
    min-width: 70px;
    max-width: 70px;
    min-height: 70px;
    max-height: 70px;
  }
`;

export const ContentTable = styled.div`
  width: 100%;
  margin: 10px 0;

  overflow: auto;

  td {
    background-color: #ffffff;
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
`;

export const ContentActions = styled.div`
  display: flex;
  gap: 10px;
`;

export const ContentPagination = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;
