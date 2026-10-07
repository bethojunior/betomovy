import { Collapse, Input, Upload, Button, Divider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import swal from "sweetalert";
import { AxiosError } from "axios";
import { useState } from "react";

import { ContentInput, LabelInput, Container } from "./styles";
import api from "../../../../../services/api";

interface CollapseAddTypeItemProps {
  getTypesHelpers: () => void;
}

export const CollapseAddTypeItem = ({
  getTypesHelpers,
}: CollapseAddTypeItemProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [typeHelper, setTypeHelper] = useState<string>("");

  const handleSaveNewTypeItem = async () => {
    if (typeHelper.length === 0) {
      swal({
        title: "Aviso",
        text: "Tipo de ajudante é obrigatório",
        icon: "warning",
      });
      return;
    }

    if (fileList.length <= 0) {
      swal({
        title: "Aviso",
        text: "É preciso inserir uma imagem",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("picture", fileList[0]);
      formData.append("name", typeHelper);

      const responseSaveNewTypeItem = await api.post(
        "accessibility/help",
        formData
      );

      if (responseSaveNewTypeItem.status) {
        swal({
          title: "Sucesso",
          text: "Novo tipo de item criado com sucesso",
          icon: "success",
        });

        setTypeHelper("");
        setFileList([]);
        getTypesHelpers();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Collapse>
      <Collapse.Panel header="Adicionar um tipo de ajudante" key={1}>
        <Container>
          <ContentInput>
            <LabelInput>Tipo de ajudante</LabelInput>
            <Input
              onChange={(event) => setTypeHelper(event.target.value)}
              value={typeHelper}
            />
          </ContentInput>

          <ContentInput>
            <LabelInput>Escolha uma imagem</LabelInput>
            <Upload
              fileList={fileList as any}
              maxCount={1}
              className="upload-list-inline"
              name="file"
              accept=".jpeg, .png"
              beforeUpload={(file) => {
                const fileList = [file];
                setFileList(fileList);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </ContentInput>

          <Divider />

          <Button
            type="primary"
            onClick={handleSaveNewTypeItem}
            loading={loading}
            style={{
              width: "100%",
            }}
          >
            Salvar
          </Button>
        </Container>
      </Collapse.Panel>
    </Collapse>
  );
};
