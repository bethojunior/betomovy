import styled from "styled-components";
import { Menu } from "antd";

export const Container = styled.div`
  width: 100%;
`;

export const ContentHeader = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
`;

export const ContentSearch = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  gap: 1.25rem;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
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

export const ContentInput = styled.div``;

export const FlexContentInput = styled(ContentInput)`
  flex: 1;
`;

export const RadioContentInput = styled(ContentInput)`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;

  .ant-radio-wrapper {
    font-size: 13px;
    font-weight: 500;
    color: #334155;
    margin-right: 18px;
  }
`;

export const SearchLottieWrapper = styled.div`
  width: 30%;
`;

export const LabelText = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  margin: 0 0 6px 0;
`;

export const ContentDrivers = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ItemMenuSettings = styled(Menu.Item)`
  display: flex !important;
  align-items: center;
  gap: 10px;
  padding: 8px 14px !important;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 2px 4px !important;

  svg {
    font-size: 15px;
    flex-shrink: 0;
  }

  &:hover {
    background-color: #f1f5f9 !important;
    color: #0284c7 !important;
  }
`;

export const ContentIconSearch = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const ContentInstructionsSearch = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;

  > div {
    max-width: 600px;
    width: 100%;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  }
  h3 {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.75rem;
  }
  span {
    display: block;
    margin: 0.5rem 0;
    font-size: 13px;
    color: #475569;
    line-height: 1.5;
  }
  @media (max-width: 768px) {
    h3 {
      font-size: 14px;
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
