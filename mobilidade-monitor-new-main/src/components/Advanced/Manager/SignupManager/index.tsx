import { FC, useState, useEffect, useCallback } from "react";
import { Button, Form, Input, Radio, Select } from "antd";
import { useHistory } from "react-router-dom";
import api from "../../../../services/api";
import swal from "sweetalert";
import { Container, ModalFooter } from "./styles";
import { UserResponse, User } from "./types";
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

const SignupManager: FC = () => {
  const [allManagers, setAllManagers] = useState<User[]>([]);
  const history = useHistory();
  const [form] = Form.useForm();
  const cityId = Session.getLocal("citySelected").cityId;

  const fetchAllManagers = useCallback(async () => {
    try {
      const response = await api.get<UserResponse>("/manager/select/all");
      if (response.data.status) {
        setAllManagers(response.data.response);
      } else {
        swal("Erro", response.data.message, "error");
      }
    } catch (error) {
      swal("Erro", "Erro ao carregar a lista de gestores", "error");
    }
  }, []);

  useEffect(() => {
    fetchAllManagers();
  }, [fetchAllManagers]);

  const handleSubmit = async (values: any) => {
    values.motValueCommission = values.motValueCommission ? parseFloat(values.motValueCommission.replace(/\./g, '').replace(',', '.')) : 0;
    values.cliValueCommission = values.cliValueCommission ? parseFloat(values.cliValueCommission.replace(/\./g, '').replace(',', '.')) : 0;
    values.cityId = cityId;

    try {
      const response = await api.post("/manager/", values);
      if (response.data.status) {
        swal("Sucesso", response.data.response, "success").then(() => {
          history.push("/manager");
        });
      } else {
        swal("Erro", response.data.message, "error");
      }
    } catch (error) {
      swal("Erro", "Erro ao cadastrar gestor", "error");
    }
  };

  return (
    <Container>
      <h1>Cadastrar Gestor</h1>
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          motValueTypeCommission: "$",
          cliValueTypeCommission: "$",
        }}
      >
        <Form.Item name="userId" label="Gestor" style={{ marginTop: 20 }} rules={[{ required: true, message: 'Selecione um gestor' }]}>
          <Select placeholder="Selecione um gestor">
            {allManagers.map(manager => (
              <Option key={manager.idUser} value={manager.idUser}>{manager.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Motorista" style={{ fontWeight: `bold` }}></Form.Item>
        <Form.Item name="motValueCommission" label="Valor" style={{ marginBottom: 0 }}>
          <Input
            type="text"
            onChange={(e) => {
              form.setFieldsValue({ motValueCommission: formatCurrency(e.target.value) });
            }}
          />
        </Form.Item>
        <Form.Item name="motValueTypeCommission" style={{ marginBottom: 0 }}>
          <Radio.Group>
            <Radio value="$" style={{ marginTop: 20 }}>$</Radio>
            <Radio value="%" style={{ marginBottom: 20 }}>%</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Cliente Comissionado" style={{ fontWeight: `bold` }}></Form.Item>
        <Form.Item name="cliValueCommission" label="Valor" style={{ marginBottom: 0 }}>
          <Input
            type="text"
            onChange={(e) => {
              form.setFieldsValue({ cliValueCommission: formatCurrency(e.target.value) });
            }}
          />
        </Form.Item>
        <Form.Item name="cliValueTypeCommission" style={{ marginBottom: 0 }}>
          <Radio.Group>
            <Radio value="$" style={{ marginTop: 20 }}>$</Radio>
            <Radio value="%" style={{ marginBottom: 20 }}>%</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <ModalFooter>
            <Button onClick={() => history.push("/manager")} style={{ marginRight: 8 }}>Cancelar</Button>
            <Button type="primary" htmlType="submit">Confirmar</Button>
          </ModalFooter>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default SignupManager;
