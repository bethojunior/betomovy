import { Container, ContentTable, ContentButton, Loader } from "./styles";
import { useState, useEffect, useContext } from "react";
import { Table, Button as ButtonAntd, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { FaTrash } from "react-icons/fa";
import swal from "sweetalert";

import { ModalAddMapService } from "../../../../components/Advanced/Maps/ConfigCity/ModalAddMapService";
import AuthContext from "../../../../contexts/auth";

import api from "../../../../services/api";

import { TypesProps, MapsServicesProps } from "./types";
import { MAPA } from "../../../../constants/permissions";
import { theme_colors } from "../../../../theme/theme";

export const ConfigCity = () => {
  const [mapServices, setMapServices] = useState<MapsServicesProps[]>([]);
  const [typesServices, setTypesServices] = useState<TypesProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);

  const [modalAddMapService, setModalAddMapService] = useState<boolean>(false);

  const { hasPermission } = useContext(AuthContext);

  const getDatas = () => {
    setLoadingTable(true);
    const responseMapServices = api.get("mapService");
    const responseTypes = api.get("mapService/types");

    Promise.all([responseMapServices, responseTypes])
      .then((response) => {
        const rawMapServices = response[0]?.data?.response ?? response[0]?.data?.data;
        setMapServices(Array.isArray(rawMapServices) ? rawMapServices : []);

        const rawTypes = response[1]?.data?.response ?? response[1]?.data?.data;
        setTypesServices(Array.isArray(rawTypes) ? rawTypes : []);
      })
      .catch((error) => {
        console.error(error);
        setMapServices([]);
        setTypesServices([]);
      })
      .finally(() => {
        setLoadingTable(false);
      });
  };

  const handleRemoveMapService = (key: string) => {
    swal({
      title: "Deseja remover essa credencial?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoadingTable(true);
        api
          .get(`mapService/${key}/disable`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Deletado com sucesso!",
                icon: "success",
              });
              getDatas();
            }
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Erro ao remover serviço de mapa",
              icon: "error",
            });
          })
          .finally(() => {
            setLoadingTable(false);
          });
      }
    });
  };

  useEffect(() => {
    getDatas();
  }, []);

  const columns: ColumnsType<MapsServicesProps> = [
    {
      title: "Tipo",
      key: "type",
      render: (_, data) => {
        return (data?.type || "-").toLocaleUpperCase();
      },
    },
    {
      title: "Credenciais",
      key: "credencies",
      render: (_, data) => {
        const keysList = Array.isArray(data?.keys) ? data.keys : [];
        if (keysList.length === 0) {
          return <span>-</span>;
        }
        return keysList.map((value, idx) => {
          const valText = typeof value === "object" ? value?.value : String(value ?? "");
          return <Tag key={idx} color="#138496">{valText || "-"}</Tag>;
        });
      },
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, data) => {
        return (
          <div>
            {hasPermission(MAPA, "deletar_conf_credenciais_cidade") && (
              <ButtonAntd
                style={{
                  color: theme_colors.red_crismon,
                }}
                onClick={() => handleRemoveMapService(data?.groupCode)}
                icon={<FaTrash />}
              />
            )}
          </div>
        );
      },
    },
  ];
  if (loading) return <Loader spinning />;

  return (
    <Container>

      {hasPermission(MAPA, "adicionar_conf_credenciais_cidade") && (
        <ContentButton>
          <ButtonAntd
            type="primary"
            onClick={() => setModalAddMapService(true)}
          >
            Adicionar Credencial
          </ButtonAntd>
        </ContentButton>
      )}

      <ContentTable>
        <Table
          columns={columns}
          dataSource={Array.isArray(mapServices) ? mapServices : []}
          rowKey={(record, idx) => record?.groupCode || record?.id || String(idx)}
          pagination={false}
          loading={loadingTable}
        />
      </ContentTable>

      <ModalAddMapService
        getDatas={getDatas}
        setLoading={setLoading}
        typesMaps={typesServices}
        visible={modalAddMapService}
        setVisible={setModalAddMapService}
      />
    </Container>
  );
};
