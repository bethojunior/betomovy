import styled from "styled-components";
import { Skeleton, Card } from 'antd';

export const Container = styled.div`
  margin: 1rem 0;
`;

export const ContainerIframe = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const IframeContent = styled.iframe`
  margin: 0 auto;  
  width: 70%;
  height: 600px;
  border: none;
  `;

export const SkeletonContent = styled.div`
  margin: 0 auto;  
  width: 60%;
  height: 400px;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  `;

export const Wrapper = styled.div`
  background-color: #d1fae5;
  min-height: 600px;
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledCard = styled(Card)`
  width: 50%;
  padding: 8px;
  border-radius: 12px;
  text-align: center;
  
`;

export const QRImageSkeleton = styled(Skeleton.Image)`
  width: 100% !important;
  height: 80% !important;
  margin: 0 auto;
  border-radius: 4px;
`;


