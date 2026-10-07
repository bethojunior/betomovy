import styled from "styled-components";

interface Button {
  backgroundColor: string;
}

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
  margin: 1rem 0;

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
