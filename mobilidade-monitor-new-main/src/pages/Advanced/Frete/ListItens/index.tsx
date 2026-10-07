import { Button, Image, Table } from "antd";
import { AxiosError } from "axios";
import swal from "sweetalert";
import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { TableProps } from "antd/lib";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

import { Container, ContentBtnActions, ContentTable } from "./styles";
import { ItensFreteProps } from "./types";
import { theme_colors } from "../../../../theme/theme";

import Preload from "../../../../components/Utils/Preload";

import { ModalEditItem } from "../../../../components/Frete/ListItens/ModalEditItem";

import { Constants } from "../../../../utils/constants";

export const ListItens = () => {
  const [listItens, setListItens] = useState<ItensFreteProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [visibleModalEdit, setVisibleModalEdit] = useState<boolean>(false);
  const [itemSelected, setItemSelected] = useState<ItensFreteProps | null>(
    null
  );

  const getItensFrete = async () => {
    try {
      setLoadingTable(true);
      const responseItensFrete = await api.get("item");

      if (responseItensFrete.status) {
        setListItens(responseItensFrete.data.response);
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
      setLoadingTable(false);
    }
  };

  const handleEditItem = (data: ItensFreteProps) => {
    if (data) {
      setItemSelected(data);
      setVisibleModalEdit(true);
    }
  };

  const handleDeleteItem = (id: number) => {
    swal({
      title: "Info",
      text: "Deseja apagar esse item?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`item/${id}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Sucesso",
                text: "Item deletado com sucesso",
                icon: "success",
              });
              getItensFrete();
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

  const columns: TableProps<ItensFreteProps>["columns"] = [
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      width: 200,
    },
    {
      title: "Imagem",
      key: "image",
      width: 200,
      render: (_, data) => {
        return (
          <Image
            src={data.picture ? data.picture : Constants.defaultImgNotFound}
            alt={`logo-${data.description}`}
            style={{
              width: 60,
            }}
          />
        );
      },
    },
    {
      title: "Data de Criação",
      key: "created_at",
      width: 150,
      render: (_, data) => {
        return <span>{new Date(data.created_at).toLocaleString()}</span>;
      },
    },
    {
      title: "Ações",
      key: "actions",
      align: "right",
      width: 100,
      render: (_, data) => {
        return (
          <ContentBtnActions>
            <Button
              title="Editar item"
              icon={<MdEdit style={{ color: theme_colors.primary_antd }} />}
              onClick={() => handleEditItem(data)}
            />
            <Button
              title="Excluir"
              icon={<FaTrash style={{ color: theme_colors.red_crismon }} />}
              onClick={() => handleDeleteItem(data.id)}
            />
          </ContentBtnActions>
        );
      },
    },
  ];

  useEffect(() => {
    getItensFrete();
  }, []);

  return (
    <Container>
      <Preload visible={loading} />
      <ContentTable>
        <Table
          dataSource={listItens}
          columns={columns}
          pagination={false}
          loading={loadingTable}
        />
      </ContentTable>

      <ModalEditItem
        itemSelected={itemSelected}
        setVisible={setVisibleModalEdit}
        visible={visibleModalEdit}
        getItensFrete={getItensFrete}
      />
    </Container>
  );
};
