import styled from "styled-components";
import { Select } from "antd";

export const DetailStepBody = styled.form`
  margin-top: 15px;
  margin-bottom: 15px;
`;

export const Label = styled.p`
  margin-bottom: 0;
  margin-top: 5px;
`;

export const SelectState = styled(Select)`
  width: 100%;
`;

export const TwoSelects = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const MiddleSelectContainer = styled.div`
  width: 45%;
`;

export const ContentButtonStep = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
  gap: 1rem;
`;
