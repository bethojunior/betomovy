import { Button, Table, Image } from "antd";
import { TableProps } from "antd/lib";
import swal from "sweetalert";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { HelpersProps } from "./types";

import { Container, ContentTable, ContentAddItem } from "./styles";
import api from "../../../../services/api";
import { theme_colors } from "../../../../theme/theme";
import { FaTrash } from "react-icons/fa";
import Mask from "../../../../services/Mask";

import { ModalAddItem } from "../../../../components/Frete/ServicesExtras/ModalAddItem";
import Preload from "../../../../components/Utils/Preload";

import { Constants } from "../../../../utils/constants";
import Session from "../../../../utils/Session";

export const ServicesExtras = () => {
  const [helpers, setHelpers] = useState<HelpersProps[]>([]);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const cityId = Session.getLocal("citySelected")?.cityId;
  const { setMaskMoneyNumber } = Mask;

  const getHelps = async () => {
    try {
      setLoadingTable(true);
      const responseHelps = await api.get(`price/help?cityId=${cityId}`);

      if (responseHelps.status) {
        setHelpers(responseHelps.data.response);
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

  const handleDeleteItem = (id: number) => {
    swal({
      title: "Aviso",
      text: "Deseja realmente executar esta ação?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`price/help/${id}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Sucesso",
                text: "Item removido com sucesso",
                icon: "success",
              });
              getHelps();
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

  const columns: TableProps<HelpersProps>["columns"] = [
    {
      title: "Nome",
      key: "name",
      render: (_, data) => {
        return <span>{data?.accessibility_help?.name || "Não informado"}</span>;
      },
    },
    {
      title: "Imagem",
      key: "image",
      render: (_, data) => {
        return (
          <Image
            width={70}
            src={
              data?.accessibility_help?.picture
                ? data.accessibility_help.picture
                : Constants.defaultImgNotFound
            }
          />
        );
      },
    },
    {
      title: "Quantidade",
      key: "quantityIcon",
      render: (_, data) => {
        return <span>{`Aparece ${data.quantityIcon} vezes`}</span>;
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
      title: "Ações",
      key: "actions",
      align: "right",
      render: (_, data) => {
        return (
          <div>
            <Button
              title="Excluir"
              icon={<FaTrash style={{ color: theme_colors.red_crismon }} />}
              onClick={() => handleDeleteItem(data.id)}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getHelps();
  }, []);

  return (
    <Container>
      <Preload visible={loading} />
      <ContentAddItem>
        <Button type="primary" onClick={() => setVisibleModal(true)}>
          Adicionar
        </Button>
      </ContentAddItem>
      <ContentTable>
        <Table
          columns={columns}
          dataSource={helpers}
          pagination={false}
          loading={loadingTable}
        />
      </ContentTable>

      <ModalAddItem
        setVisible={setVisibleModal}
        visible={visibleModal}
        getHelpers={getHelps}
      />
    </Container>
  );
};
