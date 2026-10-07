import { Button, Table } from "antd";
import { FC, useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { MdModeEdit } from "react-icons/md";
import swal from "sweetalert";

import {
  Body,
  AddButtonContainer,
  ContainerNoData,
  ColumnActionsContainer,
  ColumnCheckbox,
  ActionButton,
  ContentTable,
} from "./styles";

import AppDocumentsModal from "../../../../components/Advanced/Config/AppDocumentsModal";
import Alert from "../../../../components/Utils/Alert";
      

import api from "../../../../services/api";

interface DocArray extends Array<DocData> {}

interface DocData {
  created_at: string;
  description: string;
  id: number;
  image: number;
  label: string;
  link: string;
  pdf: number;
  text: number;
  updated_at: string;
}

const AppDocuments: FC = () => {
       
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [documentsList, setDocumentsList] = useState<DocArray>();
  const [documentEditList, setDocumentEditList] = useState<DocData>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editOrCreat, setEditOrCreat] = useState(0);

  const docRequest = () => {
    setLoadingTable(true);
    api.get(`doc`).then((values) => {
      setLoadingTable(false);
      if (values.status === 200) {
        setDocumentsList(values.data.response);
      }
    });
  };

  useEffect(() => {
    docRequest();
  }, []);

  const deleteDoc = (id: number) => {
    swal({
      title: "Deseja remove o documento?",
      icon: "info",
      buttons: ["Cancelar", "Confirmar"],
    }).then((result) => {
      if (result) {
        setLoadingTable(true);
        api.delete(`doc/${id}`).then((values) => {
          setLoadingTable(false);
          if (values.status === 200) {
            docRequest();
            setTypeAlert("success");
            setMessageAlert("Documento exluído com sucesso!");
            return setShowAlert(true);
          }
          setTypeAlert("error");
          setMessageAlert("Erro ao tentar excluir esse socumento!");
          return setShowAlert(true);
        });
      }
    });
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "label",
      key: "label",
      columnWidth: "2",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Foto",
      key: "image",
      dataIndex: "image",
      width: 150,
      ellipsis: true,
      render: (item: DocData) => <ColumnCheckbox checked={!!item} disabled />,
    },
    {
      title: "Texto",
      key: "text",
      dataIndex: "text",
      width: 150,
      ellipsis: true,
      render: (item: DocData) => <ColumnCheckbox checked={!!item} disabled />,
    },
    {
      title: "PDF",
      key: "pdf",
      dataIndex: "pdf",
      width: 150,
      ellipsis: true,
      render: (item: DocData) => <ColumnCheckbox checked={!!item} disabled />,
    },
    {
      key: "actions",
      width: 100,
      ellipsis: true,
      render: (item: DocData) => (
        <ColumnActionsContainer>
          <ActionButton color="#1890ff">
            <MdModeEdit
              onClick={() => {
                setIsModalVisible(true);
                setDocumentEditList(item);
                setEditOrCreat(1);
              }}
            />
          </ActionButton>

          <ActionButton color="#DC143C" onClick={() => deleteDoc(item.id)}>
            <AiFillDelete />
          </ActionButton>
        </ColumnActionsContainer>
      ),
    },
  ];

  return (
    <Body>
       
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <AppDocumentsModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        documentEditList={documentEditList}
        docRequest={docRequest}
        editOrCreat={editOrCreat}
      />
      <AddButtonContainer>
        <Button
          onClick={() => {
            setIsModalVisible(true);
            setEditOrCreat(0);
          }}
          type="primary"
        >
          Adicionar Documento
        </Button>
      </AddButtonContainer>
      {documentsList?.length === 0 ? (
        <ContainerNoData>
          <p>Ainda não há documentos cadastrados</p>
        </ContainerNoData>
      ) : (
        <ContentTable>
          <Table
            rowKey="id"
            dataSource={documentsList}
            columns={columns}
            pagination={false}
            loading={loadingTable}            
          />
        </ContentTable>
      )}
    </Body>
  );
};

export default AppDocuments;
