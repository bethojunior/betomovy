import styled from "styled-components";

export const InputMask = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.2rem;
  border: 1px solid #d9d9d9;
  font-size: 1rem;
  color: #000000;
  background-color: #ffffff;
  transition: border-color 0.3s;

  &:focus {
    border-color: #1890ff;
  }
`;

export const Container = styled.div`
  position: relative;
`;
