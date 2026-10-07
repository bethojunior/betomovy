import { Button, Image, Table } from 'antd';
import styled from 'styled-components';
import { Spin } from 'antd';

export const TableProduct = styled(Table)`
  justify-content: center;
  margin: 0;
`;
export const ButtonNewVoucher = styled(Button)`
  margin-top: 10px;
  margin-left: 20px;
  margin-bottom: 10px;
`;

export const ItemImage = styled(Image)`
  min-width: 100px;
  max-width: 100px;
  min-height: 100px;
  max-height: 100px;
`

export const DeleteButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;

   &:hover,
  &:focus {
    background-color: #ff7875 !important;
    border-color: #ff7875 !important;
    color: white !important;
  }

  &[disabled],
  &[aria-disabled="true"] {
    opacity: 1 !important;
    background-color: #ff4d4f !important;
    border-color: #ff4d4f !important;
    color: white !important;
    cursor: not-allowed !important;
  }

  .ant-btn-loading-icon {
    color: white !important;
  }
`;

export const TextEmpty = styled.p`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

export const Loader = styled(Spin)`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;
