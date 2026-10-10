import { Button, Table, Tag } from "antd";
import { FaTrash, FaEye, FaEdit } from "react-icons/fa";
import swal from "sweetalert";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import {
  Container,
  ContentHeaderButton,
  ContentTable,
  ContentBtnActions,
} from "./styles";
import api from "../../../../services/api";
import { TollItemsProps } from "./types";
import { TableProps } from "antd/lib";

import Mask from "../../../../services/Mask";
import Session from "../../../../utils/Session";

import { ModalAddToll } from "../../../../components/Advanced/Config/ManageToll/ModalAddToll";
import Preload from "../../../../components/Utils/Preload";
import { ModalViewToll } from "../../../../components/Advanced/Config/ManageToll/ModalViewToll";
import { ModalEditToll } from "../../../../components/Advanced/Config/ManageToll/ModalEditToll";

export const ManageToll = () => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [tolls, setTolls] = useState<TollItemsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [visibleModalAddToll, setVisibleModalAddToll] =
    useState<boolean>(false);
  const [visibleModalToll, setVisibleModalToll] = useState<boolean>(false);
  const [tollSelected, setTollSelected] = useState<TollItemsProps | null>(null);
  const [visibleModalEditToll, setVisibleModalEditToll] = useState<boolean>(false);

  const { setMaskMoneyNumber } = Mask;

  const cityId = Session.getLocal("citySelected")?.cityId;

  const getTolls = async () => {
    try {
      setLoadingTable(true);
      const responseTolls = await api.get(`toll${showAll ? "" : `/${cityId}`}`);

      if (responseTolls.status) {
        setTolls(responseTolls.data.response);
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

  const handleDeletePlace = (id: number) => {
    swal({
      title: "Info",
      text: "Deseja realmente deletar este item?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`toll/${id}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Sucesso",
                text: "Item deletado com sucesso",
                icon: "success",
              });
              getTolls();
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

  const handleViewToll = (data: TollItemsProps) => {
    setTollSelected(data);
    setVisibleModalToll(true);
  };

  const handleEditToll = (data: TollItemsProps) => {
    setTollSelected(data);
    setVisibleModalEditToll(true);
  };

  const columns: TableProps<TollItemsProps>["columns"] = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "Localização",
      dataIndex: "address",
      key: "address",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Valor",
      key: "value",
      width: 150,
      render: (_, data) => {
        return <span>{setMaskMoneyNumber(data.value)}</span>;
      },
    },
    {
      title: "Status",
      key: "status",
      width: 150,
      render: (_, data) => {
        const isActive = data.active ? true : false;

        return (
          <Tag color={isActive ? "green" : "error"}>
            {isActive ? "Ativo" : "Inativo"}
          </Tag>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      align: "right",
      width: 100,
      render: (_, data) => (
        <ContentBtnActions>
          <Button icon={<FaEye />} onClick={() => handleViewToll(data)} />
          <Button icon={<FaEdit />} onClick={() => handleEditToll(data)} />
          <Button
            icon={<FaTrash />}
            danger
            onClick={() => handleDeletePlace(data.id)}
          />
        </ContentBtnActions>
      ),
    },
  ];

  useEffect(() => {
    getTolls();
  }, [showAll]);

  return (
    <Container>
      <Preload visible={loading} />
      <ContentHeaderButton>
        <Button onClick={() => setShowAll(!showAll)}>
          {showAll ? "Listar Por cidade" : "Listar Todos"}
        </Button>
        <Button type="primary" onClick={() => setVisibleModalAddToll(true)}>
          Adicionar Pedágio
        </Button>
      </ContentHeaderButton>
      <ContentTable>
        <Table
          columns={columns}
          dataSource={tolls}
          pagination={false}
          loading={loadingTable}
        />
      </ContentTable>

      <ModalAddToll
        getTolls={getTolls}
        setVisible={setVisibleModalAddToll}
        visible={visibleModalAddToll}
      />

      <ModalViewToll
        setVisible={setVisibleModalToll}
        visible={visibleModalToll}
        tollSelected={tollSelected}
      />

      <ModalEditToll
        visible={visibleModalEditToll}
        setVisible={setVisibleModalEditToll}
        getTolls={getTolls}
        tollSelected={tollSelected}
      />
    </Container>
  );
};
