import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { CitiesType } from "../Coupon/types";
import { Button, Form, Input, Modal, Select, Table, Checkbox } from "antd";
import swal from "sweetalert";
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";

import {
  ContentPagination,
  Container,
  ContentTable,
  ContentBtnActions,
} from "./styles";

import Mask from "../../../../services/Mask";
      
import Alert from "../../../../components/Utils/Alert";
import { PromotionTypes } from "./types";

const TripPromotions = () => {
       
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<"success" | "info" | "warning" | "error">("success");
  const [promotions, setPromotions] = useState<PromotionTypes[]>([]);
  const [cities, setCities] = useState<CitiesType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modeEdit, setModeEdit] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>("voucher");
  const [initialLimitedTo, setInitialLimitedTo] = useState<number>(0);

  const locale = {
    emptyText: 'Nenhuma promoção Cadastrada',
  };

  const [form] = Form.useForm();
  const { Option } = Select;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const correctedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return correctedDate.toLocaleDateString('pt-BR');
  };

  const columns = [
    {
      title: "Cidade",
      dataIndex: "cityName",
      key: "cityName",
      width: 140,
      ellipsis: true,
    },
    {
      title: "Nome",
      dataIndex: "label",
      key: "label",
      width: 140,
      ellipsis: true,
    },
    {
      title: "Quantidade",
      dataIndex: "quantity",
      key: "quantity",
      width: 140,
      ellipsis: true,
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      width: 140,
      ellipsis: true,
      render: (type: string) => (
        <label>{type === "voucher" ? "Voucher" : "Corrida"}</label>
      ),
    },
    {
      title: "Válido para corridas até",
      dataIndex: "limitedTo",
      key: "limitedTo",
      width: 200,
      ellipsis: true,
      render: (limitedTo: number | null) => (
        <label>{limitedTo ? Mask.setMaskMoneyNumber(limitedTo) : "-"}</label>
      ),
    },
    {
      title: "Início",
      dataIndex: "startDay",
      key: "startDay",
      width: 140,
      ellipsis: true,
      render: (startDay: string) => (
        <label>{formatDate(startDay)}</label>
      ),
    },
    {
      title: "Fim",
      dataIndex: "endDay",
      key: "endDay",
      width: 140,
      ellipsis: true,
      render: (endDay: string) => (
        <label>{formatDate(endDay)}</label>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      ellipsis: true,
      render: (status: number) => (
        <label>{status ? "Ativo" : "Inativo"}</label>
      ),
    },
    {
      title: "Ações",
      dataIndex: "",
      key: "",
      width: 140,
      ellipsis: true,
      render: (item: PromotionTypes) => (
        <ContentBtnActions>
          <Button
            onClick={() => {
              setModeEdit(true);
              form.setFieldsValue({
                ...item,
                cityId: (item.cityId as any)?.id ?? item.cityId,
                limitedTo: item.limitedTo !== null ? Mask.setMaskMoneyNumber(item.limitedTo as number) : "",
              });
              setInitialLimitedTo(item.limitedTo !== null ? item.limitedTo as number : 0);
              setSelectedType(item.type);
              setShowModal(true);
            }}
            icon={<AiFillEdit style={{ color: "blue" }} />}
          />

          <Button
            onClick={() => remove(item.id)}
            icon={<AiFillDelete style={{ color: "red" }} />}
          />
        </ContentBtnActions>
      ),
    },
  ];

  const getPromotions = async (citiesData: CitiesType[]) => {
    setLoadingTable(true);
    try {
      const { data } = await api.get('sale');

      if (!data.status) {
        setMessageAlert(data.message);
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      const promotionsWithCityName = data.response.map((promotion: PromotionTypes) => {
        const cityId = (promotion.cityId as any)?.id ?? promotion.cityId;
        const city = citiesData.find((city) => city.cityId === cityId);
        return {
          ...promotion,
          cityName: city ? city.nome : 'Unknown',
        };
      });

      setPromotions(promotionsWithCityName);
    } catch (error) {
      setMessageAlert("Erro ao carregar promoções");
      setTypeAlert("error");
      setShowAlert(true);
    } finally {
      setLoadingTable(false);
    }
  };

  const fetchCities = async () => {
    try {
      const { data } = await api.get("city/actives/fully");
      if (!data.status) {
        setMessageAlert(data.message);
        setTypeAlert("error");
        setShowAlert(true);
        return [];
      }

      setCities(data.response);
      return data.response;
    } catch (error) {
      setMessageAlert("Erro ao carregar cidades");
      setTypeAlert("error");
      setShowAlert(true);
      return [];
    }
  };

  useEffect(() => {
    const fetchCitiesAndPromotions = async () => {
      setLoadingTable(true);
      const citiesData = await fetchCities();
      await getPromotions(citiesData);
      setLoadingTable(false);
    };

    fetchCitiesAndPromotions();
  }, []);

  const remove = async (id: number) => {
    swal({
      title: "Deseja remover essa promoção?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
    }).then(async (answer) => {
      if (!answer) {
        return;
      }

      setLoadingTable(true);
      try {
        const { data } = await api.delete(`sale/${id}`);

        if (!data.status) {
          setMessageAlert(
            "Ocorreu um erro ao deletar a promoção, tente novamente"
          );
          setTypeAlert("error");
          setShowAlert(true);
          return;
        }

        setMessageAlert("Promoção deletada com sucesso!");
        setTypeAlert("success");
        getPromotions(cities);
      } catch (error) {
        setMessageAlert("Erro ao deletar promoção");
        setTypeAlert("error");
        setShowAlert(true);
      } finally {
        setLoadingTable(false);
      }
    });
  };

  const handleSubmit = async (values: PromotionTypes) => {
    const { label, cityId, type, limitedTo, quantity, startDay, endDay, status } = values;
    setLoadingTable(true);

    try {
      const formattedLimitedTo = typeof limitedTo === "string"
        ? parseFloat(limitedTo.replace(/\./g, '').replace(',', '.'))
        : limitedTo;

      const payload = {
        label,
        cityId,
        type,
        limitedTo: type === "trip" ? (formattedLimitedTo || initialLimitedTo) : 0,
        quantity,
        startDay,
        endDay,
        status: status ? 1 : 0,
      };

      let response;

      if (modeEdit) {
        response = await api.put(`sale/${values.id}`, payload);
      } else {
        response = await api.post("sale", payload);
      }

      if (!response.data.status) {
        const errorMessage = response.data.response || "Ocorreu um erro ao adicionar a promoção, tente novamente";
        setMessageAlert(errorMessage);
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      swal({
        title: "Sucesso!",
        text: `Promoção ${modeEdit ? "editada" : "adicionada"} com sucesso!`,
        icon: "success",
        buttons: {
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "",
            closeModal: true,
          },
        },
      }).then(() => {
        setShowModal(false);
        form.resetFields();
        setSelectedType("voucher");
        setInitialLimitedTo(0);
        getPromotions(cities);
      });

      setShowModal(false);
      form.resetFields();
      setSelectedType("voucher");
      setInitialLimitedTo(0);
      getPromotions(cities);
    } catch (error) {
      const errorMessage = (error as any).response?.data?.response || `Erro ao ${modeEdit ? "editar" : "adicionar"} a promoção, tente novamente`;
      setMessageAlert(errorMessage);
      setTypeAlert("error");
      setShowAlert(true);
    } finally {
      setLoadingTable(false);
    }
  };

  return (
    <Container>
       
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <Button
        type="primary"
        onClick={() => {
          setShowModal(true);
          setModeEdit(false);
          form.resetFields();
          setSelectedType("voucher");
          setInitialLimitedTo(0);
        }}
      >
        Adicionar Promoção
      </Button>

      <ContentTable>
        <Table locale={locale} columns={columns} dataSource={promotions} pagination={false} loading={loadingTable}/>
      </ContentTable>

      <ContentPagination>
        <Button
          onClick={() => getPromotions(cities)}
          icon={<AiOutlineArrowLeft />}
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        />

        <Button
          onClick={() => getPromotions(cities)}
          icon={<AiOutlineArrowRight />}
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        />
      </ContentPagination>
      <Modal
        title={modeEdit ? "Editar Promoção" : "Adicionar Promoção"}
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          setSelectedType("voucher");
          form.resetFields();
          setInitialLimitedTo(0);
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical" name="form">
          <Form.Item name="id" style={{ display: "none" }} />
          <Form.Item
            name="label"
            label="Nome"
            rules={[
              {
                required: true,
                message: "Insira o nome da promoção",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cityId"
            label="Cidade"
            rules={[
              {
                required: true,
                message: "Selecione a cidade",
              },
            ]}
          >
            <Select>
              {cities?.map((city) => (
                <Option key={city.cityId} value={city.cityId}>
                  {city.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="type"
            label="Tipo"
            rules={[
              {
                required: true,
                message: "Selecione o tipo",
              },
            ]}
          >
            <Select onChange={(value) => {
              setSelectedType(value);
              form.setFieldsValue({
                type: value,
                limitedTo: value === "trip" ? form.getFieldValue("limitedTo") : ""
              });
            }}>
              <Option key="voucher" value="voucher">
                Voucher
              </Option>
              <Option key="trip" value="trip">
                Corrida
              </Option>
            </Select>
          </Form.Item>
          {selectedType === "trip" && (
            <Form.Item
              name="limitedTo"
              label="Valor máximo da corrida"
            >
              <Input
                value={form.getFieldValue("limitedTo")}
                onChange={(e) => {
                  form.setFieldsValue({
                    limitedTo: Mask.setMaskMoney(e.target.value)
                  });
                }}
              />
            </Form.Item>
          )}
          <Form.Item label=" ">
            <Form.Item name="status" valuePropName="checked" style={{ marginTop: -30 }}>
              <Checkbox>Ativar promoção</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantidade"
            style={{ marginTop: -30 }}
            rules={[
              {
                required: true,
                message: "Insira a quantidade",
              },
            ]}
          >
            <Input type="number" min={0} step={1} />
          </Form.Item>
          <Form.Item
            name="startDay"
            label="Data de início"
            rules={[
              {
                required: true,
                message: "Insira a data de início",
              },
              {
                validator(_, value) {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const yesterday = new Date(today);
                  yesterday.setDate(yesterday.getDate() - 1);
                  const startDate = new Date(value);
                  startDate.setHours(0, 0, 0, 0);

                  if (startDate < yesterday) {
                    return Promise.reject(new Error("A data de início deve ser a partir de hoje."));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="date" min={new Date().toISOString().split("T")[0]} />
          </Form.Item>
          <Form.Item
            name="endDay"
            label="Data de fim"
            rules={[
              {
                required: true,
                message: "Insira a data de fim",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startDate = new Date(getFieldValue("startDay"));
                  startDate.setHours(0, 0, 0, 0);
                  const endDate = new Date(value);
                  endDate.setHours(0, 0, 0, 0);
                  const maxEndDate = new Date(startDate);
                  maxEndDate.setFullYear(maxEndDate.getFullYear() + 5);

                  if (endDate < startDate) {
                    return Promise.reject(new Error("A data de término deve ser igual ou após a data de início."));
                  }
                  if (endDate > maxEndDate) {
                    return Promise.reject(new Error("A data de término não pode ser mais que 5 anos a partir da data de início."));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input type="date" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Criar
          </Button>
        </Form>
      </Modal>
    </Container>
  );
};

export default TripPromotions;