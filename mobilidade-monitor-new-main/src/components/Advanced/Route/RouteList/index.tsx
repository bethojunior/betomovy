import { FC, useEffect, useState, useCallback } from "react";
import api from "../../../../services/api";
import Session from "../../../../utils/Session";
import { RouteData, CorporateUser, } from "./types";
import { Button, Table, Modal, Form, Select } from "antd";
import swal from "sweetalert";
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineUser,
  AiOutlineEnvironment,
  AiOutlinePause,
  AiOutlinePlayCircle,
} from "react-icons/ai";
import {
  Container,
  ContentTable,
  CorporateUserList,
  CorporateUserItem,
  CorporateUserName,
  AddUserButton,
  Loader,
} from "./styles";
import Preload from "../../../../components/Utils/Preload";
import Alert from "../../../../components/Utils/Alert";
import { useHistory } from "react-router-dom";

const { Option } = Select;

const RouteList: FC = () => {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [corporateUsers, setCorporateUsers] = useState<CorporateUser[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newUserModalVisible, setNewUserModalVisible] = useState(false);
  const [pointsModalVisible, setPointsModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<CorporateUser[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert] = useState("");
  const [typeAlert] = useState<"success" | "info" | "warning" | "error">(
    "success"
  );
  const [form] = Form.useForm();
  const history = useHistory();

  const cityId = Session.getLocal("citySelected").cityId;

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/route?cityId=${cityId}`);
      setRoutes(response.data.response);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [cityId]);

  useEffect(() => {
    fetchRoutes();
  }, [cityId, fetchRoutes]);

  const handleEdit = (routeId: number) => {
    swal({
      title: "Deseja ir para a tela de edição?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((willEdit) => {
      if (willEdit) {
        history.push(`/route/routeEdit/${routeId}`);
      }
    });
  };

  const handleToggleRouteStatus = (route: RouteData) => {
    const isActive = route.active === 1;
    const action = isActive ? "desativar" : "ativar";
    const endpoint = isActive
      ? `/route/${route.id}/disable`
      : `/route/${route.id}/enable`;

    swal({
      title: `Deseja ${action} essa rota?`,
      text: "Você pode ativar a mesma posteriomente",
      icon: "warning",
      buttons: ["Não", "Sim"],
      dangerMode: true,
    }).then((willToggle) => {
      if (willToggle) {
        api
          .put(endpoint)
          .then(() => {
            swal("Sucesso", "Status modificado com sucesso", "success");
            fetchRoutes();
          })
          .catch((error) => {
            console.error(error);
            swal("Erro", `Não foi possível ${action} a rota`, "error");
          });
      }
    });
  };

  const handleViewPoints = (route: RouteData) => {
    setSelectedRoute(route);
    setPointsModalVisible(true);
  };

  const handleCorporateUsers = useCallback(async (route: RouteData) => {
    try {
      const response = await api.get(`/corporateRoute/${route.id}/companies`);
      setCorporateUsers(response.data.response);
      setSelectedRoute(route);
      setModalVisible(true);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSearchCompany = useCallback(async () => {
    try {
      const response = await api.get(`/company?cityId=${cityId}`);
      setSearchResults(response.data.response);
    } catch (error) {
      console.error(error);
    }
  }, [cityId]);

  useEffect(() => {
    handleSearchCompany();
  }, [cityId, handleSearchCompany]);

  const handleAddUser = async () => {
    if (selectedCompanyId === null) return;

    try {
      await api.post("/corporateRoute", {
        routeId: selectedRoute?.id,
        companyId: selectedCompanyId,
      });
      swal("Sucesso", "Usuário adicionado com sucesso", "success");
      setNewUserModalVisible(false);
      if (selectedRoute) {
        handleCorporateUsers(selectedRoute);
      }
    } catch (error) {
      console.error(error);
      swal("Erro", "Não foi possível adicionar o usuário", "error");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await api.delete(`/corporateRoute/${userId}`);
      swal("Sucesso", response.data.message, "success");
      if (selectedRoute) {
        handleCorporateUsers(selectedRoute);
      }
    } catch (error) {
      console.error(error);
      swal("Erro", "Não foi possível remover o usuário", "error");
    }
  };

  const handleDeleteRoute = async (routeId: number) => {
    swal({
      title: "Atenção",
      text: "Deseja remover esta rota?",
      icon: "warning",
      buttons: ["Não", "Sim"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        api
          .delete(`/route/${routeId}`)
          .then((response) => {
            if (response.data.status) {
              swal("Sucesso", "Rota excluída com sucesso", "success").then(
                () => {
                  fetchRoutes();
                }
              );
            } else {
              swal("Erro", "Não foi possível excluir a rota", "error");
            }
          })
          .catch(() => {
            swal("Erro", "Não foi possível excluir a rota", "error");
          });
      }
    });
  };

  const columns = [
    {
      title: "Rota",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Origem",
      dataIndex: "origin",
      key: "origin",
      width: 300,
      render: (origin: RouteData["origin"]) => <label>{origin.address}</label>,
    },
    {
      title: "Destino",
      dataIndex: "destination",
      key: "destination",
      width: 300,
      render: (destination: RouteData["destination"]) => (
        <label>{destination.address}</label>
      ),
    },
    {
      title: "Atividade",
      key: "activity",
      width: 50,
      render: (route: RouteData) => (
        <Button onClick={() => handleToggleRouteStatus(route)}>
          {route.active === 1 ? (
            <>
              <AiOutlinePause style={{ color: "red", marginRight: "8px" }} />
              Desativar
            </>
          ) : (
            <>
              <AiOutlinePlayCircle
                style={{ color: "green", marginRight: "8px" }}
              />
              Ativar
            </>
          )}
        </Button>
      ),
    },
    {
      title: "Usuários",
      key: "users",
      width: 50,
      render: (route: RouteData) => (
        <Button
          onClick={() => handleCorporateUsers(route)}
          icon={<AiOutlineUser style={{ color: "green" }} />}
        >
          Ver Usuários
        </Button>
      ),
    },
    {
      title: "Pontos",
      key: "points",
      width: 50,
      render: (route: RouteData) => (
        <Button
          onClick={() => handleViewPoints(route)}
          icon={<AiOutlineEnvironment style={{ color: "blue" }} />}
        >
          Ver Pontos
        </Button>
      ),
    },
    {
      title: "Editar",
      key: "edit",
      width: 50,
      render: (route: RouteData) => (
        <Button
          onClick={() => handleEdit(route.id)}
          icon={<AiFillEdit style={{ color: "blue" }} />}
        />
      ),
    },
    {
      title: "Excluir",
      key: "delete",
      width: 50,
      render: (route: RouteData) => (
        <Button
          onClick={() => handleDeleteRoute(route.id)}
          icon={<AiFillDelete style={{ color: "red" }} />}
        />
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
      ) : routes.length === 0 ? (
        <p>Não há rotas para a cidade selecionada</p>
      ) : (
        <ContentTable>
          <div className="table-responsive">
            <Table
              columns={columns}
              dataSource={routes}
              pagination={false}
              scroll={{ x: 1000 }}
            />
          </div>
        </ContentTable>
      )}

      {modalVisible && (
        <Modal
          title="Usuários Corporativos"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          {corporateUsers.length === 0 ? (
            <p>Nenhuma empresa encontrada</p>
          ) : (
            <CorporateUserList>
              {corporateUsers.map((user) => (
                <CorporateUserItem key={user.id}>
                  <CorporateUserName>
                    {user.company.fantasyName}
                  </CorporateUserName>
                  <Button
                    onClick={() => handleDeleteUser(user.id)}
                    icon={<AiFillDelete style={{ color: "red" }} />}
                  />
                </CorporateUserItem>
              ))}
            </CorporateUserList>
          )}
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <AddUserButton onClick={() => setNewUserModalVisible(true)}>
              Adicionar Usuário
            </AddUserButton>
          </div>
        </Modal>
      )}

      {newUserModalVisible && (
        <Modal
          title="Adicionar Usuários Corporativos"
          open={newUserModalVisible}
          onCancel={() => setNewUserModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          <p>Para vincular uma empresa ela deve ser cadastrada antes como PJ</p>
          <Form form={form} layout="vertical">
            <Form.Item name="selectedCompany" label="Selecione a Empresa">
              <Select
                showSearch
                placeholder="Selecione uma empresa"
                onChange={(value) => setSelectedCompanyId(value)}
                filterOption={(input, option) => {
                  if (
                    !option ||
                    !option.children ||
                    typeof option.children !== "string"
                  ) {
                    return false;
                  }
                  const childrenString = option.children as unknown as string;
                  return (
                    childrenString.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                  );
                }}
              >
                {searchResults.map((result) => (
                  <Option key={result.id} value={result.id}>
                    {result.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <AddUserButton onClick={handleAddUser}>Adicionar</AddUserButton>
            </div>
          </Form>
        </Modal>
      )}

      {pointsModalVisible && selectedRoute && (
        <Modal
          title={`Rota: ${selectedRoute.name}`}
          open={pointsModalVisible}
          onCancel={() => setPointsModalVisible(false)}
          footer={null}
          destroyOnClose
          width={600}
        >
          <h3
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            Endereços disponíveis:
          </h3>
          <div
            style={{
              backgroundColor: "#d9f7be",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <p>
              <strong>{selectedRoute.origin.tag}</strong>
            </p>
            <p>
              <strong>Endereço:</strong> {selectedRoute.origin.address}
            </p>
            <p>
              <strong>Ponto de referência:</strong>{" "}
              {selectedRoute.origin.complement}
            </p>
            <p style={{ textAlign: "right" }}>EMBARQUE</p>
          </div>
          <div
            style={{
              backgroundColor: "#9ecce2",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <p>
              <strong>{selectedRoute.destination.tag}</strong>
            </p>
            <p>
              <strong>Endereço:</strong> {selectedRoute.destination.address}
            </p>
            <p>
              <strong>Ponto de referência:</strong>{" "}
              {selectedRoute.destination.complement}
            </p>
            <p style={{ textAlign: "right" }}>DESEMBARQUE</p>
          </div>
          <h3
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            Itens disponíveis:
          </h3>
          {selectedRoute.route_trip_item_types &&
          selectedRoute.route_trip_item_types.length > 0 ? (
            <div>
              {selectedRoute.route_trip_item_types.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <img
                    src={item.trip_item_type.picture}
                    alt={item.trip_item_type.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "10px",
                    }}
                  />
                  <div>
                    <p>
                      <strong>Nome:</strong> {item.trip_item_type.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Nenhum item disponível</p>
          )}
        </Modal>
      )}
    </Container>
  );
};

export default RouteList;
