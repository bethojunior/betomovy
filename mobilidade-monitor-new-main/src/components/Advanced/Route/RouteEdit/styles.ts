import styled from "styled-components";
import { Form } from "antd";
import { AiOutlineEnvironment } from "react-icons/ai";

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  gap: 20px;
`;

export const LeftSection = styled.div`
  width: 45%;
`;

export const RightSection = styled.div`
  width: 45%;
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const FormItem = styled(Form.Item)`
  margin-bottom: 15px;
  flex: 1;
`;

export const LocationIcon = styled(AiOutlineEnvironment)`
  cursor: pointer;
`;

export const AcceptCustomerStopsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ObjectInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const EstimatedTimeContainer = styled.div`
  display: flex;
  align-items: center; 
  gap: 10px;
`;

export const Separator = styled.div`
  height: 1px;
  background: #d9d9d9;
  margin: 20px 0;
`;