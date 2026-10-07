import styled from "styled-components";

export const Container = styled.div``;

export const ContentInput = styled.div`
  margin: 1rem 0;
`;

export const Form = styled.form``;

export const LabelInput = styled.label``;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

export const ContentUploaderImage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  > span {
    width: 100%;
  }
`;

export const MessageError = styled.span`
  color: red;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
