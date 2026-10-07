import { Card, Checkbox, Select, Divider, Button } from "antd";
import { AxiosError } from "axios";
import swal from "sweetalert";

import { Fragment, useEffect, useState } from "react";

import { Container, DescriptionDocs } from "./styles";
import api from "../../../../../services/api";
import { DocsUserTypesProps } from "./types";

export const AddDocumentsByCategory = () => {
  const [loadingSelect, setLoadingSelect] = useState<boolean>(false);
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);

  const [typesDrivers, setTypesDrivers] = useState<DriverUserTypesProps[]>([]);

  const [docsUserTypes, setDocsUserTypes] = useState<
    DocsUserTypesProps[] | null
  >(null);
  const [docs, setDocs] = useState<DocsProps[]>([]);

  const [idDocUserType, setIdDocUserType] = useState<number | null>(null);
  const [listDocumentsSelected, setListDocumentsSelected] = useState<
    DocsProps[]
  >([]);

  const getDocs = async () => {
    try {
      const responseDocs = await api.get("doc");

      if (responseDocs.status) {
        setDocs(responseDocs.data.response);
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

  const getTypesDrivers = async () => {
    try {
      setLoadingSelect(true);
      const responseTypesDrivers = await api.get("userType/drivers");

      const typesDriversFormated = responseTypesDrivers.data.response.map(
        (value: DriverUserTypesProps) => {
          return {
            value: value.idUserType,
            label: value.name,
          };
        }
      );
      setTypesDrivers(typesDriversFormated);
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoadingSelect(false);
    }
  };

  const handleGetDocsTypeDriver = async (id: number) => {
    try {
      setLoadingSelect(true);
      const responseDocsTypeDriver = await api.get(`doc/userType/${id}`);

      if (responseDocsTypeDriver.status) {
        setDocsUserTypes(responseDocsTypeDriver.data.response);
        setIdDocUserType(id);
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
      setLoadingSelect(false);
    }
  };

  const onChangeDocument = (value: DocsProps, isChecked: boolean) => {
    if (!isChecked) {
      setListDocumentsSelected(
        listDocumentsSelected?.filter(
          (data) => data.label !== value.label
        ) as any
      );
    } else {
      setListDocumentsSelected((data) => [...data, value]);
    }
  };

  const handleSaveDocuments = async () => {
    try {
      setLoadingBtn(true);

      const objectPayload = listDocumentsSelected.map((value) => {
        return {
          userTypeId: idDocUserType,
          docId: value.id,
        };
      });

      const responseSaveDocuments = await api.post(
        `doc/userType/${idDocUserType}`,
        objectPayload
      );

      if (responseSaveDocuments.status) {
        swal({
          title: "Sucesso",
          text: "Alterações feita com sucesso",
          icon: "success",
        });

        getTypesDrivers();
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
      setLoadingBtn(false);
    }
  };

  useEffect(() => {
    getTypesDrivers();
    getDocs();
  }, []);

  useEffect(() => {
    const docsActives = docsUserTypes?.map((value) => {
      return value.doc;
    });

    setListDocumentsSelected(docsActives as DocsProps[]);
  }, [docsUserTypes]);

  return (
    <Container>
      <Card title="Configurações de documentos por categoria" bordered>
        <Select
          style={{
            minWidth: 250,
          }}
          placeholder="Seleciona a categoria"
          loading={loadingSelect}
          options={typesDrivers}
          onChange={(value) => handleGetDocsTypeDriver(value)}
        />

        {docsUserTypes && (
          <Card
            title="Documentos"
            bordered
            style={{
              marginTop: "1rem",
            }}
          >
            {docs.map((value) => {
              const isChecked =
                listDocumentsSelected?.find(
                  (data) => data.label === value.label
                ) !== undefined;

              return (
                <Fragment key={value.id}>
                  <Checkbox
                    checked={isChecked}
                    onChange={(event) =>
                      onChangeDocument(value, event.target.checked)
                    }
                  >
                    {value.label}
                  </Checkbox>
                  <DescriptionDocs>{value.description}</DescriptionDocs>
                  <Divider />
                </Fragment>
              );
            })}

            <Button
              type="primary"
              onClick={handleSaveDocuments}
              loading={loadingBtn}
            >
              Salvar
            </Button>
          </Card>
        )}
      </Card>
    </Container>
  );
};
