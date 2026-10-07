import { FC, useEffect, useState, useCallback } from "react";
import api from "../../../../services/api";
import { Button, Table } from "antd";
import swal from "sweetalert";
import { AiOutlinePause, AiOutlinePlayCircle } from "react-icons/ai";
import { Container, ContentTable, NoDriversMessage,Loader, } from "./styles";
import Preload from "../../../../components/Utils/Preload";
import Alert from "../../../../components/Utils/Alert";
import { DriverData } from "./types";

const ReleaseDrivers: FC = () => {
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert] = useState("");
  const [typeAlert] = useState<"success" | "info" | "warning" | "error">(
    "success"
  );

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/routeDriverAccepted");
      setDrivers(response.data.response);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleToggleDriverStatus = (driver: DriverData) => {
    const isActive = driver.active === 1;
    const action = isActive ? "bloquear" : "liberar";
    const endpoint = isActive
      ? `/routeDriverAccepted/${driver.id}`
      : `/routeDriverAccepted/${driver.id}/enable`;

    const method = isActive ? "DELETE" : "PUT";

    swal({
      title: `Deseja ${action} essa rota para o motorista?`,
      icon: "warning",
      buttons: ["Não", "Sim"],
      dangerMode: true,
    }).then((willToggle) => {
      if (willToggle) {
        api({
          method: method,
          url: endpoint,
        })
          .then(() => {
            swal("Sucesso", "Status modificado com sucesso", "success");
            fetchDrivers();
          })
          .catch((error) => {
            console.error(error);
            swal("Erro", `Não foi possível ${action} o motorista`, "error");
          });
      }
    });
  };

  const columns = [
    {
      title: "Motorista",
      dataIndex: ["driver", "name"],
      key: "driverName",
    },
    {
      title: "Fone",
      dataIndex: ["driver", "phone"],
      key: "driverPhone",
    },
    {
      title: "Solicitado em",
      dataIndex: "created_at",
      key: "createdAt",
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Rota",
      dataIndex: ["route", "name"],
      key: "routeName",
    },
    {
      title: "Atividade",
      key: "activity",
      render: (driver: DriverData) => (
        <Button onClick={() => handleToggleDriverStatus(driver)}>
          {driver.active === 1 ? (
            <>
              <AiOutlinePause style={{ color: "red", marginRight: "8px" }} />
              Bloquear
            </>
          ) : (
            <>
              <AiOutlinePlayCircle
                style={{ color: "green", marginRight: "8px" }}
              />
              Liberar
            </>
          )}
        </Button>
      ),
    },
  ];

  if (loading) return <Loader spinning />;

  return (
    <Container>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      {loading ? (
        <p></p>
      ) : drivers.length === 0 ? (
        <NoDriversMessage>Não há motoristas para liberar</NoDriversMessage>
      ) : (
        <ContentTable>
          <div className="table-responsive">
            <Table
              columns={columns}
              dataSource={drivers}
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </div>
        </ContentTable>
      )}
    </Container>
  );
};

export default ReleaseDrivers;
