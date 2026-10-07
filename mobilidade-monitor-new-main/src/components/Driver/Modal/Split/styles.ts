import styled from 'styled-components';
import { Button } from 'antd';

export const ContentWrapper = styled.div`
  padding: 10px;
  text-align: center;
`;

export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
`;

export const ModalText = styled.p`
  font-size: 18px;
  text-align: center;
  margin-bottom: 40px;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LargeButton = styled(Button)`
  font-size: 18px;
  display: flex; 
  padding: 20px;
  align-items: center; 
`;
