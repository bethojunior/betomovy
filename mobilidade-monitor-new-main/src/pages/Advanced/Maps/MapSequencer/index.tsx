import {
  Container,
  BodyServiceMaps,
  ContentServicesMaps,
  HeaderServiceMaps,
  RowService,
  ContentRotatePriorityService,
  ContentCards,
  ContentItems,
  Loader,
} from "./styles";

import swal from "sweetalert";
import { Card, Button } from "antd";

import { useEffect, useState } from "react";

import Preload from "../../../../components/Utils/Preload";

import api from "../../../../services/api";
import apiApp from "../../../../services/apiApp";

import { CheckServiceProps, ListPriorityServiceProps } from "./types";
import { AiOutlineSync } from "react-icons/ai";

type TypesKeysMaps =
  | "service_priority_searching"
  | "service_priority_direction"
  | "service_priority_geocoding";

export const MapSequencer = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [services, setServices] = useState<CheckServiceProps>();
  const [listPriorityService, setListPriorityService] =
    useState<ListPriorityServiceProps>();
  const [enableCustomMode, setEnableCustomMode] = useState<string>("");

  const getServicesAndListPriority = () => {
    setLoading(true);
    const responseServices = apiApp.get("/Map/CheckServices");
    const responseListPriority = apiApp.get("/Map/ListPriorityService");
    const responseEnableCustomMode = api.get(
      "config/enable_custom_mode_of_map_services"
    );

    Promise.all([
      responseServices,
      responseListPriority,
      responseEnableCustomMode,
    ])
      .then((response) => {
        if (response[0].status) {
          setServices(response[0].data.data);
        }

        if (response[1].status) {
          setListPriorityService(response[1].data.data);
        }

        if (response[2].status) {
          setEnableCustomMode(response[2].data.response);
        }
      })
      .catch((error) => {
        console.error(error);
        swal({
          title: "Erro ao pegar dados de serviços de mapas",
          icon: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangePriority = async (
    listServices: string[] | undefined,
    key: TypesKeysMaps
  ) => {
    setLoading(true);
    try {
      if (listServices) {
        const itemFirstIndex = listServices[0];
        const itemSecondIndex = listServices[1];
        const itemThirdIndex = listServices[2];

        const changedPriority = `[\"${itemSecondIndex}\",\"${itemThirdIndex}\",\"${itemFirstIndex}\"]`;

        const responsePriority = await api.put("config", {
          [key]: changedPriority,
        });

        if (responsePriority.status) {
          getServicesAndListPriority();
        }
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao atualizar a ordem de prioridade de serviços",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServicesAndListPriority();
  }, []);

  if (loading) return <Loader spinning />;

  return (
    <Container>
      <Preload visible={loading} />
      <ContentServicesMaps>
        <HeaderServiceMaps>Serviços de Mapas</HeaderServiceMaps>
        <BodyServiceMaps>
          <RowService>
            <span>Api de serviço global ativo</span>
            <span>{services?.service_global_active ? services.service_global_active.toLocaleUpperCase() : "-"}</span>
          </RowService>
          <RowService>
            <span>Customização de serviços de mapa</span>

            <a href="/mapSetting/configMaps" target="_blank">
              {enableCustomMode === "1" ? "Ligado" : "Desligado"}
            </a>
          </RowService>
          <RowService>
            <span>Serviço de buscar locais (Searching)</span>
            <span>{services?.service_place ? services.service_place.toLocaleUpperCase() : "-"}</span>
          </RowService>
          <RowService>
            <span>Serviço de detalhamento do local (Geocoding)</span>
            <span>{services?.service_geocode ? services.service_geocode.toLocaleUpperCase() : "-"}</span>
          </RowService>
          <RowService>
            <span>Serviço de rota (Direction)</span>
            <span>{services?.service_direction ? services.service_direction.toLocaleUpperCase() : "-"}</span>
          </RowService>
          <RowService>
            <span>Serviço de detalhamento da rota (Direction)</span>
            <span>
              {services?.service_direction_estimate ? services.service_direction_estimate.toLocaleUpperCase() : "-"}
            </span>
          </RowService>
        </BodyServiceMaps>
      </ContentServicesMaps>
      <ContentRotatePriorityService>
        <h1>Prioridades de serviço - para mapa alternativo</h1>
        <ContentCards>
          <Card title="Busca locais - Searching" style={{ width: 400 }}>
            <ContentItems>
              {listPriorityService?.searching?.map((value, index) => {
                return (
                  <div key={index}>
                    <span>{`${index + 1}º ${value}`}</span>
                  </div>
                );
              })}
            </ContentItems>
            <ContentItems>
              <Button
                type="primary"
                onClick={() =>
                  handleChangePriority(
                    listPriorityService?.searching,
                    "service_priority_searching"
                  )
                }
              >
                <AiOutlineSync size={20} />
              </Button>
            </ContentItems>
          </Card>

          <Card title="Rotas - Directions" style={{ width: 400 }}>
            <ContentItems>
              {listPriorityService?.direction?.map((value, index) => {
                return (
                  <div key={index}>
                    <span>{`${index + 1}º ${value}`}</span>
                  </div>
                );
              })}
            </ContentItems>
            <ContentItems>
              <Button
                type="primary"
                onClick={() =>
                  handleChangePriority(
                    listPriorityService?.direction,
                    "service_priority_direction"
                  )
                }
              >
                <AiOutlineSync size={20} />
              </Button>
            </ContentItems>
          </Card>

          <Card title="Detalhe locais - Geocoding" style={{ width: 400 }}>
            <ContentItems>
              {listPriorityService?.geocoding?.map((value, index) => {
                return (
                  <div key={index}>
                    <span>{`${index + 1}º ${value}`}</span>
                  </div>
                );
              })}
            </ContentItems>
            <ContentItems>
              <Button
                type="primary"
                onClick={() =>
                  handleChangePriority(
                    listPriorityService?.geocoding,
                    "service_priority_geocoding"
                  )
                }
              >
                <AiOutlineSync size={20} />
              </Button>
            </ContentItems>
          </Card>
        </ContentCards>
      </ContentRotatePriorityService>
    </Container>
  );
};
