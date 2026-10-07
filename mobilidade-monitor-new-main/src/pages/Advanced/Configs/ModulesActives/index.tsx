import { Table, Switch, Button } from "antd";
import { MdModeEditOutline } from "react-icons/md";
import { AxiosError } from "axios";
import swal from "sweetalert";

import api from "../../../../services/api";
import { useEffect, useState } from "react";

import { ModalEditLogo } from "../../../../components/Advanced/Config/ModulesActives/ModalEditLogo";
import { SimulatorScreenInitial } from "../../../../components/Advanced/Config/ModulesActives/SimulatorScreenInitial";

import { ModulesActivesProps, AppConfigProps } from "./types";
import type { ColumnsType } from "antd/es/table";
import { Constants } from "../../../../utils/constants";

import {
  Container,
  ContentTable,
  ContentLogo,
  Logo,
  ContentSimulator,
} from "./styles";

export const ModulesActives = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleModalEditLogo, setVisibleModalEditLogo] =
    useState<boolean>(false);

  const [modulesActives, setModulesActives] = useState<ModulesActivesProps[]>(
    []
  );

  const [moduleActiveSelected, setModuleActiveSelected] =
    useState<ModulesActivesProps | null>(null);

  const [appConfig, setAppConfig] = useState<AppConfigProps[]>([]);

  const getModulesActives = async () => {
    try {
      setLoading(true);
      const responseModulesActives = await api.get("appModule");

      if (responseModulesActives.status) {
        setModulesActives(responseModulesActives.data.response);
      }
    } catch (error) {
      const errorResponse = error as AxiosError;
      swal({
        title: errorResponse.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAppConfigs = async () => {
    try {
      setLoading(true);

      const responseAppConfig = await api.get("appConfig");

      if (responseAppConfig.status) {
        setAppConfig(responseAppConfig.data.response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatusModule = (module: ModulesActivesProps) => {
    swal({
      title: "Deseja realmente executar esta ação?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .post("appModule/update", {
            id: String(module.id),
            isActive: String(module.isActive === 1 ? 0 : 1),
            name: module.name,
          })
          .then((response) => {
            if (response.status) {
              swal({
                title: "Status atualizado com sucesso",
                icon: "success",
              }).then(() => {
                getModulesActives();
              });
            }
          })
          .catch((error: AxiosError) => {
            swal({
              title: error?.response?.data.message,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleOpenModalEditLogo = (
    moduleSelected: ModulesActivesProps | null
  ) => {
    setVisibleModalEditLogo(true);
    setModuleActiveSelected(moduleSelected);
  };

  useEffect(() => {
    getModulesActives();
    getAppConfigs();
  }, []);

  const columns: ColumnsType<ModulesActivesProps> = [
    {
      title: "Módulo",
      key: "module",
      render: (_, value) => {
        return <span>{value.name}</span>;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_, value) => {
        const isActive = value.isActive ? true : false;
        return (
          <div>
            <Switch
              checked={isActive}
              size="small"
              onChange={() => handleUpdateStatusModule(value)}
            />
          </div>
        );
      },
    },
    {
      title: "Logo",
      key: "logo",
      render: (_, value) => {
        return (
          <ContentLogo>
            <Logo
              width={100}
              height={100}
              src={`${value.logo}?v=${new Date().getTime()}`}
              alt={`logo ${value.name}`}
              fallback={Constants.defaultImgNotFound}
            />
            <Button
              icon={<MdModeEditOutline color="#1677ff" />}
              onClick={() => handleOpenModalEditLogo(value)}
            />
          </ContentLogo>
        );
      },
    },
  ];

  const configApp = appConfig.find((data) => data.appId === 4);

  return (
    <Container>
      <ContentTable>
        <Table
          columns={columns}
          dataSource={modulesActives}
          pagination={false}
          loading={loading}
        />
      </ContentTable>

      <ContentSimulator>
        <SimulatorScreenInitial
          nameScreen="home_inital"
          colorPrimary={configApp?.mainColor}
          colorSecond={configApp?.secondaryColor}
          colorText={configApp?.mainColorText}
          modulesActive={modulesActives}
        />
      </ContentSimulator>

      <ModalEditLogo
        getModules={getModulesActives}
        visible={visibleModalEditLogo}
        setVisible={setVisibleModalEditLogo}
        moduleActiveSelected={moduleActiveSelected}
        setModuleActiveSelected={setModuleActiveSelected}
      />
    </Container>
  );
};
