import { Container, ContentTable, ContentButton } from "./styles";

import { Table, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { FaTrash } from "react-icons/fa";
import swal from "sweetalert";

import { useState, useEffect, useContext } from "react";

import api from "../../../../services/api";

import { WebmapKeysProps } from "./types";

import Preload from "../../../../components/Utils/Preload";
import { ModalAddKey } from "../../../../components/Advanced/Maps/WebMapKeyManagment/ModalAddKey";

import AuthContext from "../../../../contexts/auth";
import { MAPA } from "../../../../constants/permissions";

export const WebmapKeyManagment = () => {
  const [webmapKeys, setWebmapKeys] = useState<WebmapKeysProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { hasPermission } = useContext(AuthContext);

  const getWebmapKeys = async () => {
    setLoadingTable(true);
    try {
      const responseWebmapKeys = await api.get("webMapKey");

      if (responseWebmapKeys.status) {
        setWebmapKeys(responseWebmapKeys.data.response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleRemoveKeys = (id: number) => {
    swal({
      title: "Deseja remover essa chave?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoadingTable(true);
        api
          .delete(`webMapKey/${id}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Chave deletada com sucesso",
                icon: "success",
              });
              getWebmapKeys();
            }
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Erro ao deletar chave",
              icon: "error",
            });
          })
          .finally(() => {
            setLoadingTable(false);
          });
      }
    });
  };

  const columns: ColumnsType<WebmapKeysProps> = [
    {
      title: "Chave",
      dataIndex: "key",
      key: "key",
      width: 200,
    },
    {
      title: "Data de Cadastro",
      key: "date-register",
      width: 200,
      ellipsis: true,
      render: (_, data) => {
        return new Date(data.created_at).toLocaleDateString();
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      align: "right",
      render: (_, data) => {
        return (
          <>
            {hasPermission(MAPA, "deletar_gerenciar_chaves_web") && (
              <Button
                style={{
                  color: "#DC143C",
                }}
                onClick={() => handleRemoveKeys(data.id)}
                icon={<FaTrash />}
              />
            )}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getWebmapKeys();
  }, []);

  return (
    <Container>
      <Preload visible={loading} />
      {hasPermission(MAPA, "adicionar_gerenciar_chaves_web") && (
        <ContentButton>
          <Button type="primary" onClick={() => setOpenModal(true)}>
            Adicionar Chave
          </Button>
        </ContentButton>
      )}
      <ContentTable>
        <Table dataSource={webmapKeys} columns={columns} loading={loadingTable}/>
      </ContentTable>

      <ModalAddKey
        getKeyMaps={getWebmapKeys}
        visible={openModal}
        setVisible={setOpenModal}
        setLoading={setLoading}
      />
    </Container>
  );
};
