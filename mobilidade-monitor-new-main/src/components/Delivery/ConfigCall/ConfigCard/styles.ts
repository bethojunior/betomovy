import { Input } from "antd";
import styled from "styled-components";
import { InputProps } from "./types";

export const InputConf = styled(Input)<InputProps>`
  width: ${({ width }) => width};
  min-width: 50px;
`;

export const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px;
  background-color: #fff;
  border: 0.5px solid #d8d8d8;
  border-radius: 9.8px;

  &:hover {
    background-color: #f5f5f5;
    transition: 0.3s;
  }
`;

export const ButtonContainer = styled.div`
  width: 30%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
