import swal from "sweetalert";
import { FaTrash } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";

import { useEffect, useState } from "react";

import { Container, ContentTable, Loader } from "./styles";

import api from "../../../../services/api";

      
import { ModalDetailsLinkExtern } from "../../../../components/Advanced/Publicity/ModalDetailsLinkExtern";

import { MenuAppsProps, TypesModalities } from "./types";

let locale = {
  emptyText: "Sem dados",
};

export const LinkExtern = () => {
  const [datasMenuApp, setDatasMenuApp] = useState<MenuAppsProps[]>([]);
  const [datasSelected, setDatasSelected] = useState<MenuAppsProps>();
  const [typesModalities, setTypesModalities] = useState<TypesModalities[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const getMenuApp = async () => {
    setLoading(true);
    try {
      const responseMenuApp = await api.get("menuApp/getPro");
      if (responseMenuApp.status) {
        setDatasMenuApp(responseMenuApp.data.response);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os menus",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const getTypesModalities = async () => {
    setLoading(true);
    try {
      const responseTypesModalities = await api.get("menuApp/types");

      if (responseTypesModalities.status) {
        setTypesModalities(responseTypesModalities.data.response);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar tipos de modalidades",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handleEdit = (datas: MenuAppsProps) => {
    setDatasSelected(datas);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    swal({
      title: "Deseja confirmar a exclusão desse menu?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .put(`menuApp/${id}/disable`)
          .then((response) => {
            setLoading(false);
            if (response.status) {
              swal({
                title: "Apagado com sucesso!",
                icon: "success",
              });
              getMenuApp();
            }
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Erro ao deletar menu",
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  useEffect(() => {
    getMenuApp();
    getTypesModalities();
  }, []);

  const columns: ColumnsType<MenuAppsProps> = [
    {
      title: "Modalidade",
      key: "menuTypeApp",
      width: 150,
      render: (_, data) => <>{data.menu_app_type.name}</>,
    },
    {
      title: "Telefone",
      dataIndex: "phoneNotification",
      key: "phoneNotification",
      width: 150,
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      width: 200,
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      width: 250,
    },
    {
      title: "Ações",
      key: "actions",
      width: 130,
      ellipsis: true,
      render: (_, data) => {
        return (
          <div
            style={{
              display: "flex",
              gap: 10,
              flexDirection: "row",
            }}
          >
            <Button
              style={{
                color: "#1677ff",
              }}
              onClick={() => handleEdit(data)}
              icon={<BsPencilSquare />}
            />
            <Button
              style={{
                color: "#DC143C",
              }}
              onClick={() => handleDelete(data.id)}
              icon={<FaTrash />}
            />
          </div>
        );
      },
    },
  ];
  if (loading) return <Loader spinning />;

  return (
    <Container>
       
      <Button
        style={{ marginBottom: 10 }}
        type="primary"
        onClick={() => setModalVisible(true)}
      >
        Novo Menu Externo
      </Button>
      <ContentTable>
        <Table
          style={{
            width: "100%",
          }}
          columns={columns}
          dataSource={datasMenuApp}
          pagination={false}
          locale={locale}
        />
      </ContentTable>

      <ModalDetailsLinkExtern
        setLoading={setLoading}
        setDatas={setDatasSelected}
        datas={datasSelected}
        visible={modalVisible}
        setVisible={setModalVisible}
        getMenuApp={getMenuApp}
        typesModalities={typesModalities}
      />
    </Container>
  );
};
