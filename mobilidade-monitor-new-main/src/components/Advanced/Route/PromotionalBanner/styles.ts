import styled from "styled-components";
import { Button } from "antd";

export const Container = styled.div`
  padding: 20px;
`;

export const BannerList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;

export const UploadText = styled.p`
  font-size: 16px;
  margin-bottom: 10px;
`;

export const BannerItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: #fafafa;
  padding: 10px;
  position: relative;
`;

export const BannerImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  margin-bottom: 10px;
  cursor: pointer;
`;

export const DeleteButton = styled(Button)`
  position: absolute;
  bottom: 10px;
  width: 80%;
  background-color: #ff4d4f;
  color: white;
  border: none;
  &:hover {
    background-color: #ff7875 !important;
    color: white !important;
  }
`;

export const NoBannersMessage = styled.p`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #555;
  margin-top: 20px;
`;
