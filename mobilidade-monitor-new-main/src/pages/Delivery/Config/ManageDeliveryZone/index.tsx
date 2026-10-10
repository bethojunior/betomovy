import { Button, Divider, Table } from "antd";
import swal from "sweetalert";
import type { TableProps } from "antd";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { AxiosError } from "axios";

import { useEffect, useState } from "react";

import { Container, ContentTable, ContentBtnActions } from "./styles";

import { DeliveryNeighborhoodProps } from "./types";
import api from "../../../../services/api";

import { theme_colors } from "../../../../theme/theme";
import Session from "../../../../utils/Session";

import { ModalAddEditZone } from "../../../../components/Delivery/Config/ManageDeliveryZone/ModalAddEditZone";

export const ManageDeliveryZone = () => {
  const [openModalZone, setOpenModalZone] = useState<boolean>(false);
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState<
    DeliveryNeighborhoodProps[]
  >([]);
  const [deliveryNeighborhoodSelected, setDeliveryNeighborhoodSelected] =
    useState<DeliveryNeighborhoodProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const cityId = Session.getLocal("citySelected")?.cityId;

  const getDeliveryNeighborhood = async () => {
    try {
      setLoading(true);
      const responseDelivery = await api.get(
        `deliveryNeighborhood?cityId=${cityId}`
      );

      if (responseDelivery.status) {
        setDeliveryNeighborhood(responseDelivery.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteZone = (idZone: number) => {
    swal({
      title: "Deseja realmente remover essa zona?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`deliveryNeighborhood/${idZone}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Zona deletada com sucesso!",
                icon: "success",
              });
              getDeliveryNeighborhood();
            }
          })
          .catch((error: AxiosError) => {
            swal({
              title: error.response?.data.message,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleEditZone = (responseNeighborhood: DeliveryNeighborhoodProps) => {
    setDeliveryNeighborhoodSelected(responseNeighborhood);
    setOpenModalZone(true);
  };

  useEffect(() => {
    getDeliveryNeighborhood();
  }, []);

  const columns: TableProps<DeliveryNeighborhoodProps>["columns"] = [
    {
      title: "Zona",
      dataIndex: "name",
      key: "zone",
    },
    {
      title: "Cidade",
      key: "city",
      render: (_, data) => {
        return <span>{data.city.nome}</span>;
      },
    },
    {
      title: "Ações",
      key: "actions",
      align: "right",
      render: (_, data) => {
        return (
          <ContentBtnActions>
            <Button
              onClick={() => handleEditZone(data)}
              icon={
                <MdEdit
                  style={{
                    color: theme_colors.primary_antd,
                  }}
                />
              }
            />
            <Button
              onClick={() => handleDeleteZone(data.id)}
              icon={
                <FaTrash
                  style={{
                    color: theme_colors.red_crismon,
                  }}
                />
              }
            />
          </ContentBtnActions>
        );
      },
    },
  ];

  return (
    <Container>
      <Button type="primary" onClick={() => setOpenModalZone(true)}>
        Adicionar Zona
      </Button>
      <Divider />
      <ContentTable>
        <Table
          columns={columns}
          dataSource={deliveryNeighborhood}
          loading={loading}
          pagination={false}
          rowKey={(item) => item.id}
          locale={{
            emptyText: "Sem dados",
          }}
        />
      </ContentTable>

      <ModalAddEditZone
        visible={openModalZone}
        setVisible={setOpenModalZone}
        getDeliveryNeighborhood={getDeliveryNeighborhood}
        deliveryNeighborhoodSelected={deliveryNeighborhoodSelected}
        setDeliveryNeighborhoodSelected={setDeliveryNeighborhoodSelected}
      />
    </Container>
  );
};
