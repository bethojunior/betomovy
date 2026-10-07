import { Alert, Card, Divider, Form } from "antd";
import styled from "styled-components";

export const MainCard = styled(Card)`
  width: 100%;
  .ant-card-head-title {
    text-align: center;
  }
`;

export const FormSectionDivider = styled(Divider)`
  margin: 12px 0 16px !important;
`;

export const Content = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0 8px 24px;

  @media (min-width: 768px) {
    padding: 0 16px 32px;
  }
`;

export const CenteredColumn = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
`;

export const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

export const AlertsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  width: 100%;
`;

export const FeatureHeadlineRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 0 12px 0;
  width: 100%;
`;

export const FeatureHeadline = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5715;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  max-width: 100%;
`;

export const SaveActionsFormItem = styled(Form.Item)`
  margin-bottom: 0;
  .ant-form-item-control-input-content {
    display: flex;
    justify-content: center;
  }
`;

export const BannerAlert = styled(Alert)`
  margin: 0;
  text-align: center;
  .ant-alert-message,
  .ant-alert-description {
    text-align: center;
  }
`;

export const LabelWithIcon = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  svg {
    color: #000;
  }
`;
