import {
  Container,
  ContentButtonNewTrigger,
  ContentTable,
  Content,
} from "./styles";
import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaEdit, FaTrash } from "react-icons/fa";
import swal from "sweetalert";

import { useState, useEffect } from "react";

import Preload from "../../../../../components/Utils/Preload";
import { ModalAddTariffFlag } from "../../../../../components/Advanced/Tariffs/ModalAddTariffFlag";

import Session from "../../../../../utils/Session";
import api from "../../../../../services/api";

import { TariffsFlagsProps, TripTypesProps } from "./types";
import { ModalEditTariffFlag } from "../../../../../components/Advanced/Tariffs/ModalEditTarrifFlag";

export const TariffFlag = () => {
  const [tariffsFlags, setTariffsFlags] = useState<TariffsFlagsProps[]>([]);
  const [tripTypes, setTripTypes] = useState<TripTypesProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleEditModal, setVisibleEditModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<TariffsFlagsProps | null>(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  

  const cityId = Session.getLocal("citySelected")?.cityId;

  const getTariffFlag = async () => {
    setLoadingTable(true);
    try {
      const responseTariffFlag = await api.get(
        `price/dynamic?cityId=${cityId}`
      );
      if (responseTariffFlag.status) {
        setTariffsFlags(responseTariffFlag.data.response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const getTypeTrips = async () => {
    setLoadingTable(true);
    try {
      const responseTypeTrips = await api.get(`city/${cityId}/tripTypes`);
      if (responseTypeTrips.status) {
        setTripTypes(responseTypeTrips.data.response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleDeleteTariffFlag = (id: number) => {
    swal({
      title: "Tem certeza que deseja deletar o gatilho",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`price/dynamic/${id}`)
          .then((response) => {
            setLoading(false);
            if (response.status) {
              swal({
                title: "Gatilho deletado com sucesso",
                icon: "success",
              });
              getTariffFlag();
            }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleUpdateStatusDisable = async (id: number) => {
    setLoading(true);
    try {
      const responseDisabledStatus = await api.put(
        `price/dynamic/${id}/disable`
      );
      if (responseDisabledStatus.status) {
        swal({
          title: "Status atualizado com sucesso!",
          icon: "success",
        });
        getTariffFlag();
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleUpdateStatusEnable = async (id: number) => {
    setLoading(true);
    try {
      const responseEnableStatus = await api.put(`price/dynamic/${id}/enable`);
      if (responseEnableStatus.status) {
        swal({
          title: "Status atualizado com sucesso!",
          icon: "success",
        });
        getTariffFlag();
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Error ao atualizar status",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handleEdit = (item: TariffsFlagsProps) => {
    setEditingItem(item);
    setVisibleEditModal(true);
  };

  const handleDeleteMultiple = async () => {
  if (selectedRowKeys.length === 0) {
    swal({
      title: "Nenhuma bandeira selecionada!",
      icon: "warning",
    });
    return;
  }

  swal({
    title: `Tem certeza que deseja excluir ${selectedRowKeys.length} bandeira(s)?`,
    icon: "warning",
    buttons: ["Cancelar", "Sim"],
    dangerMode: true,
  }).then(async (willDelete) => {
    if (willDelete) {
      setLoading(true);
      try {
        await Promise.all(
          selectedRowKeys.map((id) =>
            api.delete(`price/dynamic/${id}`)
          )
        );
        swal({
          title: "Bandeiras excluídas com sucesso!",
          icon: "success",
        });
        getTariffFlag();
        setSelectedRowKeys([]); 
      } catch (error) {
        swal({
          title: "Erro ao excluir bandeiras",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  });
};

  const rowSelection = {
  selectedRowKeys,
  onChange: (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys);
  },
  getCheckboxProps: (record: TariffsFlagsProps) => ({
    disabled: false,
    name: record.idPriceDynamic.toString(),
  }),
};


  useEffect(() => {
    getTariffFlag();
    getTypeTrips();
  }, []);

  const columns: ColumnsType<TariffsFlagsProps> = [
    {
      title: "Tempo de atuação",
      width: 150,
      ellipsis: true,
      key: "time_action",
      render: (_, datas) => {
        return (
          <span>
            {datas.timeStart} à {datas.timeEnd}
          </span>
        );
      },
    },
    {
      title: "Período",
      key: "period",
      width: 150,
      ellipsis: true,
      render: (_, datas) => {
        return <span>{datas.week_day.description.toLocaleUpperCase() || 'ERROR'}</span>;
      },
    },
    {
      title: "Tipo",
      key: "type",
      width: 150,
      ellipsis: true,
      render: (_, datas) => {
        return <span>{datas.trip_type?.type}</span>;
      },
    },
    {
      title: "Dinâmica",
      key: "multiplierValue",
      width: 150,
      ellipsis: true,
      render: (_, datas) => {
        return (
          <span>
            {datas.multiplierValue.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: 150,
      ellipsis: true,
      render: (_, datas) => {
        return (
          <Button
            type={datas.active === 1 ? "primary" : "default"}
            onClick={() =>
              datas.active === 1
                ? handleUpdateStatusDisable(datas.idPriceDynamic)
                : handleUpdateStatusEnable(datas.idPriceDynamic)
            }
          >
            {datas.active === 1 ? "Ativado" : "Desativado"}
          </Button>
        );
      },
    },
    {
      title: "Editar",
      key: "edit",
      width: 100,
      ellipsis: true,
      align: "right",
      render: (_, record) => {
        return (
          <Button
            style={{
              color: "black",
            }}
            onClick={() => handleEdit(record)}
            icon={<FaEdit />}
          />
        );
      },
    },
    {
      title: "Excluir",
      key: "delete",
      width: 100,
      ellipsis: true,
      align: "right",
      render: (_, datas) => {
        return (
          <Button
            style={{
              color: "#DC143C",
            }}
            onClick={() => handleDeleteTariffFlag(datas.idPriceDynamic)}
            icon={<FaTrash />}
          />
        );
      },
    },
  ];

  return (
    <Container>
      <Preload visible={loading} />
      <Content>
        <ContentButtonNewTrigger>
          <Button type="primary" onClick={() => setVisibleModal(true)}>
            Novo Gatilho
          </Button>
          {selectedRowKeys.length > 0 && (
          <Button
            type="default"
            style={{
              marginLeft: "10px",
              background: "#DC143C",
              color: "#fff",
            }}
            loading={loading}
            onClick={handleDeleteMultiple}
          >
            Excluir Selecionadas ({selectedRowKeys.length})
          </Button>
        )}
        </ContentButtonNewTrigger>
        <ContentTable>
          <Table
            rowKey="idPriceDynamic"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={tariffsFlags}
            pagination={false}
            loading={loadingTable}
          />
        </ContentTable>
      </Content>

      {visibleEditModal && editingItem && (
        <ModalEditTariffFlag
          visible={visibleEditModal}
          setVisible={setVisibleEditModal}
          tripTypes={tripTypes}
          setLoading={setLoading}
          loading={loading}
          getTariffFlag={getTariffFlag}
          editingItem={editingItem}
        />
      )}

      <ModalAddTariffFlag
        getTariffFlag={getTariffFlag}
        setLoading={setLoading}
        loading={loading}
        tripTypes={tripTypes}
        setVisible={setVisibleModal}
        visible={visibleModal}
      />
    </Container>
  );
};
