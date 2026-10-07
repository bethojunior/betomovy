import styled from "styled-components";
import { HiOutlineArrowNarrowDown } from "react-icons/hi";
import { Collapse } from "antd";
import { theme_colors } from "../../../../theme/theme";

const { Panel } = Collapse;

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
  gap: 2rem;

  @media (max-width: 950px) {
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
  }
`;

export const ContentTrip = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 960px) {
    gap: 2rem;
    flex-direction: column;
  }

  @media (max-width: 425px) {
    flex-direction: column;
  }
`;

export const ContentInformationsTrip = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 4px;
`;

export const FlexContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const LinkWhatsapp = styled.a`
  width: 100%;
`;

export const DateItem = styled.p`
  color: #545454;
  margin-bottom: 0;
`;

export const CardLabel = styled.p`
  margin-bottom: 0;
  font-weight: semibold;
  color: #000;
`;

export const StatusItem = styled.p`
  color: #545454;
  margin-bottom: 0;
  margin-left: 4px;
`;

export const ClientNameItem = styled.p`
  color: #545454;
  margin-left: 4px;
  margin-bottom: 0;
  white-space: nowrap;

  @media (max-width: 800px) {
    overflow: hidden;
    text-overflow: ellipsis !important;
    -webkit-line-clamp: 1;
  }
`;

export const FlowItem = styled.span<{ flow?: "mobicity" | "ifood" }>`
  color: ${({ flow }) => (flow === "ifood" ? "red" : flow === "mobicity" ? "green" : flow === "whatsapp" ? "green" : "black")};
  margin-left: 4px;
  margin-bottom: 0;
  white-space: nowrap;
  text-transform: capitalize;

  @media (max-width: 800px) {
    overflow: hidden;
    text-overflow: ellipsis !important;
    -webkit-line-clamp: 1;
  }
`;

export const ValueItem = styled.p`
  color: #1890ff;
  margin-bottom: 0;
`;

export const ContentFormPayment = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 800px) {
    width: 100%;
    align-items: flex-start;
    white-space: nowrap;
  }
`;

export const ContentReportCustomer = styled.div<{ color: string }>`
  width: 100%;

  h3 {
    color: ${({ color }) => color};
  }

  p {
    color: ${theme_colors.gray};
  }
`;

export const SituationItem = styled.p`
  color: #545454;
  margin-bottom: 0;
  font-size: 14px;
`;

export const PaymentItem = styled.p`
  color: #545454;
  margin-left: 4px;
  margin-bottom: 0;
`;

export const CanceledItem = styled.p`
  color: #545454;
  margin-left: 4px;
  margin-bottom: 0;
`;

export const DetailsContainer = styled.div`
  height: auto;
  display: flex;
`;

export const DropDetailsContainer = styled(Collapse)`
  width: 100%;
  background-color: #fff;

  .ant-collapse-header {
    padding-bottom: 10px !important;
    padding-top: 10px !important;
    padding-left: 2px !important;
  }
`;

export const DropDetails = styled(Panel)`
  .ant-collapse-header {
    & > span {
      color: #545454;
    }
  }
`;

export const StartAndEndContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

export const UlRacing = styled.ul`
  margin-bottom: 0px;
`;

export const LiRacing = styled.li`
  margin-left: 15px;
`;

export const LiArrow = styled.li`
  list-style: none;
  margin-left: -8px;
`;

export const IconArrow = styled(HiOutlineArrowNarrowDown)`
  font-size: 20px;
  margin-bottom: -5px;
`;

export const DescriptionTypeTrip = styled.span`
  display: block;
  margin: 0.5rem 0;
  font-weight: bold;
`;
