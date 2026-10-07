import styled from "styled-components";
import { Button, DatePicker, Select } from "antd";
import { LineChart } from "@mui/x-charts/LineChart";

const { RangePicker } = DatePicker;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  border-bottom: 1px solid #d3d3d3;
  padding-bottom: 15px;

  @media (max-width: 800px) {
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`;

export const ItemsContainer = styled.div`
  width: 28%;
  @media (max-width: 800px) {
    width: 90%;
  }
`;

export const SearchLabel = styled.p`
  margin-bottom: 0px;

  @media (max-width: 800px) {
    margin-top: 10px;
  }
`;

export const FilterButton = styled(Button)`
  margin-top: 18px;
  width: 7%;
  @media (max-width: 800px) {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 90%;
  }
`;

export const ProductionDataContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

export const FirstColumnData = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 50%;

  @media (max-width: 800px) {
    width: 100%;
    flex-direction: column;
  }
`;

export const LastColumnData = styled.div`
  display: flex;
  justify-content: space-around;
  width: 50%;

  @media (max-width: 800px) {
    width: 100%;
    flex-direction: column;
  }
`;

export const DataContainer = styled.div`
  @media (max-width: 800px) {
    display: flex;
    white-space: nowrap;
  }
`;

export const ProductionMonth = styled(LineChart)`
  width: 100%;
`;

export const DateSelect = styled(RangePicker)`
  width: 100% !important;

  @media (max-width: 800px) {
    width: 100% !important;
  }
`;

export const SelectCity = styled(Select)`
  width: 100%;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

export const DataInformationContainer = styled.div`
  background-color: #ffffff;
  margin-top: 10px;
  border-radius: 5px;
  padding: 10px;
`;

export const NoOneDataFindedContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 100px;
  @media (max-width: 800px) {
    padding: 10px;
  }
`;

export const Title = styled.p`
  margin-bottom: 0px;
  font-size: 15px;
`;

export const Information = styled.p`
  font-weight: bold;

  @media (max-width: 800px) {
    margin-left: 4px;
    overflow: hidden;
    text-overflow: ellipsis !important;
    -webkit-line-clamp: 1;
  }
`;

export const ChartsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 10;

  @media (max-width: 800px) {
    justify-content: center;
    flex-direction: column;
  }
`;

export const ChartBox = styled.div`
  width: 45%;

  @media (max-width: 800px) {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
  }
`;

export const MonthLabelProduction = styled.p`
  font-size: 18px;
`;

export const YearProductionLabel = styled.p`
  font-size: 18px;
  margin-bottom: 0px;
  @media (max-width: 800px) {
    margin-top: 20px;
  }
`;
