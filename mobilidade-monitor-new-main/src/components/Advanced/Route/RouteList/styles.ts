import styled from 'styled-components';
import { Button } from 'antd';
import { Spin } from 'antd';

export const Container = styled.div`
  padding: 20px;
`;

export const ContentTable = styled.div`
  margin-top: 20px;
  .table-responsive {
    overflow-x: auto;
  }
`;

export const ContentBtnActions = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const ContentPagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const CorporateUserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CorporateUserItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: #fafafa;
`;

export const CorporateUserName = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

export const AddUserButton = styled(Button)`
  background-color: #1890ff;
  color: white;
  margin-top: 5px;
  border: none;
  &:hover {
    background-color: #40a9ff !important;
    color: white !important;
  }
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;