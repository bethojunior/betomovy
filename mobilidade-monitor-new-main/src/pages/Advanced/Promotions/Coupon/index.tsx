import { Button, Form, Input, Modal, Radio, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import swal from "sweetalert";

import { Container, ContentTable } from "./styles";

import { CitiesType, CouponType, PaymentType } from "./types";
      
import Alert from "../../../../components/Utils/Alert";
import api from "../../../../services/api";
import { AiFillDelete } from "react-icons/ai";
import Mask from "../../../../services/Mask";

export const Coupon = () => {
       
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [listCoupon, setListCoupon] = useState<CouponType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [cities, setCities] = useState<CitiesType[]>([]);
  const [payment, setPayment] = useState<PaymentType[]>([]);
  const [genre, setGenre] = useState<any>([]);
  const [disableMaxValue, setDisableMaxValue] = useState(false);

  const [form] = Form.useForm();
  const { Option } = Select;

  const getCoupon = async () => {
    setLoadingTable(true);
    const { data } = await api("discountCoupon");

    setLoadingTable(false);
    if (!data.status) {
      setMessageAlert(
        "Ocorreu um erro ao carregar as informações, tente novamente"
      );
      setTypeAlert("error");
      setShowAlert(true);
      return;
    }

    setListCoupon(data.response);
  };

  useEffect(() => {
    setLoadingTable(true);
    const coupon = api("discountCoupon");
    const paymentForm = api("tripPaymentForm");
    const cities = api("city/actives/fully");
    const gender = api("gender");

    Promise.all([coupon, paymentForm, cities, gender]).then((result) => {
      setLoadingTable(false);
      if (!result[0].data.status) {
        setMessageAlert(
          "Ocorreu um erro ao carregar as informações, tente novamente"
        );
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setListCoupon(result[0].data.response);
      setPayment(result[1].data.response);
      setCities(result[2].data.response);
      setGenre(result[3].data.response);
    });
  }, []);

  const columns = [
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Validade",
      dataIndex: "dateEnd",
      key: "dateEnd",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      width: 150,
      ellipsis: true,
      render: (value: number) => (
        <label>{Mask.setMaskMoneyNumber(value)}</label>
      ),
    },
    {
      title: "Valor máximo",
      dataIndex: "maxDiscountValue",
      key: "maxDiscountValue",
      width: 150,
      ellipsis: true,
      render: (maxDiscountValue: number) => (
        <label>{Mask.setMaskMoneyNumber(maxDiscountValue)}</label>
      ),
    },
    {
      title: "Cidade",
      dataIndex: "city",
      key: "city",
      width: 150,
      ellipsis: true,
      render: (city: any) => <label>{city ? city.nome : "Todas"}</label>,
    },
    {
      title: "Gênero",
      dataIndex: "gender",
      key: "gender",
      width: 150,
      ellipsis: true,
      render: (gender: any) => <label>{gender ? gender.name : "Todos"}</label>,
    },
    {
      title: "Forma de pagamento",
      dataIndex: "trip_payment_form",
      key: "trip_payment_form",
      width: 200,
      ellipsis: true,
      render: (payment: any) => (
        <label>{payment ? payment.name : "Todos"}</label>
      ),
    },
    {
      title: "Desativar",
      dataIndex: "",
      key: "",
      width: 150,
      ellipsis: true,
      render: (item: CouponType) => {
        if (item.active === 1) {
          return (
            <Button onClick={() => disable(item.id)} icon={<AiOutlineLock />} />
          );
        } else {
          return (
            <Button
              style={{ backgroundColor: "grey" }}
              onClick={() => able(item.id)}
              icon={<AiOutlineUnlock />}
            />
          );
        }
      },
    },
    {
      title: "Excluir",
      dataIndex: "",
      key: "",
      width: 100,
      ellipsis: true,
      render: (item: CouponType) => (
        <Button
          onClick={() => remove(item.id)}
          icon={<AiFillDelete style={{ color: "red" }} />}
        ></Button>
      ),
    },
  ];

  const remove = async (id: number) => {
    swal({
      title: "Deseja deletar esse cupom?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
    }).then(async (answer) => {
      if (!answer) {
        return;
      }
      setLoadingTable(true);
      const { data } = await api.delete(`discountCoupon/${id}`);

      setLoadingTable(false);
      if (!data.status) {
        setMessageAlert("Ocorreu um erro ao deletar cupom, tente novamente");
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setMessageAlert("Deletado com sucesso!");
      setTypeAlert("success");
      setShowAlert(true);
      getCoupon();
    });
  };

  const disable = async (id: number) => {
    swal({
      title: "Deseja desativar esse cupom?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
    }).then(async (answer) => {
      if (!answer) {
        return;
      }
      setLoadingTable(true);
      const { data } = await api.put(`discountCoupon/${id}/disable`);

      setLoadingTable(false);
      if (!data.status) {
        setMessageAlert("Ocorreu um erro ao desativar cupom, tente novamente");
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setMessageAlert("Desativado com sucesso!");
      setTypeAlert("success");
      setShowAlert(true);
      getCoupon();
    });
  };

  const able = async (id: number) => {
    swal({
      title: "Deseja ativar esse cupom?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
    }).then(async (answer) => {
      if (!answer) {
        return;
      }
      setLoadingTable(true);
      const { data } = await api.put(`discountCoupon/${id}/enable`);

      setLoadingTable(false);
      if (!data.status) {
        setMessageAlert("Ocorreu um erro ao ativar cupom, tente novamente");
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setMessageAlert("Ativado com sucesso!");
      setTypeAlert("success");
      setShowAlert(true);
      getCoupon();
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const {
        code,
        cityId,
        tripPaymentFormId,
        fromValue,
        limitedTo,
        value,
        maxDiscountValue,
        dateStart,
        dateEnd,
        bonusDriver,
        uniqueUse,
        genderId,
        typeDiscount,
      } = values;

      if (parseFloat(fromValue) > parseFloat(limitedTo)) {
        setMessageAlert("Valor inicial não pode ser maior que o final");
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }
      setLoadingTable(true);

      api
        .post("discountCoupon", {
          bonusDriver: bonusDriver || true,
          cityId,
          code,
          dateEnd,
          dateStart,
          fromValue: Mask.setRemoveMaskMoney(fromValue),
          genderId,
          limitedTo: Mask.setRemoveMaskMoney(limitedTo),
          maxDiscountValue: Mask.setRemoveMaskMoney(maxDiscountValue),
          tripPaymentFormId,
          uniqueUse: uniqueUse || true,
          value: Mask.setRemoveMaskMoney(value),
          valueType: typeDiscount || "%",
        })
        .then((result) => {
          const { response } = result.request;

          setLoadingTable(false);
          if (!JSON.parse(response).status || !result.data.status) {
            setMessageAlert(JSON.parse(response).response[0]);
            setTypeAlert("error");
            setShowAlert(true);
            return;
          }

          setShowModal(false);
          form.resetFields();
          setDisableMaxValue(false);
          setMessageAlert("Cupom criado com sucesso!");
          setTypeAlert("success");
          setShowAlert(true);
          getCoupon();
        });
    } catch (e: any) {
      setMessageAlert(e);
      setTypeAlert("error");
      setShowAlert(true);
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
      <Button type="primary" onClick={() => setShowModal(true)}>
        Novo cupom
      </Button>
      <ContentTable>
        <Table pagination={false} columns={columns} dataSource={listCoupon} loading={loadingTable}/>
      </ContentTable>
      <Modal
        title="Novo cupom"
        open={showModal}
        footer={null}
        onCancel={() => {
          setShowModal(false);
        }}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical" name="form">
          <div>
            <Form.Item
              name="code"
              label="Código do cupom"
              rules={[
                {
                  required: true,
                  message: "Insira o código do cupom",
                },
              ]}
            >
              <Input type="text" />
            </Form.Item>

            <Form.Item name="cityId" label="Cidades">
              <Select defaultValue={0}>
                <Option value={0}>Todas</Option>
                {cities?.map((city) => (
                  <Option key={city.cityId} value={city.cityId}>
                    {city.nome}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="tripPaymentFormId" label="Tipo de pagamento">
              <Select defaultValue={0}>
                <Option value={0}>Todos</Option>
                {payment?.map((payment) => (
                  <Option
                    key={payment.idTripPaymentForm}
                    value={payment.idTripPaymentForm}
                    onChange={() =>
                      form.setFieldValue(
                        "tripPaymentFormId",
                        payment.idTripPaymentForm
                      )
                    }
                  >
                    {payment.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Item
                name="fromValue"
                initialValue="0,00"
                label="Valor inicial"
                rules={[
                  {
                    required: true,
                    message: "Insira o valor inicial",
                  },
                ]}
              >
                <Input
                  value={form.getFieldValue("fromValue")}
                  onChange={(e) => {
                    form.setFieldValue(
                      "fromValue",
                      Mask.setMaskMoney(e.target.value)
                    );
                  }}
                />
              </Form.Item>
              <Form.Item
                name="limitedTo"
                label="Valor até"
                initialValue="0,00"
                rules={[
                  {
                    required: true,
                    message: "Insira o valor até",
                  },
                ]}
              >
                <Input
                  value={form.getFieldValue("limitedTo")}
                  onChange={(e) => {
                    form.setFieldValue(
                      "limitedTo",
                      Mask.setMaskMoney(e.target.value)
                    );
                  }}
                />
              </Form.Item>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Item
                  name="value"
                  label="Desconto"
                  initialValue="0,00"
                  rules={[
                    {
                      required: true,
                      message: "Insira o valor de desconto",
                    },
                  ]}
                >
                  <Input
                    value={form.getFieldValue("value")}
                    onChange={(e) => {
                      form.setFieldValue(
                        "value",
                        Mask.setMaskMoney(e.target.value)
                      );
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="typeDiscount"
                  style={{ alignSelf: "flex-end", marginLeft: 10 }}
                >
                  <Radio.Group defaultValue="%">
                    <Radio
                      key="%"
                      value="%"
                      onChange={(e) => {
                        setDisableMaxValue(false);
                        form.setFieldValue("typeDiscount", e.target.value);
                      }}
                    >
                      %
                    </Radio>
                    <Radio
                      key="$"
                      value="$"
                      onChange={(e) => {
                        setDisableMaxValue(true);
                        form.setFieldValue("typeDiscount", e.target.value);
                      }}
                    >
                      $
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
              <Form.Item
                name="maxDiscountValue"
                initialValue="0,00"
                label="Valor máximo"
                rules={[
                  {
                    required: !disableMaxValue,
                    message: "Insira o valor máximo",
                  },
                ]}
              >
                <Input
                  value={form.getFieldValue("maxDiscountValue")}
                  onChange={(e) => {
                    form.setFieldValue(
                      "maxDiscountValue",
                      Mask.setMaskMoney(e.target.value)
                    );
                  }}
                  disabled={disableMaxValue}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="dateStart"
              label="Data início"
              rules={[
                {
                  required: true,
                  message: "Insira a data de início",
                },
              ]}
            >
              <Input type="datetime-local" />
            </Form.Item>
            <Form.Item
              name="dateEnd"
              label="Data final"
              rules={[
                {
                  required: true,
                  message: "Insira a data final",
                },
              ]}
            >
              <Input type="datetime-local" />
            </Form.Item>
            <Form.Item name="bonusDriver" label="Gestor do desconto">
              <Radio.Group defaultValue={true}>
                <Radio
                  key={1}
                  value={true}
                  onChange={() => form.setFieldValue("bonusDriver", true)}
                >
                  Motorista
                </Radio>
                <Radio
                  key={2}
                  value={false}
                  onChange={() => form.setFieldValue("bonusDriver", false)}
                >
                  App
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="uniqueUse" label="Limite por usuário">
              <Radio.Group defaultValue={true}>
                <Radio
                  key={0}
                  value={true}
                  onChange={() => form.setFieldValue("uniqueUse", true)}
                >
                  Única vez
                </Radio>
                <Radio
                  key={1}
                  value={false}
                  onChange={() => form.setFieldValue("uniqueUse", false)}
                >
                  Sem limites
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="genderId" label="Público">
              <Radio.Group defaultValue={1}>
                {genre?.map((item: { id: number; name: string }) => (
                  <Radio
                    key={item.id}
                    value={item.id}
                    onChange={() => form.setFieldValue("genderId", item.id)}
                  >
                    {item.name}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Button
              style={{
                width: "100%",
              }}
              type="primary"
              htmlType="submit"
            >
              Criar
            </Button>
          </div>
        </Form>
      </Modal>
    </Container>
  );
};
