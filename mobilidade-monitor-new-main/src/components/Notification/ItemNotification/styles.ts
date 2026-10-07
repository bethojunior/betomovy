import { Button } from "antd";
import styled from "styled-components";

export const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  border-bottom: solid #d5d5d5;
  border-width: 1px;
  padding: 10px 0;
  gap: 10px;

  &:last-child {
    border: none !important;
  }

  > img {
    border-radius: 10px;
  }

  > div {
    margin-left: 0;
    min-width: 0;
  }

  > div > h3 {
    font-weight: bold;
    margin-bottom: 4px;
    word-break: break-word;
    font-size: 15px;
    line-height: 1.3;
  }

  > div p {
    word-break: break-word;
    overflow-wrap: anywhere;
    font-size: 13px;
    line-height: 1.35;
  }

  Button {
    align-self: flex-end;
    background-color: #001529;
    border: none;
    border-radius: 5px;
  }

  @media (max-width: 800px) {
    gap: 8px;
    padding: 8px 0;

    > div > h3 {
      font-size: 14px;
    }

    > div p {
      font-size: 12px;
    }
  }
`;

export const Image = styled.img`
  object-fit: cover;
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  background: #f6f6f6;
  @media (max-width: 600px) {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
  }
`;

export const ButtonIcon = styled(Button)`
  font-size: 20px;
  margin-bottom: 5px;
  @media (max-width: 600px) {
    font-size: 18px;
    margin-bottom: 2px;
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    min-height: 36px !important;
    padding: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Video = styled.video`
  width: min(15rem, 100%);
  max-width: 100%;
  height: auto;
  max-height: 14rem;
  display: flex;
  margin: 5px auto;
  object-fit: contain;
`;
