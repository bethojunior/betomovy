import styled from "styled-components";
import { Button } from "antd";

interface ButtonProps {
  $buttonSelected: boolean;
}

export const SimpleFilterContainer = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  @media (max-width: 800px) {
    justify-content: center;
    flex-direction: column;
    margin: 2rem 0;
    gap: 1rem;
  }
`;

export const OpenFilterButton = styled(Button)`
  @media (max-width: 800px) {
    font-size: 13px;
  }
  @media (max-width: 330px) {
    font-size: 11px;
  }
`;

export const SimpleFilterButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

export const SimpleFilterButton = styled(Button)<ButtonProps>`
  width: 100%;
  border: ${({ $buttonSelected }) =>
    $buttonSelected ? "1px solid #1890ff" : "1px solid #000000"};
  color: ${({ $buttonSelected }) => ($buttonSelected ? "#1890ff" : "#000000")};
  margin-left: 1px;

  @media (max-width: 800px) {
    margin-left: 0;
    font-size: 13px;
  }
  @media (max-width: 330px) {
    font-size: 11px;
  }
`;

export const CardInformationContainer = styled.div`
  margin-top: 15px;
  height: auto;
  border-radius: 5px;
  padding-bottom: 10px;
`;

export const ValueAndTotalTripsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  background-color: #fff;
  margin: 10px;
  margin-bottom: 5px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

export const TotalTripsContainer = styled.div`
  flex-direction: column;
  margin: 10px;
`;

export const CardContainer = styled.div`
  background-color: #fff;
  height: auto;
  padding: 10px;
  border-radius: 5px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  margin: 10px;
  margin-top: 0px;
`;

export const ListRacingContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const LeftInformationContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

export const RightInformationContainer = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
`;

export const DetailsContainer = styled.div`
  height: auto;
  display: flex;
`;

export const NoOneTripsFindedContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 100px;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const PaginationButton = styled(Button)`
  margin-top: 10px;
  margin-bottom: 5px;
`;
