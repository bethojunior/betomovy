import { Button, Divider, Input, Modal, Upload } from "antd";
import swal from "sweetalert";
import { AxiosError } from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";

import {
  Container,
  ContentInput,
  LabelInput,
  Row,
  MessageError,
  Footer,
} from "./styles";

import { ItensFreteProps } from "../../../../pages/Advanced/Frete/ListItens/types";
import api from "../../../../services/api";

import Utils from "../../../../utils/Utils";

const schemaForm = yup
  .object({
    description: yup.string().required("Este campo é obrigatório"),
    width: yup.number().required("Este campo é obrigatório"),
    height: yup.number().required("Este campo é obrigatório"),
    depth: yup.number().required("Este campo é obrigatório"),
    weight: yup.number().required("Este campo é obrigatório"),
  })
  .required();

type SchemaFormProps = yup.InferType<typeof schemaForm>;

interface ModalEditItemProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  itemSelected: ItensFreteProps | null;
  getItensFrete: () => void;
}

export const ModalEditItem = ({
  setVisible,
  visible,
  itemSelected,
  getItensFrete,
}: ModalEditItemProps) => {
  const { control, setValue, handleSubmit, resetField } =
    useForm<SchemaFormProps>({
      resolver: yupResolver(schemaForm),
    });

  const [fileList, setFileList] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { convertUrlToFile } = Utils;

  const handleCloseModal = () => {
    setVisible(false);
    resetField("depth");
    resetField("description");
    resetField("height");
    resetField("weight");
    resetField("width");
  };

  const handleEditItem = async (data: SchemaFormProps) => {
    if (fileList.length === 0) {
      swal({
        title: "Aviso",
        text: "Insira uma imagem para cadastrar o item",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("weight", String(data.weight));
      formData.append("height", String(data.height));
      formData.append("width", String(data.width));
      formData.append("depth", String(data.depth));
      formData.append("picture", fileList[0] as File);
      formData.append("description", data.description);

      const responseEditItem = await api.post(
        `item/${itemSelected?.id}`,
        formData
      );

      if (responseEditItem.status) {
        swal({
          title: "Sucesso",
          text: "Item atualizado com sucesso",
          icon: "success",
        });
        handleCloseModal();
        getItensFrete();
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

  useEffect(() => {
    if (itemSelected) {
      setValue("description", itemSelected.description);
      setValue("depth", itemSelected.depth);
      setValue("height", itemSelected.height);
      setValue("weight", itemSelected.weight);
      setValue("width", itemSelected.width);

      convertUrlToFile(itemSelected.picture).then((response) => {
        const file = [response];
        setFileList(file);
      });
    }
  }, [visible]);

  return (
    <Modal
      title="Editar Item"
      open={visible}
      onCancel={handleCloseModal}
      footer={[]}
    >
      <Container onSubmit={handleSubmit(handleEditItem)}>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput>Descrição</LabelInput>
              <Input onChange={onChange} value={value} />
              {error && <MessageError>{error.message}</MessageError>}
            </ContentInput>
          )}
        />

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

        <Row>
          <Controller
            control={control}
            name="height"
            render={({ field: { value }, fieldState: { error } }) => (
              <ContentInput>
                <LabelInput>Altura</LabelInput>
                <Input
                  type="number"
                  min={0}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (Number(value) < 0) {
                      setValue("height", 0);
                      return;
                    }

                    setValue("height", Number(value));
                  }}
                  value={value}
                  status={Boolean(error) ? "error" : ""}
                />
                {error && <MessageError>{error.message}</MessageError>}
              </ContentInput>
            )}
          />

          <Controller
            control={control}
            name="width"
            render={({ field: { value }, fieldState: { error } }) => (
              <ContentInput>
                <LabelInput>Largura</LabelInput>
                <Input
                  type="number"
                  min={0}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (Number(value) < 0) {
                      setValue("width", 0);
                      return;
                    }

                    setValue("width", Number(value));
                  }}
                  value={value}
                  status={Boolean(error) ? "error" : ""}
                />
                {error && <MessageError>{error.message}</MessageError>}
              </ContentInput>
            )}
          />

          <Controller
            control={control}
            name="depth"
            render={({ field: { value }, fieldState: { error } }) => (
              <ContentInput>
                <LabelInput>Profundidade</LabelInput>
                <Input
                  type="number"
                  min={0}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (Number(value) < 0) {
                      setValue("depth", 0);
                      return;
                    }

                    setValue("depth", Number(value));
                  }}
                  value={value}
                  status={Boolean(error) ? "error" : ""}
                />
                {error && <MessageError>{error.message}</MessageError>}
              </ContentInput>
            )}
          />

          <Controller
            control={control}
            name="weight"
            render={({ field: { value }, fieldState: { error } }) => (
              <ContentInput>
                <LabelInput>Peso</LabelInput>
                <Input
                  type="number"
                  min={0}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (Number(value) < 0) {
                      setValue("weight", 0);
                      return;
                    }

                    setValue("weight", Number(value));
                  }}
                  value={value}
                  status={Boolean(error) ? "error" : ""}
                />
                {error && <MessageError>{error.message}</MessageError>}
              </ContentInput>
            )}
          />
        </Row>

        <Footer>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button type="primary" loading={loading} htmlType="submit">
            Salvar
          </Button>
        </Footer>
      </Container>
    </Modal>
  );
};
