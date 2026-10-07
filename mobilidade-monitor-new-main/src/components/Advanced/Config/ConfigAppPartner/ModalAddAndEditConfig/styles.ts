import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  input[type="color"] {
    border: none;
    background: none;
    cursor: pointer;
    width: 50px;
    height: 30px;

    ::-webkit-color-swatch {
      width: 100%;
      height: 100%;
    }
  }

  .ant-upload-wrapper{
    width: 100% !important;
  }

  .ant-upload-wrapper .ant-upload-select{
    width: 100% !important;
  }
`;

export const Form = styled.form``;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 10px;
`;

export const ContentInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0.5rem 0;
`;

export const LabelInput = styled.label``;

export const MessageError = styled.span`
  color: red;
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;
