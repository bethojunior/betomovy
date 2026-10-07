import styled from "styled-components";

export const Container = styled.div``;

export const ContentTable = styled.div`
  width: 100%;

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
