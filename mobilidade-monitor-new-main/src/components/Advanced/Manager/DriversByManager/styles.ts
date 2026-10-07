import styled from "styled-components";
import { Spin } from 'antd';


export const Container = styled.div`
  padding: 20px;
  background: #f5f5f5;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  th {
    background-color: #f2f2f2;
    text-align: left;
  }
`;

export const Message = styled.div`
  text-align: center;
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 4px;
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;