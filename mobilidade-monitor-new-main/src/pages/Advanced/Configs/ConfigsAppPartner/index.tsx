import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Button, Pagination, Table, Image } from "antd";
import type { TableProps } from "antd";
import swal from "sweetalert";
import { useContext } from "react";
import AuthContext from "../../../../contexts/auth";
import Mask from "../../../../services/Mask";

import {
  Container,
  ContentTable,
  ContentButtonAddConfig,
  ContentActions,
  ContentPagination,
} from "./styles";

import { ModalAddAndEditConfig } from "../../../../components/Advanced/Config/ConfigAppPartner/ModalAddAndEditConfig";

import { theme_colors } from "../../../../theme/theme";
import api from "../../../../services/api";
import { ConfigsAppsPartnerProps } from "./types";
import { useHistory } from "react-router-dom";
import { CONFIGURACAO } from "../../../../constants/permissions";

let last_page: number | null = null;

export const ConfigsAppPartner = () => {
  const [listConfigsApps, setListConfigsApps] = useState<
    ConfigsAppsPartnerProps[]
  >([]);
  const [configAppSelected, setConfigAppSelected] =
    useState<ConfigsAppsPartnerProps | null>(null);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { setMaskPhoneValue } = Mask;

  const history = useHistory();

  const { hasPermission } = useContext(AuthContext);

  const hasPermissionVisualizeAppPartners =
    import.meta.env.APP_PARTNER === "true"
      ? hasPermission(CONFIGURACAO, "visualize_config_app_partner")
      : false;

  const hasPermissionAddAppPartners =
    import.meta.env.APP_PARTNER === "true"
      ? hasPermission(CONFIGURACAO, "add_config_app_partner")
      : false;
  const hasPermissionLinksEditsPartners =
    import.meta.env.APP_PARTNER === "true"
      ? hasPermission(CONFIGURACAO, "edit_config_app_partner")
      : false;

  const hasPermissionDeletePartners =
    import.meta.env.APP_PARTNER === "true"
      ? hasPermission(CONFIGURACAO, "delete_config_app_partner")
      : false;

  const getConfigsAppPartner = async (page: number = 1) => {
    try {
      setLoading(true);
      const responseConfigsApp = await api.get(
        `config_app_partners/find_all?page=${page}`
      );

      if (responseConfigsApp.status) {
        setListConfigsApps(responseConfigsApp.data.response.data);
        last_page = responseConfigsApp.data.response.last_page;
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.response[0],
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfig = (idConfig: number) => {
    swal({
      title: "Aviso",
      text: "Você deseja realmente deletar essa configuração?",
      icon: "warning",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`config_app_partners/${idConfig}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Sucesso",
                text: "Configuração deletada com sucesso",
                icon: "success",
              });
              getConfigsAppPartner();
            }
          })
          .catch((error) => {
            const responseError = error as AxiosError;
            swal({
              title: "Error",
              text: responseError.response?.data.response[0],
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleEditConfigApp = (data: ConfigsAppsPartnerProps) => {
    setConfigAppSelected(data);
    setVisibleModal(true);
  };

  const columns: TableProps<ConfigsAppsPartnerProps>["columns"] = [
    {
      title: "Aplicativo",
      key: "app",
      render: (_, data) => {
        return (
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            {data.name_app.toLocaleUpperCase()}
          </span>
        );
      },
    },
    {
      title: "Logo",
      key: "logo",
      render: (_, data) => {
        return (
          <div>
            <Image
              width={100}
              src={data.logo_app}
              alt={`logo-${data.name_app}`}
            />
          </div>
        );
      },
    },
    {
      title: "Cor Principal",
      key: "main-color",
      render: (_, data) => {
        return <input type="color" value={data.primary_color} disabled />;
      },
    },
    {
      title: "Cor Secundária",
      key: "secondary-color",
      render: (_, data) => {
        return <input type="color" value={data.secondary_color} disabled />;
      },
    },
    {
      title: "Cor Texto",
      key: "text-color",
      render: (_, data) => {
        return <input type="color" value={data.text_color} disabled />;
      },
    },
    {
      title: "Telefone Suporte",
      key: "phone-support",
      render: (_, data) => {
        const hasExistPhoneRegistered = Boolean(data.phone_support);

        return (
          <span>
            {hasExistPhoneRegistered
              ? setMaskPhoneValue(data.phone_support)
              : "-"}
          </span>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      align: "right",
      render: (_, data) => {
        return (
          <ContentActions>
            {hasPermissionLinksEditsPartners && (
              <Button
                title="Editar"
                icon={<MdEdit style={{ color: theme_colors.primary_antd }} />}
                onClick={() => handleEditConfigApp(data)}
              />
            )}
            {hasPermissionDeletePartners && (
              <Button
                title="Deletar"
                icon={<FaTrash style={{ color: theme_colors.red_crismon }} />}
                onClick={() => handleDeleteConfig(data.id)}
              />
            )}
          </ContentActions>
        );
      },
    },
  ];

  useEffect(() => {
    if (!hasPermissionVisualizeAppPartners) {
      history.push("/");
    }
    getConfigsAppPartner();
  }, []);

  return (
    <Container>
      {hasPermissionAddAppPartners && (
        <ContentButtonAddConfig>
          <Button type="primary" onClick={() => setVisibleModal(true)}>
            Adicionar Configuração de App Parceiro
          </Button>
        </ContentButtonAddConfig>
      )}

      <ContentTable>
        <Table
          columns={columns}
          dataSource={listConfigsApps}
          pagination={false}
          loading={loading}
        />
      </ContentTable>

      {last_page && (
        <ContentPagination>
          <Pagination
            defaultCurrent={1}
            total={last_page * 10}
            onChange={(currentPage) => getConfigsAppPartner(currentPage)}
          />
          ;
        </ContentPagination>
      )}

      <ModalAddAndEditConfig
        visible={visibleModal}
        setVisible={setVisibleModal}
        configAppSelected={configAppSelected}
        setConfigAppSelected={setConfigAppSelected}
        getConfigsAppPartner={getConfigsAppPartner}
      />
    </Container>
  );
};
