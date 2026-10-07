import styled from "styled-components";

export const Container = styled.div``;

export const ContentHeader = styled.div`
  margin: 1rem 0;
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
  border: none;
  background: none;
  background-color: #dc143c;
  border-radius: 5px;
  padding: 0.3rem 0.8rem;
`;
