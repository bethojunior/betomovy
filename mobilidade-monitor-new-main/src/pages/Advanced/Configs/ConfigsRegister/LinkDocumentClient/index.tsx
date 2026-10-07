import { Card, Button, Checkbox, Divider } from "antd";
import swal from "sweetalert";
import { AxiosError } from "axios";

import { Fragment, useEffect, useState } from "react";

import { Container, DescriptionDocument, Loader } from "./styles";
import api from "../../../../../services/api";

const TYPE_DOCUMENT_CUSTOMER = 5;

export const LinkDocumentClient = () => {
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [docsCustomer, setDocsCustomer] = useState<DocsProps[]>([]);
  const [docsTypeUser, setDocsTypeUser] = useState<DocsProps[]>([]);

  const getDocs = async () => {
    try {
      const responseDocs = await api.get("doc");
      setDocsCustomer(responseDocs.data.response);
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.error(error);
    }
  };

  const getDocsUserType = async () => {
    try {
      const responseDocsUserType = await api.get(
        `doc/userType/${TYPE_DOCUMENT_CUSTOMER}`
      );

      if (responseDocsUserType.status) {
        const docsUserTypeFormated = responseDocsUserType.data.response.map(
          (value: DocsUserTypeProps) => {
            return value.doc;
          }
        );
        setDocsTypeUser(docsUserTypeFormated);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.error(error);
    }
  };

  const handleAddDocuments = async () => {
    try {
      setLoadingButton(true);

      const objectPayload = docsTypeUser.map((value) => {
        return {
          userTypeId: TYPE_DOCUMENT_CUSTOMER,
          docId: value.id,
        };
      });

      const responseDocuments = await api.post(
        `doc/userType/${TYPE_DOCUMENT_CUSTOMER}`,
        objectPayload
      );

      if (responseDocuments.status) {
        swal({
          title: "Sucesso",
          text: "Documentos atualizados com sucesso",
          icon: "success",
        });
        getDocsUserType();
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
      setLoadingButton(false);
    }
  };

  const onChangeDocuments = (value: DocsProps, isChecked: boolean) => {
    if (!isChecked) {
      setDocsTypeUser(
        docsTypeUser.filter((data) => data.label !== value.label)
      );
    } else {
      setDocsTypeUser((data) => [...data, value]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([getDocs(), getDocsUserType()]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  if (loading) return <Loader spinning />;

  return (
    <Container>
      <Card title="Configurações de documentos dos clientes" bordered>
        <Card
          title="Documentos"
          bordered
          style={{
            margin: "1rem 0",
          }}
        >
          {docsCustomer.map((value) => {
            const isChecked =
              docsTypeUser.find((data) => data.label === value.label) !==
              undefined;

            return (
              <Fragment key={value.id}>
                <Checkbox
                  checked={isChecked}
                  onChange={(event) =>
                    onChangeDocuments(value, event.target.checked)
                  }
                >
                  {value.label}
                </Checkbox>
                <DescriptionDocument>{value.description}</DescriptionDocument>
                <Divider />
              </Fragment>
            );
          })}
        </Card>

        <Button
          type="primary"
          onClick={handleAddDocuments}
          loading={loadingButton}
        >
          Salvar
        </Button>
      </Card>
    </Container>
  );
};
