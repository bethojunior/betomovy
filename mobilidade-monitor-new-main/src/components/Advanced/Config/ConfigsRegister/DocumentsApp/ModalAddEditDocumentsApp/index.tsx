import { Modal, Input, Button, Divider, Checkbox } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import swal from "sweetalert";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { Container, ContentInput, Label, Footer, MessageError } from "./styles";
import api from "../../../../../../services/api";

import { DocumentsSelectedProps } from "./types";

interface ModallAddEditDocumentsAppProps {
  visibleModal: boolean;
  setVisibleModal: (data: boolean) => void;
  dataDocuments: DocsProps | undefined;
  setDataDocuments: (data: DocsProps | undefined) => void;
  getDocuments: () => void;
}

const schemaForm = yup
  .object({
    name: yup.string().required("Campo obrigatório"),
    link: yup.string(),
    description: yup.string(),
    documents: yup
      .array()
      .of(
        yup
          .object()
          .shape({
            name: yup.string().required("Campo obrigatório"),
            checked: yup.boolean().required("Campo obrigatório"),
            label: yup.string().required("Campo obrigatório"),
          })
          .required("Campo obrigatório")
      )
      .required("Campo obrigatório"),
  })
  .required();

type TypeSchemaForm = yup.InferType<typeof schemaForm>;

export const ModalAddEditDocumentsApp = ({
  setVisibleModal,
  visibleModal,
  dataDocuments,
  setDataDocuments,
  getDocuments,
}: ModallAddEditDocumentsAppProps) => {
  const { control, handleSubmit, resetField, setValue } =
    useForm<TypeSchemaForm>({
      resolver: yupResolver(schemaForm),
    });

  const [loading, setLoading] = useState<boolean>(false);
  const [documentsSelected, setDocumentsSelected] = useState<
    DocumentsSelectedProps[]
  >([
    {
      name: "image",
      checked: false,
      label: "Foto",
    },
    {
      name: "text",
      checked: false,
      label: "Texto",
    },
    {
      name: "pdf",
      checked: false,
      label: "PDF",
    },
  ]);

  const handleCloseModal = () => {
    setVisibleModal(false);
    setDataDocuments(undefined);
    resetField("description");
    resetField("documents");
    resetField("link");
    resetField("name");
    setDocumentsSelected([
      {
        name: "image",
        checked: false,
        label: "Foto",
      },
      {
        name: "text",
        checked: false,
        label: "Texto",
      },
      {
        name: "pdf",
        checked: false,
        label: "PDF",
      },
    ]);
  };

  const onChangeDocuments = (checked: boolean, name: string) => {
    if (checked) {
      const documents = documentsSelected.map((value) => {
        if (value.name === name) {
          return { ...value, checked: true };
        }

        return value;
      });
      setDocumentsSelected(documents);
      setValue("documents", documents);
    } else {
      const documents = documentsSelected.map((value) => {
        if (value.name === name) {
          return { ...value, checked: false };
        }

        return value;
      });

      setDocumentsSelected(documents);
      setValue("documents", documents);
    }
  };

  const handleAddDocument = async (data: TypeSchemaForm) => {
    try {
      setLoading(true);
      const responseAddDocument = await api.post("doc", {
        image: data.documents?.find((data) => data.name === "image")?.checked,
        label: data.name,
        pdf: data.documents?.find((data) => data.name === "pdf")?.checked,
        text: data.documents?.find((data) => data.name === "text")?.checked,
        description: data.description,
        link: data.link,
      });

      if (responseAddDocument.status) {
        swal({
          title: "Sucesso",
          text: "Documento adicionado com sucesso",
          icon: "success",
        });
        handleCloseModal();
        getDocuments();
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

  const handleEditDocument = async (data: TypeSchemaForm) => {
    try {
      setLoading(true);
      const responseAddDocument = await api.put(`doc/${dataDocuments?.id}`, {
        image: data.documents?.find((data) => data.name === "image")?.checked,
        label: data.name,
        pdf: data.documents?.find((data) => data.name === "pdf")?.checked,
        text: data.documents?.find((data) => data.name === "text")?.checked,
        description: data.description,
        link: data.link,
      });

      if (responseAddDocument.status) {
        swal({
          title: "Sucesso",
          text: "Documento editado com sucesso",
          icon: "success",
        });
        handleCloseModal();
        getDocuments();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.response[0],
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dataDocuments) {
      setValue("name", dataDocuments?.label);
      setValue(
        "description",
        dataDocuments?.description ? dataDocuments?.description : undefined
      );
      setValue("link", dataDocuments?.link ? dataDocuments.link : undefined);

      const documentsFormated = documentsSelected.map((value) => {
        if (value.name === "image") {
          return {
            ...value,
            checked: dataDocuments.image === 1 ? true : false,
          };
        }

        if (value.name === "pdf") {
          return {
            ...value,
            checked: dataDocuments.pdf === 1 ? true : false,
          };
        }

        if (value.name === "text") {
          return {
            ...value,
            checked: dataDocuments.text === 1 ? true : false,
          };
        }
      });

      setDocumentsSelected(documentsFormated as DocumentsSelectedProps[]);
      setValue("documents", documentsFormated as DocumentsSelectedProps[]);
    }
  }, [visibleModal]);

  return (
    <Modal
      open={visibleModal}
      title={dataDocuments ? "Editar Documento" : "Adicionar Documento"}
      onCancel={handleCloseModal}
      footer={[]}
    >
      <Container
        onSubmit={handleSubmit(
          dataDocuments ? handleEditDocument : handleAddDocument
        )}
      >
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ContentInput>
              <Label htmlFor="name">Nome</Label>
              <Input
                name="name"
                id="name"
                onChange={onChange}
                value={value}
                status={Boolean(error) ? "error" : ""}
              />
              {error && <MessageError>{error.message}</MessageError>}
            </ContentInput>
          )}
        />

        <Controller
          control={control}
          name="link"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ContentInput>
              <Label htmlFor="link">Link</Label>
              <Input
                placeholder="https://example.com"
                name="link"
                id="link"
                onChange={onChange}
                value={value}
                type="url"
                status={Boolean(error) ? "error" : ""}
              />
              {error && <MessageError>{error.message}</MessageError>}
            </ContentInput>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ContentInput>
              <Label htmlFor="description">Descrição</Label>
              <Input.TextArea
                name="description"
                id="description"
                rows={5}
                onChange={onChange}
                value={value}
                status={Boolean(error) ? "error" : ""}
              />
              {error && <MessageError>{error.message}</MessageError>}
            </ContentInput>
          )}
        />

        <Divider />

        <Controller
          control={control}
          name="documents"
          render={({ fieldState: { error } }) => (
            <ContentInput>
              <Label>Solicitar Documento</Label>

              {documentsSelected.map((value) => {
                return (
                  <Checkbox
                    key={value.name}
                    checked={value.checked}
                    onChange={(event) =>
                      onChangeDocuments(event.target.checked, value.name)
                    }
                  >
                    {value.label}
                  </Checkbox>
                );
              })}

              {error && <MessageError>{error.message}</MessageError>}
            </ContentInput>
          )}
        />

        <Footer>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button type="primary" loading={loading} htmlType="submit">
            {dataDocuments ? "Editar" : "Adicionar"}
          </Button>
        </Footer>
      </Container>
    </Modal>
  );
};
