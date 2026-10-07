import { FC, useState, useEffect, useCallback } from "react";
import { Select, notification } from "antd";
import api from "../../../../services/api";
import { Container, Header, StyledTable, Message , Loader} from "./styles";
import { ManagerType, ManagerResponse, Driver, DriversResponse } from "./types";
import Session from "../../../../utils/Session";

const { Option } = Select;

const DriversByManager: FC = () => {
  const [managers, setManagers] = useState<ManagerType[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); 
  const cityId = Session.getLocal("citySelected").cityId;

  const fetchManagers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<ManagerResponse>(`/manager?cityId=${cityId}&page=1`);
      if (response.data.status) {
        setManagers(response.data.response);
      } else {
        notification.error({ message: response.data.message });
      }
    } catch (error) {
      notification.error({ message: "Erro ao carregar gestores" });
    } finally {
      setLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleManagerChange = async (value: number) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await api.get<DriversResponse>(`/manager/${value}/drivers?page=1`);
      if (response.data.status) {
        setDrivers(response.data.response);
      } else {
        notification.error({ message: response.data.message });
      }
    } catch (error) {
      notification.error({ message: "Erro ao carregar motoristas" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <Select
            placeholder="Selecione o gestor"
            onChange={handleManagerChange}
            style={{ width: 200 }}
          >
            {managers.map(manager => (
              <Option key={manager.user.idUser} value={manager.user.idUser}>
                {manager.user.name}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <span>Motoristas</span>
          <h3>{drivers.length}</h3>
        </div>
      </Header>
      {loading ? (
        <Loader spinning={loading} />
      ) : hasSearched && drivers.length === 0 ? (
        <Message>Nenhum motorista cadastrado</Message>
      ) : (
        <StyledTable>
          <thead>
            <tr>
              <th>Motorista</th>
              <th>Telefone</th>
              <th>Cidade</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.id}>
                <td>{driver.name}</td>
                <td>{driver.phone}</td>
                <td>{driver.city}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      )}
    </Container>
  );
};

export default DriversByManager;
