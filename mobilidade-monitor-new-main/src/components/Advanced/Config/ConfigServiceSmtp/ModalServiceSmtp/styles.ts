import { Modal } from 'antd';
import styled from 'styled-components';

export const StyledModal = styled(Modal)`
  &.ant-modal {
    width: 80% !important;
    max-width: 500px; 
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto !important;
  }
`;
