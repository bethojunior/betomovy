import { Card, Carousel, Image } from "antd";
import styled from "styled-components";

interface ButtonsFilteredProps {
  selected: boolean;
}

export const DashBoardContainer = styled.div`
  padding: 1.5rem;
  background-color: #F8FAFC;
  min-height: 100%;

  @media (max-width: 800px) {
    padding: 12px;
  }
`;

export const GridButtonRefresh = styled.div`
  display: flex;
  padding: 8px 0 16px 0;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 22px;
    font-weight: 800;
    color: #070A1A;
    margin: 0;
    letter-spacing: -0.3px;
  }

  button.ant-btn {
    height: 42px;
    padding: 0 20px;
    background-color: #00349A !important;
    border: none !important;
    border-radius: 10px;
    font-weight: 700;
    font-size: 13.5px;
    letter-spacing: 0.5px;
    color: #FFFFFF !important;
    box-shadow: 0 4px 14px rgba(0, 52, 154, 0.25);
    transition: all 0.22s ease;

    &:hover {
      background-color: #111111 !important;
      color: #04F3FA !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4) !important;
    }
  }
`;

export const TypesOfDrivers = styled.div`
  display: flex;
  padding: 10px 0;
  width: 100%;
  flex-direction: column;
`;

export const TitleNotTypesDrivers = styled.h1`
  font-size: 1.5rem;
  color: #64748B;
  text-align: center;
  padding: 24px 0;
`;

export const TypeDriversCarousel = styled(Carousel)`
  display: flex;
  padding: 15px;
  background-color: #f0f2f5 !important;
  width: 100%;
  .slick-dots {
    & > li {
      & > button {
        background-color: #000 !important;
      }
    }
  }

  @media (min-width: 800px) {
    border-radius: 10px;
    background-color: #fff;
    flex: 1;

    & .slick-dots-bottom {
      bottom: 0 !important;
    }

    & .slick-dots li button {
      background: #003566;
      height: 10px;
      border-radius: 8px;
    }

    & .slick-dots li.slick-active button {
      background: #001529;
    }
  }
`;

export const CardTyperDriverContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const TypeDriverDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const TypeDriverDataLabel = styled.p`
  margin-bottom: 0;
`;

export const TypeDriverDataItem = styled.p`
  margin-bottom: 0;
`;

export const StatisticContainer = styled.div`
  margin-top: 10px;
`;

export const LineConatiner = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  @media (max-width: 800px) {
    flex-direction: column;
    margin-bottom: 0;
  }
`;

export const StatisticRealTime = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 49%;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

export const CardOfInformations = styled.div`
  width: 49%;
  background-color: #FFFFFF !important;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
    border-color: rgba(4, 243, 250, 0.3);
  }

  @media (max-width: 800px) {
    margin-top: 10px;
    width: 100%;
  }
`;

export const ContentCardInformations = styled.div`
  width: 100%;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 800px) {
    flex-direction: column;
    height: auto;
  }
`;

export const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 14px 6px 14px;
  border-bottom: 1px solid #fafafa;
`;

export const ContentFilteredMonthAndDay = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ButtonsFiltered = styled.button<ButtonsFilteredProps>`
  background-color: ${(props) => (props.selected ? "#00349A" : "#FFFFFF")};
  border: 1px solid ${(props) => (props.selected ? "#00349A" : "#E2E8F0")};
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => (props.selected ? "#FFFFFF" : "#64748B")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #111111 !important;
    border-color: #04F3FA !important;
    color: #04F3FA !important;
  }
`;

export const TopDriversAndClients = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 70px;
  gap: 16px;

  @media (max-width: 800px) {
    flex-direction: column;
    height: auto;
    padding-bottom: 50px;
  }
`;

export const TripAndTicketOfToday = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background-color: #FFFFFF;
  margin-bottom: 10px;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  height: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
`;

export const ClientsAndDriversRealTime = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background-color: #FFFFFF;
  margin-top: 10px;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  height: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
`;

export const TripAndTicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const CardContainerMap = styled.div`
  display: flex !important;
  justify-content: center;
  @media (max-width: 800px) {
    padding-bottom: 30px;
  }
`;

export const TripAndTicketData = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TripAndTicked = styled.p`
  font-size: 17px;
  margin-bottom: 0;
`;

export const TypeDriversCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 16px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  margin: 8px;
  width: 100%;
  max-width: 280px;
  background-color: #FFFFFF !important;
  transition: all 0.25s ease;

  &:hover {
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
    border-color: rgba(4, 243, 250, 0.4);
  }

  .ant-card-body {
    padding: 20px 18px;
  }
`;

export const TypeDriverImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 12px;
`;

export const TypeDriverImage = styled(Image)`
  min-height: 80px;
  max-height: 90px;
  object-fit: contain;
`;

export const TypeDriverContainer = styled.div`
  margin-bottom: 14px;
  color: #070A1A;
  font-weight: 800;
  font-size: 16px;
  text-align: center;
  letter-spacing: -0.2px;
`;

export const CustomersCardWrapper = styled(CardContainerMap)`
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const CustomersTypeTitle = styled(TypeDriverContainer)`
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 800;
  color: #070A1A;
  width: 100%;
`;

export const CustomersCardsRow = styled(LineConatiner)`
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  align-items: stretch;
  width: 100%;
`;

export const CustomerMetricCard = styled(TypeDriversCard)`
  min-width: 160px;
  flex: 1;
  max-width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  background-color: #FFFFFF !important;

  .ant-card-body {
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
  }
`;

export const CustomerMetricContent = styled(TypeDriverDataContainer)`
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  width: 100%;
`;

export const CustomerMetricLabel = styled(TypeDriverDataLabel)`
  font-size: 13.5px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: normal;
  word-break: normal;
  text-align: center;
`;

export const CustomerMetricValue = styled(TypeDriverDataItem)`
  font-size: 26px;
  font-weight: 900;
  color: #00349A;
  margin-top: 4px;
`;

export const TripsAcceptedContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

export const TripsLabel = styled.p`
  margin-bottom: 0;
`;

export const TripsItem = styled.p`
  margin-bottom: 0;
`;

export const TextOfCard = styled.p`
  padding: 10px;
  padding-bottom: 0;
  font-size: 18px;
  margin: 0;
  flex-shrink: 0;
`;

export const ContainerInformationsData = styled.div`
  border-radius: 5px;
  min-width: 200px;
  max-width: 200px;
  border: 1px solid #dfdfdf;
  @media (max-width: 800px) {
    min-width: 100%;
    max-width: 100%;
  }
`;

export const InformationsDataMap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #dfdfdfdf;
`;

export const ContainerOfCarInformationGlobal = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #dfdfdf;

  @media (max-width: 800px) {
    padding: 15px;
  }
`;

export const ParagraphBasicGlobal = styled.p`
  margin-bottom: 0;
`;

export const TopItem = styled.p`
  margin-bottom: 0;
  margin-left: 4px;
  @media (max-width: 800px) {
    font-size: 14px;
  }
`;

export const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const TopName = styled.p`
  margin-bottom: 0;

  @media (max-width: 800px) {
    font-size: 14px;
  }
`;

export const SkeletonContainer = styled.div`
  padding: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const ContainerInput = styled.div`
  button {
    margin-top: 10px;
  }
`;

export const TopListContainer = styled.div`
  max-height: 250px;
  height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  flex: 1;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;

  @media (max-width: 800px) {
    max-height: 200px;
    height: 200px;
  }
`;

export const TopItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #dfdfdf;
  gap: 8px;

  @media (max-width: 800px) {
    padding: 15px;
  }
`;

export const TopItemContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

export const TopItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
  flex-shrink: 0;
`;

export const WhatsAppLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  border-radius: 50%;
  background-color: #25d366;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background-color: #128c7e;
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const TicketMedioText = styled.span`
  font-size: 12px;
  color: #666;
  margin-left: 8px;
`;

export const LoadingMoreText = styled.p`
  text-align: center;
  padding: 15px;
  color: #666;
  font-size: 14px;
  margin: 0;
`;

export const LoadingMoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 10px;
`;

export const LoadingMoreSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
`;

export const ButtonParabens = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #333;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    color: #40a9ff;
    border-color: #40a9ff;
    background-color: #fff;
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 800px) {
    font-size: 10px;
    padding: 5px 8px;
  }
`;

export const RankingFilterLabel = styled.span`
  font-size: 12px;
  color: #8c8c8c;
  margin-right: 4px;
`;
