import styled from "styled-components";

export const Container = styled.div`
  border: 1px solid #80808063;
  overflow: auto;
  max-height: 300px;
  padding: 1rem;
`;

export const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  cursor: pointer;
  border: 0.5px solid #8080809d;
  border-radius: 5px;
  padding: 0.5rem 0.8rem;
  margin: 0.5rem 0;
`;

export const Title = styled.h2`
  font-size: 16px;
  margin: 0;
`;
