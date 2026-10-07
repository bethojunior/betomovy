import styled from "styled-components";

interface ButtonActionProps {
  backgroundColor: string;
}

interface Button {
  backgroundColor: string;
}

export const Container = styled.div`
  margin: 1rem 0;
`;

export const ContentTable = styled.div`
  margin: 1rem 0;
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

export const ContentButtonsAction = styled.div`
  display: flex;
  gap: 10px;
`;

export const ButtonAction = styled.button<ButtonActionProps>`
  padding: 6px 12px;
  color: #f1f1f1;
  background-color: ${(props) => props.backgroundColor};
  border: none;
  border-radius: 5px;
  font-size: 18px;
`;

export const Button = styled.button<Button>`
  background-color: ${(props) => props.backgroundColor};
  padding: 6px 12px;
  color: #f1f1f1;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  margin: 1rem 0;

  :hover {
    transition: all ease 0.3s;
    background-color: #191b46;
  }

  @media (max-width: 425px) {
    font-size: 14px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 6px 12px;
  font-size: 18px;
  border: 1px solid #000;
  border-radius: 5px;
  margin: 10px 0;
  font-weight: 500;
`;

export const MessageObservation = styled.span`
  font-weight: bold;
  font-size: 14px;

  @media (max-width: 425px) {
    text-align: center;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 6px 12px;
  font-size: 18px;
  border-radius: 5px;
  margin: 10px 0;
`;
