import styled from "styled-components";
import { Input, Select } from "antd";

export const Container = styled.div``;

export const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 1rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const RowCitiesScope = styled(Row)`
  justify-content: flex-start;
`;

export const ContentInput = styled.div`
  width: 100%;
`;

export const InputFullWidth = styled(Input)`
  width: 100%;
`;

export const SelectFullWidth = styled(Select)`
  width: 100%;
`;

export const LabelText = styled.p``;

export const TextObs = styled.span`
  font-size: 13px;
  color: #6c757d;
`;
