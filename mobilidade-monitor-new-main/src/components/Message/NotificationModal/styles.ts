import styled from "styled-components";
import { Button, Form, Upload } from "antd";

export const ModalContentSplit = styled.div`
  display: flex;
  gap: 28px;
  width: 100%;

  @media (max-width: 820px) {
    flex-direction: column;
  }
`;

export const FormSide = styled.div`
  flex: 1.2;
  min-width: 0;
`;

export const PreviewSide = styled.div`
  flex: 0.8;
  min-width: 280px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;

  @media (max-width: 820px) {
    max-width: 100%;
    margin-top: 16px;
  }
`;

export const PreviewHeader = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const PhoneMockup = styled.div`
  width: 100%;
  max-width: 290px;
  background: #0f172a;
  border-radius: 28px;
  padding: 12px;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PhoneNotch = styled.div`
  width: 80px;
  height: 5px;
  background: #334155;
  border-radius: 4px;
  margin: 2px auto 6px auto;
`;

export const PushNotificationCard = styled.div`
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
`;

export const PushHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .app-brand {
    display: flex;
    align-items: center;
    gap: 6px;

    .app-icon {
      width: 20px;
      height: 20px;
      border-radius: 6px;
      background: #0284c7;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
    }

    .app-name {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.2px;
    }
  }

  .time-stamp {
    font-size: 11px;
    color: #64748b;
  }
`;

export const PushBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  .push-title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.3;
    word-break: break-word;
  }

  .push-text {
    font-size: 12px;
    color: #334155;
    line-height: 1.4;
    word-break: break-word;
  }
`;

export const PushImageBanner = styled.div`
  width: 100%;
  height: 110px;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 4px;
  background: #f1f5f9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const FormItem = styled(Form.Item)`
  margin-bottom: 16px;

  .ant-form-item-label > label {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
  }
`;

export const File = styled(Upload)`
  .ant-upload-select {
    border-radius: 10px !important;
  }
`;

export const FooterModal = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  margin-top: 8px;
`;

export const FooterModalButton = styled(Button)`
  height: 40px;
  border-radius: 8px;
  font-weight: 600;
  padding: 0 18px;
`;
