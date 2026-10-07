import styled from "styled-components";
import { Card as CardAntd } from "antd";

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const TitleCard = styled.h2`
  text-align: center;
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 0.5rem;

  > form {
    width: 100%;
    background-color: #e2e2e2;
    padding: 1rem;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 20px;
    -webkit-box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.75);
  }

  @media (max-width: 980px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 500px) {
    width: 100%;
    margin: 2rem;
    gap: 40px;
  }
`;

export const Input = styled.input``;

export const ContentButton = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;

  button {
    width: 100%;
  }
`;

export const Card = styled(CardAntd)`
  max-width: 550px;
  width: 100%;
`;

export const ContentUploadTerms = styled.div`
  .ant-upload {
    width: 100%;
  }

  button {
    width: 100%;
  }
`;

export const ContentPdf = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  max-height: 500px;

  > object {
    width: 100%;
    height: 300px;
  }

  .react-pdf__Page__canvas {
    width: 100% !important;
    height: 100% !important;
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
