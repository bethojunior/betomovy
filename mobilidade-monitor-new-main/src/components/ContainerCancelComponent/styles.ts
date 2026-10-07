import styled from "styled-components";

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  width: max-content;
`;

export const SectionRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
`;

export const ContainerCancel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const RadioButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  input {
    margin-top: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    background-color: #f1f1f1;
    border-radius: 5px;
    padding: 0.5rem 0.8rem;
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
      color: #8c8c8c;
      background-color: #f1f1f1;
      border-radius: 5px;
      padding: 0.5rem 0.8rem;
    }
  }
`;

export const RadioButton = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const PartialRefundInput = styled.input`
  margin-top: 10px;
`;

export const TextArea = styled.textarea`
  min-height: 200px;
  max-height: 250px;
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  resize: none;
  margin: 5px 0;
  background-color: #ccc;
`;
