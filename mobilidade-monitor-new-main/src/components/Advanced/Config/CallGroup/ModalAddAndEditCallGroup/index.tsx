import {
  Button,
  Image,
  Input,
  Modal,
  Tooltip,
  Upload,
  UploadProps,
} from "antd";
import { IModalAddAndEditCallGroupProps, SchemaFormCallGroup } from "./types";
import {
  Container,
  ContentInput,
  ContentUploaderImage,
  Footer,
  Form,
  LabelInput,
  MessageError,
  Row,
} from "./styles";
import { Controller, useForm } from "react-hook-form";
import { UploadOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { UploadFile } from "antd/lib";
import { schemaFormCallGroup } from "./schema";
import api from "../../../../../services/api";
import { FaRegQuestionCircle } from "react-icons/fa";
import { AxiosError } from "axios";

export const ModalAddAndEditCallGroup = ({
  visible,
  setVisible,
  callGroupSelected,
  setCallGroupSelected,
  getCallGroups,
}: IModalAddAndEditCallGroupProps) => {
  const { control, handleSubmit, reset, setValue } =
    useForm<SchemaFormCallGroup>({
      resolver: yupResolver(schemaFormCallGroup),
      defaultValues: {
        weight: 0,
      },
    });

  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [changeLogo, setChangeLogo] = useState<boolean>(false);

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setValue("image", newFileList[0]?.originFileObj as any);
    return false;
  };

  const handleChangeLogo = () => {
    setChangeLogo(true);
    setFileList([]);
  };

  const handleCloseModal = () => {
    setCallGroupSelected(null);
    setChangeLogo(true);
    setVisible(false);
    setFileList([]);
    reset();
  };

  const handleSaveConfigAppPartner = async (data: SchemaFormCallGroup) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", data?.name);
      formData.append("image", data?.image as File);
      formData.append("weight", String(data?.weight));

      const responseSaveCallGroup = await api.post("callGroup", formData);

      if (responseSaveCallGroup?.status) {
        swal({
          title: "Sucesso",
          icon: "success",
          text: "Grupo de chamado salvo com sucesso.",
        });
        getCallGroups();
        handleCloseModal();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Erro",
        icon: "error",
        text: responseError.response?.data.response[0],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditConfigAppPartner = async (data: SchemaFormCallGroup) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", data?.name);
      formData.append("weight", String(data?.weight));

      if (data?.image) {
        formData.append("image", data?.image as File);
      }

      const responseEditCallGroup = await api.post(
        `callGroup/${callGroupSelected?.id}`,
        formData
      );

      if (responseEditCallGroup?.status) {
        swal({
          title: "Sucesso",
          icon: "success",
          text: "Grupo de chamado atualizado com sucesso.",
        });
        getCallGroups();
        handleCloseModal();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Erro",
        icon: "error",
        text: responseError.response?.data.response[0],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (callGroupSelected) {
      setValue("name", callGroupSelected?.name);
      setValue("weight", Number(callGroupSelected.weight));
      setChangeLogo(false);
      setValue("requiredImage", false);
    } else {
      setChangeLogo(true);
      setValue("requiredImage", true);
      setFileList([]);
    }
  }, [callGroupSelected]);

  return (
    <Modal
      open={visible}
      onCancel={handleCloseModal}
      title={
        callGroupSelected
          ? "Editar Grupo de Chamado"
          : "Adicionar Grupo de Chamado "
      }
      footer={[]}
    >
      <Container>
        <Form
          onSubmit={
            callGroupSelected
              ? handleSubmit(handleEditConfigAppPartner)
              : handleSubmit(handleSaveConfigAppPartner)
          }
        >
          <ContentInput>
            <Controller
              control={control}
              name="name"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <ContentInput>
                  <LabelInput>Nome</LabelInput>
                  <Input
                    type="text"
                    onChange={onChange}
                    value={value}
                    status={error ? "error" : ""}
                  />

                  {Boolean(error) && (
                    <MessageError>{error?.message}</MessageError>
                  )}
                </ContentInput>
              )}
            />
          </ContentInput>

          <ContentInput>
            <Controller
              control={control}
              name="weight"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <ContentInput>
                  <Row>
                    <LabelInput>Peso</LabelInput>

                    <Tooltip
                      title="O peso é utilizado para definir o nível de prioridade: quanto menor o valor do peso, maior é a prioridade atribuída."
                      placement={"top"}
                    >
                      <FaRegQuestionCircle />
                    </Tooltip>
                  </Row>
                  <Input
                    type="number"
                    onChange={(event) =>
                      onChange(Number(event?.target?.value ?? 0))
                    }
                    value={value}
                    status={error ? "error" : ""}
                  />

                  {Boolean(error) && (
                    <MessageError>{error?.message}</MessageError>
                  )}
                </ContentInput>
              )}
            />
          </ContentInput>

          {!changeLogo && (
            <ContentUploaderImage>
              <Image
                src={callGroupSelected?.image}
                width={100}
                alt={`imagem-grupo-chamado-${callGroupSelected?.image}`}
              />

              <Button
                style={{
                  width: "100%",
                }}
                onClick={handleChangeLogo}
              >
                Alterar Logo
              </Button>
            </ContentUploaderImage>
          )}

          {changeLogo ? (
            <Controller
              control={control}
              name="image"
              render={({ fieldState: { error } }) => (
                <ContentUploaderImage>
                  <Upload
                    style={{
                      width: "100%",
                    }}
                    listType="picture"
                    maxCount={1}
                    className="upload-list-inline"
                    name="file"
                    accept=".jpeg, .png"
                    onChange={handleChange}
                    fileList={fileList as []}
                    multiple={false}
                    beforeUpload={() => {
                      return false;
                    }}
                  >
                    <Button
                      style={{
                        width: "100%",
                      }}
                      icon={<UploadOutlined />}
                    >
                      Escolha a Imagem
                    </Button>
                  </Upload>

                  {Boolean(error) && (
                    <MessageError>{error?.message}</MessageError>
                  )}
                </ContentUploaderImage>
              )}
            />
          ) : null}

          <Footer>
            <Button onClick={handleCloseModal}>Cancelar</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {callGroupSelected ? "Editar" : "Adicionar"}
            </Button>
          </Footer>
        </Form>
      </Container>
    </Modal>
  );
};
