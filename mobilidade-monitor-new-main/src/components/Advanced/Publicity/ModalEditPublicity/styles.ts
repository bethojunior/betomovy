import styled from "styled-components";
import { DatePicker, Select } from "antd";

export const Content = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px;
`;

export const ContentInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  > *:last-child {
    margin-bottom: 0;
  }
`;

export const ContentInputPadded = styled(ContentInput)`
  padding-right: 1rem;
`;

export const ContentInputFlex = styled(ContentInput)`
  flex: 1;
`;

export const LabelText = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 14px;
`;

export const SubTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

export const Image = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  margin-top: 0.5rem;
`;

export const ContentTwoColumns = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Column = styled.div`
  flex: 1;
`;

export const ColumnLeft = styled(Column)`
  padding-right: 1rem;
`;

export const ContentBannerAndLabel = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContentButtonLoadImg = styled.div`
  margin-top: 0.5rem;

  input[type="file"] {
    display: none;
  }

  .labelImg {
    display: inline-block;
    padding: 6px 12px;
    background-color: #1890ff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 14px;

    &:hover {
      background-color: #40a9ff;
    }
  }
`;

export const MessageErrorInput = styled.span`
  color: #ff4d4f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`;

export const FullWidthSelect = styled(Select)`
  width: 100%;
` as typeof Select;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export const SkeletonColumn = styled.div`
  flex: 1;
  padding-right: 1rem;
`;

export const SkeletonColumnRight = styled.div`
  flex: 1;
`;

export const SkeletonActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export const FormTextExtra = styled.p`
  margin-top: 0.5rem;
  font-size: 12px;
  color: #8c8c8c;
`;


