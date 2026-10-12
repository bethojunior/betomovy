import { Table, Button, Checkbox } from "antd";
import swal from "sweetalert";
import { AxiosError } from "axios";
import { TableProps } from "antd/lib";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

import { useEffect, useState } from "react";

import {
  Container,
  ContentButton,
  ContentButtonActions,
  ContentTable,
} from "./styles";
import api from "../../../../../services/api";
import { theme_colors } from "../../../../../theme/theme";

import { ModalAddEditDocumentsApp } from "../../../../../components/Advanced/Config/ConfigsRegister/DocumentsApp/ModalAddEditDocumentsApp";

export const DocumentsApp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [docs, setDocs] = useState<DocsProps[]>([]);
  const [docSelected, setDocSelected] = useState<DocsProps | undefined>(
    undefined
  );
  const [visibleModalAddEdit, setVisibleModalAddEdit] =
    useState<boolean>(false);

  const getDocuments = async () => {
    try {
      setLoading(true);
      const responseDocuments = await api.get("doc");

      if (responseDocuments.status) {
        setDocs(Array.isArray(responseDocuments.data?.response) ? responseDocuments.data.response : []);
      }
    } catch (error) {
      setDocs([]);
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data?.message || "Erro ao buscar documentos",
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDocument = (data: DocsProps) => {
    setDocSelected(data);
    setVisibleModalAddEdit(true);
  };

  const handleDeleteDocument = async (idDocument: number) => {
    swal({
      title: "Atenção",
      text: "Deseja realmente executar esta ação?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`doc/${idDocument}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Sucesso",
                text: "Documento deletado com sucesso",
                icon: "success",
              });
              getDocuments();
            }
          })
          .catch((error: AxiosError) => {
            swal({
              title: "Error",
              text: error.response?.data.message,
              icon: "error",
            });
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleAddDocument = () => {
    console.log("ADD DOCUMENTO");
    setVisibleModalAddEdit(true);
  };

  const columns: TableProps<DocsProps>["columns"] = [
    {
      title: "Nome",
      dataIndex: "label",
      key: "name",
      width: 200,
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "age",
      width: 200,
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      width: 200,
    },
    {
      title: "Foto",
      key: "photo",
      width: 100,
      render: (_, value) => (
        <Checkbox checked={value.image === 1 ? true : false} />
      ),
    },
    {
      title: "Texto",
      key: "text",
      width: 100,
      render: (_, value) => (
        <Checkbox checked={value.text === 1 ? true : false} />
      ),
    },
    {
      title: "PDF",
      key: "PDF",
      width: 100,
      render: (_, value) => (
        <Checkbox checked={value.pdf === 1 ? true : false} />
      ),
    },
    {
      title: "Ações",
      key: "actions",
      align: "right",
      width: 100,
      render: (_, value) => {
        return (
          <ContentButtonActions>
            <Button
              title="Editar serviço"
              icon={<MdEdit style={{ color: theme_colors.primary_antd }} />}
              onClick={() => handleEditDocument(value)}
            />
            <Button
              title="Deletar serviço"
              icon={<FaTrash style={{ color: theme_colors.red_crismon }} />}
              onClick={() => handleDeleteDocument(value.id)}
            />
          </ContentButtonActions>
        );
      },
    },
  ];

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <Container>
      <ContentButton>
        <Button type="primary" onClick={handleAddDocument}>
          Adicionar Documento
        </Button>
      </ContentButton>

      <ContentTable>
        <Table
          columns={columns}
          dataSource={Array.isArray(docs) ? docs : []}
          loading={loading}
          pagination={false}
        />
      </ContentTable>

      <ModalAddEditDocumentsApp
        dataDocuments={docSelected}
        setDataDocuments={setDocSelected}
        setVisibleModal={setVisibleModalAddEdit}
        visibleModal={visibleModalAddEdit}
        getDocuments={getDocuments}
      />
    </Container>
  );
};
