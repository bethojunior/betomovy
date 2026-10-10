import { FC, useState, useEffect, useCallback } from "react";
import { Button, Modal, Form, Input, Radio, Select, notification } from "antd";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import api from "../../../../services/api";
import { Container, Header, StyledTable, ActionButtons, ModalFooter } from "./styles";
import { ManagerType, ManagerResponse, UserResponse, User } from "./types";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import Session from "../../../../utils/Session";

const { Option } = Select;

const formatCurrency = (value: string) => {
  const cleanValue = value.replace(/\D/g, '');
  const intValue = parseInt(cleanValue, 10);

  if (isNaN(intValue)) {
    return '0,00';
  }

  const formattedValue = (intValue / 100).toFixed(2).replace('.', ',');

  return formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const ManagerList: FC = () => {
  const [managers, setManagers] = useState<ManagerType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedManager, setSelectedManager] = useState<ManagerType | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [managerToDelete, setManagerToDelete] = useState<ManagerType | null>(null);
  const [allManagers, setAllManagers] = useState<User[]>([]);
  const history = useHistory();
  const [form] = Form.useForm();
  const cityId = Session.getLocal("citySelected")?.cityId;

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

  const fetchAllManagers = useCallback(async () => {
    try {
      const response = await api.get<UserResponse>("/manager/select/all");
      if (response.data.status) {
        setAllManagers(response.data.response);
      } else {
        notification.error({ message: response.data.message });
      }
    } catch (error) {
      notification.error({ message: "Erro ao carregar a lista de gestores" });
    }
  }, []);

  useEffect(() => {
    fetchManagers();
    fetchAllManagers();
  }, [fetchManagers, fetchAllManagers]);

  const handleEdit = (manager: ManagerType | null) => {
    setSelectedManager(manager);
    form.setFieldsValue({
      userId: manager?.user.idUser,
      valueCommission: formatCurrency(((manager?.valueCommission ?? 0) * 100).toString()),
      valueTypeCommission: manager?.valueTypeCommission,
      partnerCommission: formatCurrency(((manager?.partnerCommission ?? 0) * 100).toString()),
      partnerTypeCommission: manager?.partnerTypeCommission,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (manager: ManagerType) => {
    setManagerToDelete(manager);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (managerToDelete) {
      try {
        const response = await api.delete(`/manager/${managerToDelete.id}`);
        if (response.data.status) {
          swal("Sucesso", response.data.message, "success");
          fetchManagers();
        } else {
          swal("Erro", response.data.message, "error");
        }
      } catch (error) {
        swal("Erro", "Erro ao remover gestor", "error");
      } finally {
        setIsDeleteModalVisible(false);
        setManagerToDelete(null);
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedManager(null);
    form.resetFields();
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalVisible(false);
    setManagerToDelete(null);
  };

  const handleModalOk = async (values: any) => {
    if (selectedManager) {
      values.valueCommission = parseFloat(values.valueCommission.replace(/\./g, '').replace(',', '.'));
      values.partnerCommission = parseFloat(values.partnerCommission.replace(/\./g, '').replace(',', '.'));
      try {
        const response = await api.put(`/manager/${selectedManager.id}`, values);
        if (response.data.status) {
          swal("Sucesso", response.data.message, "success");
          fetchManagers();
          handleModalCancel();
        } else {
          swal("Erro", response.data.message, "error");
        }
      } catch (error) {
        swal("Erro", "Erro ao atualizar gestor", "error");
      }
    }
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: ['user', 'name'],
      key: "name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Telefone",
      dataIndex: ['user', 'phone'],
      key: "phone",
      width: 150,
      ellipsis: true,
    },
    {
      title: "E-mail",
      dataIndex: ['user', 'email'],
      key: "email",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Comissão",
      dataIndex: "valueCommission",
      key: "valueCommission",
      width: 100,
      ellipsis: true,
      render: (value: number) => formatCurrency((value * 100).toString()),
    },
    {
      title: "Tipo",
      dataIndex: "valueTypeCommission",
      key: "valueTypeCommission",
      width: 80,
      ellipsis: true,
    },
    {
      title: "Ação",
      key: "action",
      width: 80,
      render: (_: any, record: ManagerType) => (
        <ActionButtons>
          <Button icon={<AiFillEdit style={{ color: "blue" }} />} onClick={() => handleEdit(record)} />
          <Button icon={<AiFillDelete style={{ color: "red" }} />} onClick={() => handleDelete(record)} />
        </ActionButtons>
      ),
    },
  ];

  return (
    <Container>
      <Header>
        <Button type="primary" onClick={() => history.push("/manager/signupmanager")}>
          Adicionar Gestor
        </Button>
      </Header>
      <StyledTable
        columns={columns}
        dataSource={managers}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
      <Modal
        title={selectedManager ? "Editar Gestor" : "Adicionar Gestor"}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        style={{ marginTop: 20 }}
      >
        <Form form={form} onFinish={handleModalOk}>
          <Form.Item name="userId" label="Gestor" style={{ marginTop: 20 }}>
            <Select placeholder="Selecione um gestor">
              {allManagers.map(manager => (
                <Option key={manager.idUser} value={manager.idUser}>{manager.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Motorista" style={{ fontWeight: `bold` }}>
          </Form.Item>
          <Form.Item name="valueCommission" label="Valor" style={{ marginBottom: 0 }}>
            <Input
              type="text"
              onChange={(e) => {
                form.setFieldsValue({ valueCommission: formatCurrency(e.target.value) });
              }}
            />
          </Form.Item>
          <Form.Item name="valueTypeCommission" style={{ marginBottom: 0 }}>
            <Radio.Group>
              <Radio value="$" style={{ marginTop: 20 }}>$</Radio>
              <Radio value="%" style={{ marginBottom: 20 }}>%</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Cliente Comissionado" style={{ fontWeight: `bold` }}>
          </Form.Item>
          <Form.Item name="partnerCommission" label="Valor" style={{ marginBottom: 0 }}>
            <Input
              type="text"
              onChange={(e) => {
                form.setFieldsValue({ partnerCommission: formatCurrency(e.target.value) });
              }}
            />
          </Form.Item>
          <Form.Item name="partnerTypeCommission" style={{ marginBottom: 0 }}>
            <Radio.Group>
              <Radio value="$" style={{ marginTop: 20 }}>$</Radio>
              <Radio value="%" style={{ marginBottom: 20 }}>%</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <ModalFooter>
              <Button onClick={handleModalCancel} style={{ marginRight: 8 }}>Cancelar</Button>
              <Button type="primary" htmlType="submit">Confirmar</Button>
            </ModalFooter>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Remover Gestor"
        visible={isDeleteModalVisible}
        onCancel={handleDeleteModalCancel}
        onOk={confirmDelete}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <p>Deseja realmente remover o gestor {managerToDelete?.user.name}?</p>
      </Modal>
    </Container>
  );
};

export default ManagerList;