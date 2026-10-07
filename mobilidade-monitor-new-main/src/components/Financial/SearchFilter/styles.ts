import styled from "styled-components";
import { Button, DatePicker, Select } from "antd";

const { RangePicker } = DatePicker;

export const AdvancedSearchBody = styled.div`
  border-bottom: 1px solid #d3d3d3;
`;

export const AdvancedFilterContainerFunction = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 10px;

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const AdvancedFilterContainer = styled.div`
  display: flex;
`;

export const AdvancedFilterName = styled.div`
  width: 21%;

  @media (max-width: 800px) {
    width: 90%;
    margin-bottom: 10px;
  }
`;

export const AdvancedFilterDate = styled.div`
  width: 18%;

  @media (max-width: 800px) {
    width: 90%;
    margin-bottom: 10px;
  }
`;

export const DoubleDate = styled(RangePicker)`
  width: 100%;
  display: flex !important;
`;

export const AdvancedFilterStatus = styled.div`
  width: 18%;

  @media (max-width: 800px) {
    width: 90%;
  }
`;

export const ItemsContainer = styled.div`
  width: 14%;

  @media (max-width: 800px) {
    width: 90%;
  }
`;

export const AdvancedLabel = styled.p`
  margin-bottom: 0;
`;

export const SelectCity = styled(Select)`
  width: 100%;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

export const CheckBoxContainer = styled.div`
  width: 8%;
  min-width: 8%;
  max-width: 8%;
  padding-top: 22px;

  @media (max-width: 800px) {
    width: 90%;
    min-width: 90%;
    max-width: 90%;
    padding-top: 10px;
    padding-bottom: 10px;
  }
`;

export const AdvancedButtonContainer = styled.div`
  flex-direction: column;
  display: flex;
  width: 7%;

  @media (max-width: 800px) {
    width: 90%;
  }
`;

export const AdvancedButton = styled(Button)`
  width: 100%;
  margin-top: 18px;

  @media (max-width: 800px) {
    margin-left: 0;
    margin-top: 0;
    margin-bottom: 10px;
  }
`;
