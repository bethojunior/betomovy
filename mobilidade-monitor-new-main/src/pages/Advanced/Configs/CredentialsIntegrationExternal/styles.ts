import styled from "styled-components";
import { Button, Input, Select } from "antd";
import { Spin } from 'antd';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  padding: 16px;
`;

export const ContentInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  align-items: center;

      @media (max-width: 915px) {
      justify-content: center;
    }
`;

export const ContentForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

    @media (max-width: 915px) {
      justify-content: center;
    }
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 250px;
  
`;

export const ActionContainer = styled.div`
  display: flex;
  width: 100%;
  padding-top: 16px;
  gap: 8px;

      @media (max-width: 915px) {
      justify-content: center;
    }
`;

export const StyledButtonNewCredencial = styled(Button)`
  align-self: flex-start;
`;

export const LabelText = styled.label`
  font-weight: bold;
  margin-bottom: 4px;
`;

export const StyledButton = styled(Button)`
  width: 5rem;
`;

export const StyledInput = styled(Input)`
  margin-top: 4px;
  width: 100%;
`;

export const StyledSelect = styled(Select)`
  width: 100%;
`;

export const DeleteButton = styled(Button)`
  background-color: red;
  width: 5rem;
  color: white;
  border: none;

  &:hover {
    background-color: darkred;
  }
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;