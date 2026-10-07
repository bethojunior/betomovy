import swal from "sweetalert";
import { AxiosError } from "axios";
import { Button, Input, Upload, Divider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import dimensionsProductImg from "../../../../assets/dimensions-product.png";

import {
  Container,
  ContentInput,
  LabelInput,
  Row,
  MessageError,
  ContentBtnSave,
} from "./styles";

import api from "../../../../services/api";

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

export const RegisterItem = () => {
  const { control, handleSubmit, resetField, setValue } =
    useForm<SchemaFormProps>({
      resolver: yupResolver(schemaForm),
    });

  const [loading, setLoading] = useState<boolean>(false);
  const [imageItem, setImageItem] = useState<File[]>([]);

  const handleSaveItem = async (data: SchemaFormProps) => {
    if (imageItem.length === 0) {
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
      formData.append("picture", imageItem[0] as File);
      formData.append("description", data.description);

      const responseSaveItem = await api.post("item", formData);

      if (responseSaveItem.status) {
        swal({
          title: "Sucesso",
          text: "Item salvo com sucesso",
          icon: "success",
        });

        resetField("depth");
        resetField("description");
        resetField("height");
        resetField("weight");
        resetField("width");
        setImageItem([]);
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
    <Container onSubmit={handleSubmit(handleSaveItem)}>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <ContentInput>
            <LabelInput>Descrição</LabelInput>
            <Input
              onChange={onChange}
              value={value}
              status={Boolean(error) ? "error" : ""}
            />
            {error && <MessageError>{error.message}</MessageError>}
          </ContentInput>
        )}
      />

      <ContentInput>
        <LabelInput>Escolha uma imagem</LabelInput>
        <Upload
          listType="picture"
          maxCount={1}
          fileList={imageItem as any}
          className="upload-list-inline"
          name="file"
          accept=".jpeg, .png"
          beforeUpload={(file) => {
            setImageItem([file]);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </ContentInput>

      <Divider />

      <h3>Cálculo de cubagem</h3>

      <img
        src={dimensionsProductImg}
        alt="dimensions-product"
      />

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

      <ContentBtnSave>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{
            width: "100%",
          }}
        >
          Salvar
        </Button>
      </ContentBtnSave>
    </Container>
  );
};
