import { Button } from "antd";
import styled from "styled-components";

export const DeleteButton = styled.div`
  color: red;
  cursor: pointer;
  margin-bottom: 0;
  font-size: 20px;
`;

export const NotificationButton = styled(Button)`
  margin-bottom: 15px;
`;

export const EmptryNotification = styled.p`
  display: flex;
  justify-content: center;
`;

export const ContentTable = styled.div`
  overflow: auto;

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }

  td {
    background-color: #ffffff;
  }
`;
