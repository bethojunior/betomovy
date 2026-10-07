import styled from "styled-components";
import { Button, Carousel, DatePicker } from "antd";

const { RangePicker } = DatePicker;

export const AdvancedFiltersAndSimpleCardInformation = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #dfddfd;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  padding: 1rem;
`;

export const AdvancedFilterContainerFunction = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  display: flex;
  flex-direction: row;
  height: auto;

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const AdvancedFilterContainer = styled.div`
  display: flex;
`;

export const AdvancedFilterName = styled.div`
  width: 24.5%;
  margin-top: 10px;

  @media (max-width: 800px) {
    width: 90%;
  }
`;

export const AdvancedFilterDate = styled.div`
  width: 18%;
  margin: 10px;

  @media (max-width: 800px) {
    width: 90%;
  }
`;

export const DoubleDate = styled(RangePicker)`
  width: 100%;
  display: flex !important;
`;

export const AdvancedFilterStatus = styled.div`
  width: 18%;
  margin: 10px;

  @media (max-width: 800px) {
    width: 90%;
  }
`;

export const AdvancedLabel = styled.p`
  margin-bottom: 0;
`;

export const AdvancedButtonContainer = styled.div`
  width: 200px;
  display: flex;
  align-self: center;
  margin: 1rem 0rem 0 1rem;

  @media (max-width: 800px) {
    width: 90%;
  }
`;

export const AdvancedButton = styled(Button)`
  width: 100%;

  @media (max-width: 800px) {
    margin-left: 0;
    margin-bottom: 10px;
  }
`;

export const SimpleCardContainer = styled(Carousel)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #fff;

  .slick-dots {
    & > li {
      & > button {
        background-color: #000 !important;
      }
    }
  }

  @media (min-width: 800px) {
    border-radius: 10px;
    flex: 1;
    width: 100%;

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

export const ContantMap = styled.div`
  display: flex !important;
  justify-content: center;
  flex-direction: row !important;
  padding-bottom: 20px;
  @media (max-width: 800px) {
    padding-bottom: 30px;
  }
`;

export const SimpleCard = styled.div`
  position: relative;
  width: 13.5%;
  height: auto;
  margin: 5px;
  text-align: center;
  background-color: #f3f6f1;
  border-radius: 5px;
  padding: 2px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

  .content-icon {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }

  > h3 {
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }

  > span {
    font-size: 16px;
  }

  @media (max-width: 800px) {
    width: 70%;
  }
`;

export const OthersInformation = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

export const OthersInformationCard = styled.div`
  display: flex;
  justify-content: center;
  width: 31.33%;
  border-radius: 5px;
  padding: 5px;
`;
