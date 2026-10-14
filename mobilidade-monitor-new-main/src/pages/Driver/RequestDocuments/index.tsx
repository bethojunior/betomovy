import Utils from "@/utils/Utils";
import {
  Button,
  Checkbox,
  Col,
  GetProp,
  Input,
  message,
  Radio,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import { useCallback, useMemo, useState, useEffect } from "react";
import api from "../../../services/api";
import { useDebounce } from "../../../hooks/useDebounce";
import swal from "sweetalert";

interface User {
  id: number;
  name: string[];
}

const RequestDocuments = () => {
  const [searchByGroup, setSearchByGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState("");
  const [checkedValues, setCheckedValues] = useState([]);
  const [userTypes, setUserTypes] = useState<any[]>([]);

  const options = [
    { label: "Fotos", value: "photo" },
    { label: "Documentos", value: "documents" },
  ];

  const filteredUsers = useMemo(() => {
    if (!searchText) return selectedUsers;
    return selectedUsers.filter((user) =>
      Utils.removeAccent(user.name?.join(" ").toLowerCase()).includes(
        Utils.removeAccent(searchText.toLowerCase())
      )
    );
  }, [searchText, selectedUsers]);

  const onChangeCheckbox: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues: string[] | any
  ) => {
    setCheckedValues(checkedValues || []);
  };

  const handleAddUser = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      message.warning("Usuário já adicionado.");
      return;
    }
    setSelectedUsers((prev) => [...prev, user]);
    message.success("Usuário adicionado com sucesso!");
  };

  const handleRemoveUser = (id: number) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== id));
    message.info("Usuário removido.");
  };

  const handleSave = async () => {
    if (selectedUsers.length === 0) {
      message.warning("Selecione pelo menos um usuário.");
      return;
    }

    if (!checkedValues.length) {
      return message.warning("Selecione documento ou foto.");
    }

    const block = await swal({
      title: "Deseja bloquear esses usuários?",
      icon: "info",
      buttons: ["Não", "Sim"],
    });

    const driverIds = (selectedUsers || []).map((user) => user.id);

    const data = {
      users: driverIds,
      type: checkedValues,
      block: block ? block : false,
      isByGroup: searchByGroup,
    };

    try {
      const result = await api.put("driver/documents/requestDocuments", data);
      setSelectedUsers([]);
      setCheckedValues([]);
      swal({
        title: "Solicitação enviada com sucesso!",
        icon: "success",
      });
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      swal({
        title: "Erro ao enviar solicitação",
        icon: "error",
      });
    }
  };

  const handleSelectUserType = (id: string) => {
    const selected = userTypes.find((u) => u.id === id);
    if (selected) {
      handleAddUser({ id: selected.id, name: [selected.name] });
    }
  };

  const fetchUserTypes = async () => {
    try {
      const response = await api.get("/userType/drivers");
      const list = Array.isArray(response?.data?.response)
        ? response.data.response
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      const mappedDrivers = list
        .filter((userType: any) => userType.isDriver == 1)
        .map((userType: any) => ({
          id: userType.idUserType,
          name: userType.name,
        }));

      setUserTypes(mappedDrivers);
    } catch (error) {
      console.error("Erro ao buscar tipos de usuário:", error);
      setUserTypes([]);
    }
  };

  useEffect(() => {
    fetchUserTypes();
  }, []);

  useEffect(() => {
    if (!searchByGroup) {
      setSelectedUsers([]);
    }
  }, [searchByGroup]);

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <Row gutter={[24, 24]}>
        {/* Seletor entre Individual ou Grupo */}
        <Col span={24}>
          <Radio.Group
            onChange={(e) => setSearchByGroup(e.target.value)}
            value={searchByGroup}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Radio value={false}>Selecionar usuários individuais</Radio>
            <Radio value={true}>Selecionar por grupo</Radio>
          </Radio.Group>
        </Col>

        {/* Seletor de grupo ou busca individual */}
        <Col span={24}>
          {searchByGroup ? (
            <Select
              placeholder="Selecione o grupo"
              style={{ width: "100%" }}
              onChange={handleSelectUserType}
            >
              {(userTypes || []).map((userType) => (
                <Select.Option key={userType.id} value={userType.id}>
                  {userType.name}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <DriverSelect
              onSelect={(driver: any) => {
                handleAddUser({
                  id: driver.value,
                  name: driver.label,
                });
              }}
            />
          )}
        </Col>

        {/* Tabela de usuários adicionados */}
        {selectedUsers.length > 0 && (
          <Col span={24}>
            <Input.Search
              placeholder="Buscar motorista na listagem"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ marginBottom: 16 }}
            />
            <Table
              dataSource={filteredUsers}
              rowKey="id"
              size="small"
              locale={{ emptyText: "Nenhum usuário encontrado" }}
              pagination={{ pageSize: 10 }}
              columns={[
                { title: "Usuário", dataIndex: "name", key: "name" },
                {
                  title: "Ações",
                  key: "actions",
                  render: (_, record) => (
                    <Button
                      danger
                      size="small"
                      onClick={() => handleRemoveUser(record.id)}
                    >
                      Remover
                    </Button>
                  ),
                },
              ]}
            />
          </Col>
        )}

        {/* Escolha do que solicitar */}
        <Col span={24}>
          <Checkbox.Group
            options={options}
            defaultValue={[]}
            onChange={onChangeCheckbox}
            style={{ display: "flex", flexDirection: "column" }}
          />
        </Col>

        {/* Botão Finalizar */}
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" size="large" onClick={handleSave}>
            Solicitar Documentos
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default RequestDocuments;

const { Option } = Select;

const DriverSelect = ({ onSelect }: any) => {
  const [drivers, setDrivers] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [selectedValue, setSelectedValue] = useState<any>(null);

  const fetchDrivers = async (search: any) => {
    setFetching(true);
    try {
      const response = await api.get("driver", {
        params: {
          page: 1,
          name: search,
        },
      });

      const raw = response?.data?.response?.data ?? response?.data?.response ?? response?.data?.data ?? [];
      const data = Array.isArray(raw) ? raw : [];

      setDrivers(data);
    } catch (err) {
      console.error("Erro ao buscar motoristas", err);
      setDrivers([]);
    }
    setFetching(false);
  };

  const debounceFetcher = useCallback(useDebounce(fetchDrivers, 500), []);

  return (
    <Select
      showSearch
      value={selectedValue}
      allowClear
      labelInValue
      placeholder="Buscar motorista"
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={debounceFetcher}
      onSelect={(value) => {
        onSelect(value);
        setSelectedValue(null);
        setDrivers([]);
      }}
      style={{ width: "100%" }}
    >
      {(drivers || []).map((driver: any) => (
        <Option key={driver.idDriver} value={driver.idDriver}>
          {driver.name} - {driver.phone}
        </Option>
      ))}
    </Select>
  );
};
