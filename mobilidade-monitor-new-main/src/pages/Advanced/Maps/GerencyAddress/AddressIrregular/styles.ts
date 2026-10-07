import styled from "styled-components";

export const Container = styled.div``;

export const ContentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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

  td {
    background-color: #ffffff;
  }
`;

export const Button = styled.button`
  background: none;
  border: none;
`;
