import styled from "styled-components";

export const Container = styled.div``;

export const ContentHeader = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    padding: 0 1rem;
  }
`;

export const ContentInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;

  @media (max-width: 600px) {
    max-width: none;

    input {
      max-width: none !important;
      width: 100%;
    }

    select {
      max-width: none !important;
    }
  }
`;

export const ContentBtnSendGeneral = styled.div`
  margin-bottom: 15px;
  max-width: 200px;

  @media (max-width: 600px) {
    max-width: none;
    padding: 0 1rem;
  }
`;

export const ContentBtnActionsFilter = styled.div`
  align-self: flex-end;
  display: flex;
  gap: 5px;
  max-width: 100px;
  width: 100%;

  @media (max-width: 600px) {
    max-width: none;
    margin-top: 15px;
    width: 100%;
    align-self: auto;

    button {
      width: 100%;
    }
  }
`;

export const LabelText = styled.p``;

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

export const ContentActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export const ContentPagination = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;
