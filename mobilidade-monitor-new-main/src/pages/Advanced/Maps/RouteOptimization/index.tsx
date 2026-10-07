import { useEffect, useState, useContext } from "react";
import { Select, Button, Card } from "antd";
import swal from "sweetalert";

import { Container, ContainerCard } from "./styles";

import Preload from "../../../../components/Utils/Preload";
//distance - time
import api from "../../../../services/api";
import AuthContext from "../../../../contexts/auth";
import { MAPA } from "../../../../constants/permissions";

export const RouteOptimization = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [priorityGoogle, setPriorityGoogle] = useState<"distance" | "time">(
    "time"
  );
  const [priorityHere, setPriorityHere] = useState<"distance" | "time">("time");
  const [priorityMapbox, setPriorityMapbox] = useState<"distance" | "time">(
    "time"
  );

  const { hasPermission } = useContext(AuthContext);

  const getPriorityRoutes = () => {
    setLoading(true);
    const responsePriorityGoogle = api.get("config/route_optimization_google");
    const responsePriorityHere = api.get("config/route_optimization_here");
    const responsePriorityMapbox = api.get("config/route_optimization_mapbox");

    Promise.all([
      responsePriorityGoogle,
      responsePriorityHere,
      responsePriorityMapbox,
    ])
      .then((response) => {
        if (response[0].status) {
          setPriorityGoogle(response[0].data.response);
        }

        if (response[1].status) {
          setPriorityHere(response[1].data.response);
        }

        if (response[2].status) {
          setPriorityMapbox(response[2].data.response);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSaveOtimization = async (type: "google" | "here" | "mapbox") => {
    setLoading(true);
    try {
      if (type === "google") {
        const response = await api.put("config", {
          route_optimization_google: priorityGoogle,
        });

        if (response.status) {
          swal({
            title: "Configuração atualizada com sucesso!",
            icon: "success",
          });
          getPriorityRoutes();
        }
      } else if (type === "here") {
        const response = await api.put("config", {
          route_optimization_here: priorityHere,
        });

        if (response.status) {
          swal({
            title: "Configuração atualizada com sucesso!",
            icon: "success",
          });
          getPriorityRoutes();
        }
      } else if (type === "mapbox") {
        const response = await api.put("config", {
          route_optimization_mapbox: priorityMapbox,
        });

        if (response.status) {
          swal({
            title: "Configuração atualizada com sucesso!",
            icon: "success",
          });
          getPriorityRoutes();
        }
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao atualizar dados",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPriorityRoutes();
  }, []);

  return (
    <Container>
      <Preload visible={loading} />
      <ContainerCard>
        <Card
          title="Google"
          style={{
            width: 400,
          }}
        >
          <Select
            style={{
              width: "100%",
            }}
            value={priorityGoogle}
            onChange={(value) => setPriorityGoogle(value)}
          >
            <Select.Option value="time">Tempo</Select.Option>
            <Select.Option value="distance">Distância</Select.Option>
          </Select>
          {hasPermission(MAPA, "editar_otimizacao_rotas") && (
            <Button
              style={{
                width: "100%",
                marginTop: 10,
              }}
              type="primary"
              onClick={() => handleSaveOtimization("google")}
            >
              Salvar
            </Button>
          )}
        </Card>

        <Card
          title="Here"
          style={{
            width: 400,
          }}
        >
          <Select
            style={{
              width: "100%",
            }}
            value={priorityHere}
            onChange={(value) => setPriorityHere(value)}
          >
            <Select.Option value="time">Tempo</Select.Option>
            <Select.Option value="distance">Distância</Select.Option>
          </Select>

          {hasPermission(MAPA, "editar_otimizacao_rotas") && (
            <Button
              style={{
                width: "100%",
                marginTop: 10,
              }}
              type="primary"
              onClick={() => handleSaveOtimization("here")}
            >
              Salvar
            </Button>
          )}
        </Card>

        <Card
          title="MapBox"
          style={{
            width: 400,
          }}
        >
          <Select
            style={{
              width: "100%",
            }}
            value={priorityMapbox}
            onChange={(value) => setPriorityMapbox(value)}
          >
            <Select.Option value="time">Tempo</Select.Option>
            <Select.Option value="distance">Distância</Select.Option>
          </Select>

          {hasPermission(MAPA, "editar_otimizacao_rotas") && (
            <Button
              style={{
                width: "100%",
                marginTop: 10,
              }}
              type="primary"
              onClick={() => handleSaveOtimization("mapbox")}
            >
              Salvar
            </Button>
          )}
        </Card>
      </ContainerCard>
    </Container>
  );
};
