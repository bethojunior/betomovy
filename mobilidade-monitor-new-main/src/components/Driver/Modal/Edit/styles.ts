import styled from "styled-components";
import { Input, Select } from "antd";

export const ContentModalEdit = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 60vh;
  overflow-y: auto; 
  padding-right: 10px;
  padding-left: 10px;

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

export const ModalEditSection = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

export const ModalEditSectionImage = styled.div`
  display: flex;
  justify-content: top;
  flex-direction: column;
  align-items: center;
  margin-right: 50px;
`;

type StatusDriverProps = {
  status: string | undefined;
};

type TypeColorsStatus = {
  [key: string]: string;
};

const colorsStatus: TypeColorsStatus = {
  ATIVO: "green",
  PENDENTE: "#ffd456",
  BLOQUEADO: "#ff2020",
  "AGUARDANDO RESPOSTA": "#ffd456",
  BLACKLIST: "black",
};

export const ModalEditStatusDriver = styled.p<StatusDriverProps>`
  background-color: ${({ status }) => colorsStatus[status || ""]};
  border-radius: 5px;
  text-align: center;
  width: 60%;
  padding: 1px;
  color: ${({ status }) => (status === "ATIVO" ? "white" : "black")};
  margin-bottom: 10px;
`;

export const ModalEditSectionInformation = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
`;

export const ModalEditSectionAddress = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 2px;
`;

export const SectionInformation = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
  @media (max-width: 800px) {
    flex-direction: column;
    width: 100%;
  }
  & > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-right: 20px;
  }
  & > div:last-child {
    margin-right: 0;
  }
`;

export const ModalEditLabel = styled.p`
  margin-bottom: 0px;
  margin-top: 2px;
`;

export const InputPhone = styled(Input)``;

export const SelectModalEdit = styled(Select)`
  width: 100%;
  @media (max-width: 800px) {
    width: 100%;
  }
`;
