import styled from "styled-components";
import { Input, Select, Modal, Button } from "antd";

export const ModalOfEdition = styled(Modal)``;

export const InputEdit = styled(Input)`
  height: 40px;
  width: 98%;
  margin: 5px;
`;

export const InputPhone = styled(InputEdit)``;

export const FieldIcon = styled.span`
  display: flex;
  align-items: center;
  color: #000000;
`;

export const GenderSelect = styled(Select)`
  width: 98%;
  margin: 5px;

  .ant-select-selector {
    display: flex;
    align-items: center;
    height: 40px !important;
  }
`;
export const InputLabelOfEdition = styled.p`
  font-size: 16px;
  margin: 0px;
  margin-left: 5px;
`;

export const ErrorForm = styled.p`
  margin-left: 5px;
  color: red;
`;

export const ProfileImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const ProfileImageWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

export const ProfileImagePreview = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #f0f0f0;
`;

export const EditPhotoButton = styled(Button)`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 32px;
  height: 32px;
  min-width: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);

  &:hover,
  &:focus {
    color: #000000;
    background-color: #ffffff;
    border-color: #b0b0b0;
  }
`;
