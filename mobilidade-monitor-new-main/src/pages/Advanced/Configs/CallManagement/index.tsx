import { FC, useEffect, useState } from "react";
import { Collapse } from "antd";
import SyncCallToDriver from "../../../../components/Advanced/Config/ManagementCall/Panel/SyncCallToDriver";
import { Content, Pannel } from "./styles";
import TypeCall from "../../../../components/Advanced/Config/ManagementCall/Panel/TypeCall";
import TypeDriver from "../../../../components/Advanced/Config/ManagementCall/Panel/TypeDriver";
import InformationTrip from "../../../../components/Advanced/Config/ManagementCall/Panel/InformationTrip";
import api from "../../../../services/api";
import { IConfigAppPartnersProps } from "../../../../components/Advanced/Config/ManagementCall/Modal/TripType/types";
import { ICallGroupProps } from "../CallGroup/ListCallGroups/types";

const CallManagement: FC = () => {
  const [listCallGroups, setListCallGroups] = useState<ICallGroupProps[]>([]);
  const [listAppsPartners, setListAppsPartners] = useState<
    IConfigAppPartnersProps[]
  >([]);

  const getAppsPartners = async () => {
    try {
      const responseAppsPartners = await api.get("config_app_partners/find");

      if (responseAppsPartners.status) {
        setListAppsPartners(responseAppsPartners.data.response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCallGroup = async () => {
    try {
      const responseCallGroups = await api.get("callGroup");

      if (responseCallGroups.status) {
        setListCallGroups(responseCallGroups.data.response);
      }
    } catch (error) {
      swal({
        title: "Erro",
        text: "Erro ao buscar informações de grupos de chamados",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getCallGroup();
    getAppsPartners();
  }, []);

  return (
    <Content>
      <div>
        <Collapse ghost>
          <Pannel header="Tipos de chamado" key="1">
            <TypeCall optionsAppPartners={listAppsPartners} callGroups={listCallGroups} />
          </Pannel>
          <Pannel header="Tipos de motorista" key="2">
            <TypeDriver optionsAppPartners={listAppsPartners} />
          </Pannel>
          <Pannel header="Vincular chamado ao tipo de motorista" key="3">
            <SyncCallToDriver />
          </Pannel>
          <Pannel header="Informações sobre tipos de viagens" key="4">
            <InformationTrip />
          </Pannel>
        </Collapse>
      </div>
    </Content>
  );
};

export default CallManagement;
