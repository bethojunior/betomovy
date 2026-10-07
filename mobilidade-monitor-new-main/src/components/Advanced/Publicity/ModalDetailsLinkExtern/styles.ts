import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

export const ContainerRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ContentInput = styled.div`
  margin-bottom: 1rem;
`;

export const LabelText = styled.p``;

export const InputFile = styled.input`
  width: 100%;
  max-width: 150px;
  ::-webkit-file-upload-button {
    max-width: 150px;
    width: 100%;
    text-align: center;
    background-color: #1890ff;
    border: none;
    flex-direction: column;
    color: #fff;
    padding: 5px 10px 5px 10px;
    border-radius: 5px;
    flex-wrap: wrap;
  }
  flex-direction: column;
  flex-wrap: wrap;
  color: #fff;
`;

export const ImagePreview = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
`;

export const ContainerPreview = styled.div`
  flex-direction: column;
`;

export const ContainerPreviewImage = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const ContainerButtons = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
`;

export const CheckBoxContainer = styled.div`
  display: flex;
  margin-bottom: 3px;
`;

export const CheckBoxLabel = styled.p`
  margin-bottom: 0;
  margin: 0px 5px;
`;
