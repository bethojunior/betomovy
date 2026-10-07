import swal from "sweetalert";
import { Table, Button } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";

import { useState, useEffect } from "react";
import {
  Container,
  ContentTable,
  ContentButtonNewData,
  Content,
} from "./styles";

import api from "../../../../../services/api";

import Preload from "../../../../../components/Utils/Preload";
import { ModalAddTariffTrigger } from "../../../../../components/Advanced/Tariffs/ModalAddTariffTrigger";

import Session from "../../../../../utils/Session";

import { PriceDynamicScheduledProps, TripTypesProps } from "./types";
import { ModalEditTariffTrigger } from "../../../../../components/Advanced/Tariffs/ModalEditTariffTrigger";

export const TariffTrigger = () => {
  const [pricesDynamicsScheduled, setPricesDynamicsScheduled] = useState<
    PriceDynamicScheduledProps[]
  >([]);
  const [tripTypes, setTripTypes] = useState<TripTypesProps[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);  
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [modalAddNewTariffTrigger, setModalAddNewTariffTrigger] =
    useState<boolean>(false);

  const cityId = Session.getLocal("citySelected").cityId;

  const getPricesDynamicScheduled = async () => {
    setLoadingTable(true);
    try {
      const responsePricesDynamicScheduled = await api.get(
        "priceDynamicScheduled"
      );

      if (responsePricesDynamicScheduled.status) {
        setPricesDynamicsScheduled(
          responsePricesDynamicScheduled.data.response
        );
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os dados",
        icon: "error",
      });
    }
    setLoadingTable(false);
  };

  const getTripTypes = async () => {
    setLoadingTable(true);
    try {
      const responseTripTypes = await api.get(`city/${cityId}/tripTypes`);
      if (responseTripTypes.status) {
        setTripTypes(responseTripTypes.data.response);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar tipos de viagens",
        icon: "error",
      });
    }
    setLoadingTable(false);
  };

  const handleDeleteTariffTrigger = (idTariffTrigger: number) => {
    swal({
      title: "Tem certeza que deseja desativar o gatilho",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoadingTable(true);
        api
          .delete(`priceDynamicScheduled/${idTariffTrigger}`)
          .then((response) => {
            setLoadingTable(false);
            if (response.status) {
              swal({
                title: "Gatilho excluído com sucesso!",
                icon: "success",
              });
              getPricesDynamicScheduled();
            }
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Erro ao deletar gatilho de tarifas",
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
    setSelectedItem(item);
    setIsEditModalVisible(true);
  };
  

  useEffect(() => {
    getPricesDynamicScheduled();
    getTripTypes();
  }, []);

  const columns: ColumnsType<PriceDynamicScheduledProps> = [
    {
      title: "Início",
      dataIndex: "startDate",
      render: (_, data) => {
        return new Date(data.startDate).toLocaleString();
      },
    },
    {
      title: "Final",
      dataIndex: "endDate",
      render: (_, data) => {
        return new Date(data.endDate).toLocaleString();
      },
    },
    {
      title: "Tipo",
      dataIndex: "tripType",
      key: "tripType",
    },
    {
      title: "Dinâmica",
      dataIndex: "multiplierValue",
      key: "multiplierValue",
    },
    {
      title: "Etiqueta",
      dataIndex: "tag",
      render: (_, data) => {
        const element = document.createElement("div");
        element.innerHTML = data.tag;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiTrendingUp color="#000" size={20} />
            {element
              .querySelector("div")
              ?.textContent?.replace("trending_up", "")}
          </div>
        );
      },
    },
    {
      title: "Editar",
      key: "action",
      render: (_, data) => (
        <div>
          <Button
            style={{
              color: "#DC143C",
            }}
            onClick={() => handleEdit(data)}
            icon={<FaEdit />}
          />
        </div>
      ),
    },
    {
      title: "Excluir",
      key: "action",
      render: (_, data) => (
        <div>
          <Button
            style={{
              color: "#DC143C",
            }}
            onClick={() => handleDeleteTariffTrigger(data.id)}
            icon={<FaTrash />}
          />
        </div>
      ),
    },
  ];

  return (
    <Container>
      <Preload visible={loading} />
      <Content>
        <ContentButtonNewData>
          <Button
            type="primary"
            onClick={() => setModalAddNewTariffTrigger(true)}
          >
            Novo Gatilho
          </Button>
        </ContentButtonNewData>
        <ContentTable>
          <Table
            dataSource={pricesDynamicsScheduled}
            columns={columns as any}
            pagination={false}
            loading={loadingTable}
          />
        </ContentTable>
      </Content>
      <ModalEditTariffTrigger
        visible={isEditModalVisible}
        setVisible={setIsEditModalVisible}
        tripTypes={tripTypes}
        setLoading={setLoading}
        getPricesDynamicScheduled={getPricesDynamicScheduled}
        selectedItem={selectedItem}
      />
      <ModalAddTariffTrigger
        getPricesDynamicScheduled={getPricesDynamicScheduled}
        setLoading={setLoading}
        tripTypes={tripTypes}
        visible={modalAddNewTariffTrigger}
        setVisible={setModalAddNewTariffTrigger}
      />
    </Container>
  );
};
