import { Button, Table, Image } from "antd";
import type { TableProps } from "antd";
import swal from "sweetalert";
import { AxiosError } from "axios";

import { useEffect, useState } from "react";

import api from "../../../../services/api";
import Session from "../../../../utils/Session";
import {
  Container,
  ContentActions,
  ContentTable,
  ContentButtonAdd,
} from "./styles";

import { ObstaclesProps } from "./types";

import Mask from "../../../../services/Mask";
import { FaTrash } from "react-icons/fa";
import { theme_colors } from "../../../../theme/theme";

import { Constants } from "../../../../utils/constants";

import Preload from "../../../../components/Utils/Preload";

import { ModalAddObstacle } from "../../../../components/Frete/LoadAccebility/ModalAddItem";

export const LoadAccessibility = () => {
  const [obtacles, setObstacles] = useState<ObstaclesProps[]>([]);
  const [visibleModalAdd, setVisibleModalAdd] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);

  const cityId = Session.getLocal("citySelected")?.cityId;

  const { setMaskMoneyNumber } = Mask;

  const getObstacles = async () => {
    try {
      setLoadingTable(true);
      const responseObstacles = await api.get(
        `price/obstacle?cityId=${cityId}`
      );

      if (responseObstacles.status) {
        setObstacles(responseObstacles.data.response);
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

  const handleDelete = async (id: number) => {
    swal({
      title: "Info",
      text: "Você realmente deseja executar esta ação?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`price/obstacle/${id}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Sucesso",
                text: "Obstáculo deletado com sucesso",
                icon: "success",
              });
              getObstacles();
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

  const columns: TableProps<ObstaclesProps>["columns"] = [
    {
      title: "Nome",
      key: "name",
      render: (_, data) => {
        return <span>{data.obstacle.description}</span>;
      },
    },
    {
      title: "Imagem",
      key: "image",
      render: (_, data) => {
        return (
          <>
            <Image
              width={70}
              src={
                data.obstacle.picture
                  ? data.obstacle.picture
                  : Constants.defaultImgNotFound
              }
            />
          </>
        );
      },
    },
    {
      title: "Valor",
      key: "value",
      render: (_, data) => {
        return <span>{setMaskMoneyNumber(data.value)}</span>;
      },
    },
    {
      title: "Valor por andar",
      key: "valuePerFloor",
      render: (_, data) => {
        return <span>{setMaskMoneyNumber(data.valuePerFloor)}</span>;
      },
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, data) => {
        return (
          <ContentActions>
            <Button
              title="Excluir"
              icon={<FaTrash style={{ color: theme_colors.red_crismon }} />}
              onClick={() => handleDelete(data.id)}
            />
          </ContentActions>
        );
      },
    },
  ];

  useEffect(() => {
    getObstacles();
  }, []);

  return (
    <Container>
      <Preload visible={loading} />
      <ContentButtonAdd onClick={() => setVisibleModalAdd(true)}>
        <Button type="primary">Adicionar</Button>
      </ContentButtonAdd>
      <ContentTable>
        <Table
          columns={columns}
          dataSource={obtacles}
          pagination={false}
          loading={loadingTable}
        />
      </ContentTable>

      <ModalAddObstacle
        visible={visibleModalAdd}
        setVisible={setVisibleModalAdd}
        getObstacles={getObstacles}
      />
    </Container>
  );
};
