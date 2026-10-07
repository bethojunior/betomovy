import {
  Container,
  Content,
  ContentButtonNewDynamicArea,
  ContentTable,
  LabelSwitch,
} from "./styles";

import { Table, Switch, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FaEdit, FaTrash } from "react-icons/fa";
import swal from "sweetalert";

import { useState, useEffect } from "react";

import { DynamicsAreasProps } from "./types";

import api from "../../../../../services/api";

import Preload from "../../../../../components/Utils/Preload";
import { ModalDynamicPerArea } from "../../../../../components/Advanced/Tariffs/ModalDynamicPerArea";
import { ModalEditDynamicPerArea } from "../../../../../components/Advanced/Tariffs/ModalEditDynamicPerArea";

export const DynamicPerArea = () => {
  const [dynamicsAreas, setDynamicsAreas] = useState<DynamicsAreasProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalEditVisible, setModalEditVisible] = useState(false);

  const getDynamicAreas = async () => {
    setLoadingTable(true);
    try {
      const responseDynamicArea = await api.get("dynamicArea");
      if (responseDynamicArea.status) {
        setDynamicsAreas(responseDynamicArea.data.response);
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingTable(false);
  };

  const onChangeStatus = async (checked: boolean, id: number) => {
    setLoadingTable(true);
    try {
      if (checked) {
        const responseStatusEnable = await api.put(`dynamicArea/${id}/disable`);
        if (responseStatusEnable.status) {
          getDynamicAreas();
        }
      } else {
        const responseStatusDisable = await api.put(`dynamicArea/${id}/enable`);
        if (responseStatusDisable.status) {
          getDynamicAreas();
        }
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao atualizar status",
        icon: "error",
      });
    }
    setLoadingTable(false);
  };

  const handleDeleteItem = (id: number) => {
    swal({
      title: "Deseja remover esse valor?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoadingTable(true);
        api
          .delete(`dynamicArea/${id}`)
          .then((response) => {
            setLoadingTable(false);
            if (response.status) {
              swal({
                title: "Área dinâmica exluída",
                icon: "success",
              });
              getDynamicAreas();
            }
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Erro ao deletar área",
              icon: "error",
            });
          })
          .finally(() => {
            setLoadingTable(false);
          });
      }
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setModalEditVisible(true);
  };

  useEffect(() => {
    getDynamicAreas();
  }, []);

  const columns: ColumnsType<DynamicsAreasProps> = [
    {
      title: "Área",
      dataIndex: "name",
      key: "name",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Valor multiplicado",
      dataIndex: "multiplierValue",
      key: "multiplierValue",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Horário",
      key: "hours",
      width: 150,
      ellipsis: true,
      render: (_, data) => {
        return (
          <span>
            {data.startTime} às {data.endTime}
          </span>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 200,
      ellipsis: true,
      align: "right",
      render: (_, datas) => {
        const statusData = datas.active === 0 ? false : true;
        return (
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <Switch
                onChange={() => onChangeStatus(statusData, datas.id)}
                checked={statusData}
              />
              <LabelSwitch>
                {!statusData ? "Desativado" : "Ativado"}
              </LabelSwitch>
            </div>
    
            <div style={{ display: "flex", gap: 10 }}>
              <Button
                onClick={() => handleEdit(datas)}
                icon={<FaEdit />}
              />
              <Button
                style={{ color: "#DC143C" }}
                onClick={() => handleDeleteItem(datas.id)}
                icon={<FaTrash />}
              />
            </div>
          </div>
        );
      },
    }
    
  ];

  return (
    <Container>
      <Preload visible={loading} />
      <Content>
        <ContentButtonNewDynamicArea>
          <Button type="primary" onClick={() => setVisibleModal(true)}>
            Adicionar área
          </Button>
        </ContentButtonNewDynamicArea>
        <ContentTable>
          <Table
            columns={columns}
            dataSource={dynamicsAreas}
            pagination={false}
            loading={loadingTable}
          />
        </ContentTable>
      </Content>
      <ModalDynamicPerArea
        getDynamicAreas={getDynamicAreas}
        setLoading={setLoading}
        setVisible={setVisibleModal}
        visible={visibleModal}
      />

      <ModalEditDynamicPerArea
        visible={modalEditVisible}
        setVisible={setModalEditVisible}
        setLoading={setLoading}
        getDynamicAreas={getDynamicAreas}
        editingItem={editingItem}
      />
    </Container>
  );
};
