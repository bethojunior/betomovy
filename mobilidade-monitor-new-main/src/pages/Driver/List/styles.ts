import styled from "styled-components";

import { Menu } from "antd";

export const Container = styled.div``;

export const ContentSearch = styled.div`
  width: 100%;
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;

    div {
      width: 100% !important;
    }
  }
`;

export const ContentTypesSearch = styled.div`
  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const ContentHeader = styled.div`
  padding-bottom: 1rem;
  border-bottom: 1px solid rgb(224, 224, 224);
`;

export const ContentInput = styled.div``;

export const FlexContentInput = styled(ContentInput)`
  flex: 1;
`;

export const RadioContentInput = styled(ContentInput)`
  margin-top: 10px;
`;

export const SearchLottieWrapper = styled.div`
  width: 30%;
`;

export const LabelText = styled.p``;

export const ContentDrivers = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ItemMenuSettings = styled(Menu.Item)`
  margin-top: -5px;
`;

export const ContentIconSearch = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const ContentInstructionsSearch = styled.div`
  display: flex;
  justify-content: center;
  > div {
    max-width: 600px;
    width: 100%;
  }
  span {
    display: block;
    margin: 0.5rem 0;
  }
  @media (max-width: 768px) {
    h3 {
      font-size: 16px;
    }
    span {
      font-size: 12px;
    }
    padding: 0 1rem;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
`;

export const LoadingText = styled.h2`
  color: #8c8c8c;
  font-weight: 400;
  font-size: 18px;
  margin-top: 20px;
`;
