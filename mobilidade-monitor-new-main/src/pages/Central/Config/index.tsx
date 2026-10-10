import { useEffect, useState } from "react";
import api from "../../../services/api";
import Preload from "../../../components/Utils/Preload";
import Alert from "../../../components/Utils/Alert";
import {
  CallType,
  CentralType,
  FeeType,
  PaymentType,
  PricesType,
  TripTypes,
} from "./types";
import { TripTypeArray } from "../../../components/Advanced/Config/ManagementCall/Panel/TypeCall";
import {
  Button,
  Checkbox,
  Collapse,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Switch,
  Table,
} from "antd";

import { Content, ContentTable } from "./styles";

import Mask from "../../../services/Mask";
import { AiFillDelete } from "react-icons/ai";
import swal from "sweetalert";
import Session from "../../../utils/Session";

const citySelected = Session.getLocal("citySelected")?.cityId;

export const Config = () => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [fee, setFee] = useState<FeeType>({} as FeeType);
  const [configFinish, setConfigFinish] = useState("0");
  //@ts-ignore
  const [paymentForm, setPaymentForm] = useState<PaymentType[]>([]);
  const [callTypes, setCallTypes] = useState<CallType[]>([]);
  const [tripType, setTripType] = useState<TripTypeArray>([]);
  const [listCentral, setListCentral] = useState<CentralType[]>([]);
  const [listPrices, setListPrices] = useState<PricesType[]>([]);
  const [card, setCard] = useState(0);
  const [pix, setPix] = useState(0);
  const [changeCallType, setChangeCallType] = useState<any>([]);
  const [monitoring, setMonitoring] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalCentral, setShowModalCentral] = useState(false);
  const [howCentralShow, setHowCentralShow] = useState<any>([]);

  const { Panel } = Collapse;
  const { TextArea } = Input;
  const { Option } = Select;

  const [form] = Form.useForm();

  const columns = [
    {
      title: "Central",
      dataIndex: "centrals",
      key: "centrals",
      width: 150,
      render: (centrals: CentralType[]) => {
        if (centrals.length === 1) {
          return <label>{centrals[0].name}</label>;
        } else {
          return (
            <Button
              type="primary"
              onClick={() => {
                setHowCentralShow(centrals);
                setShowModalCentral(true);
              }}
            >
              ver
            </Button>
          );
        }
      },
    },
    {
      title: "Inicial",
      dataIndex: "min_value",
      key: "min_value",
      width: 150,
      render: (min_value: number) => (
        <label>{Mask.setMaskMoneyNumber(min_value)}</label>
      ),
    },
    {
      title: "Final",
      dataIndex: "max_value",
      key: "max_value",
      width: 150,
      render: (max_value: number) => (
        <label>{Mask.setMaskMoneyNumber(max_value)}</label>
      ),
    },
    {
      title: "Fixo",
      dataIndex: "new_value",
      key: "new_value",
      width: 150,
      render: (new_value: number) => (
        <label>{Mask.setMaskMoneyNumber(new_value)}</label>
      ),
    },
    {
      title: "Tipo",
      dataIndex: "trip_type",
      key: "trip_type",
      width: 150,
      render: (trip_type: TripTypes) => <label>{trip_type.type}</label>,
    },
    {
      title: "Excluir",
      dataIndex: "",
      key: "",
      width: 100,
      ellipsis: true,
      render: (item: PricesType) => (
        <Button
          onClick={() => removePrice(item.id)}
          icon={<AiFillDelete style={{ color: "red", fontSize: 20 }} />}
        />
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);

    const getFee = api("central/fee");
    const finish = api("config/end_trip_only_by_central");
    const payment = api("central/voucherPurchasePayment/findAll");
    const call = api("central/centralCallTypes/findAll");
    const trip = api("tripType");
    const central = api("central");
    const prices = api(`central/priceRange?cityId=${citySelected}`);

    Promise.all([getFee, finish, payment, call, trip, central, prices]).then(
      (result) => {
        setLoading(false);
        if (!result[0].data.status) {
          setMessageAlert(
            "Ocorreu um erro ao carregar as informações, tente novamente"
          );
          setTypeAlert("error");
          setShowAlert(true);
          return;
        }

        setFee(result[0].data.response);
        setConfigFinish(result[1].data.response);
        setPaymentForm(result[2].data.response);
        setCallTypes(result[3].data.response);
        setTripType(result[4].data.response);
        setListCentral(result[5].data.response);
        setListPrices(result[6].data.response);

        result[2].data.response.map((el: PaymentType) => {
          if (el.paymentFormId === 1) {
            setCard(el.isActive);
          }
          if (el.paymentFormId === 4) {
            setPix(el.isActive);
          }
        });

        let aux: { centralCallTypeId: number; isActive: number }[] = [];

        result[3].data.response.map((item: CallType) => {
          aux.push({
            centralCallTypeId: item.centralCallTypeId,
            isActive: item.isActive,
          });
        });

        setChangeCallType(aux);
      }
    );
  }, []);

  const updateFee = async () => {
    api
      .post("central/fee", {
        isByKm: fee.isByKm,
        paidByCentral: fee.paidByCentral,
        returnFee:
          typeof fee.returnFee === "number"
            ? fee.returnFee
            : Number(Mask.setRemoveMaskMoney(fee.returnFee)),
      })
      .then(({ data }) => {
        if (!data.status) {
          setMessageAlert(
            "Ocorreu um erro ao atualizar a taxa, tente novamente"
          );
          setTypeAlert("error");
          setShowAlert(true);
          return;
        }

        setMessageAlert("Taxa atualizada com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
      });
  };

  const updateFinishTrip = async () => {
    setLoading(true);
    api
      .put("config", {
        end_trip_only_by_central: configFinish,
      })
      .then(({ data }) => {
        setLoading(false);
        if (!data.status) {
          setMessageAlert(
            "Ocorreu um erro ao atualizar a configuração, tente novamente"
          );
          setTypeAlert("error");
          setShowAlert(true);
          return;
        }

        setMessageAlert("Configuração atualizada com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
      });
  };

  const updatePaymentForm = async () => {
    setLoading(true);
    api
      .put("central/voucherPurchasePayment/updatePaymentForm", [
        {
          isActive: card,
          paymentFormId: 1,
        },
        {
          isActive: pix,
          paymentFormId: 4,
        },
      ])
      .then(({ data }) => {
        setLoading(false);
        if (!data.status) {
          setMessageAlert(
            "Ocorreu um erro ao atualizar a configuração, tente novamente"
          );
          setTypeAlert("error");
          setShowAlert(true);
          return;
        }

        setMessageAlert("Configuração atualizada com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
      });
  };

  const changeValue = async (index: number, value: boolean) => {
    setMonitoring(!monitoring);
    callTypes[index].isActive = value === true ? 1 : 0;
    setCallTypes(callTypes);

    changeCallType[index].isActive = value;
    setChangeCallType(changeCallType);
  };

  const updateCallType = async () => {
    setLoading(true);
    api
      .put("central/centralCallTypes/update", changeCallType)
      .then(({ data }) => {
        setLoading(false);
        if (!data.status) {
          setMessageAlert(
            "Ocorreu um erro ao atualizar a configuração, tente novamente"
          );
          setTypeAlert("error");
          setShowAlert(true);
          return;
        }

        setMessageAlert("Configuração atualizada com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
      });
  };

  const getPrices = async () => {
    setLoading(true);
    api(`central/priceRange?cityId=${citySelected}`).then(({ data }) => {
      if (!data.status) {
        setLoading(false);
        setMessageAlert("Erro ao listar faixa de preço, tente novamente");
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setLoading(false);
      setListPrices(data.response);
    });
  };

  const removePrice = async (id: number) => {
    swal({
      title: "Realmente deseja excluir essa faixa de preço?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
    }).then((answer) => {
      if (!answer) {
        return;
      }

      setLoading(true);
      api.delete(`central/priceRange/${id}`).then(({ data }) => {
        if (!data.status) {
          setLoading(false);
          setMessageAlert("Erro ao deletar faixa de preço, tente novamente");
          setTypeAlert("error");
          setShowAlert(true);
          return;
        }

        setMessageAlert("Faixa de preço deletada com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
        getPrices();
      });
    });
  };

  const handleSubmit = async (values: any) => {
    let {
      centralId,
      description,
      max_value,
      min_value,
      new_value,
      tripTypeId,
    } = values;

    max_value = Mask.setRemoveMaskMoney(max_value);
    min_value = Mask.setRemoveMaskMoney(min_value);
    new_value = Mask.setRemoveMaskMoney(new_value);

    if (max_value === 0 || min_value === 0 || new_value === 0) {
      setMessageAlert("Os valores não podem ser zero");
      setTypeAlert("warning");
      setShowAlert(true);
      return;
    }

    if (min_value > max_value) {
      setMessageAlert("O valor inicial não pode ser maior que o final");
      setTypeAlert("warning");
      setShowAlert(true);
      return;
    }

    setLoading(true);
    api
      .post("central/priceRange", {
        centralId: [centralId],
        cityId: citySelected,
        description,
        max_value,
        min_value,
        new_value,
        tripTypeId,
      })
      .then(({ data }) => {
        setLoading(false);

        if (!data.status) {
          setMessageAlert("Erro ao criar faixa de preço, tente novamente");
          setTypeAlert("error");
          setShowAlert(true);
          return;
        }

        setShowModal(false);
        setMessageAlert("Faixa de preço criada com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
        form.resetFields();
        getPrices();
      });
  };

  return (
    <div>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <Content>
        <Collapse ghost>
          <Panel header="Taxa de retorno de entrega (maquineta)" key="1">
            <div>
              <Radio.Group
                defaultValue={fee?.isByKm === 1 ? 1 : 0}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <Radio
                  key={0}
                  value={0}
                  onClick={() =>
                    setFee({
                      ...fee,
                      isByKm: 0,
                    })
                  }
                >
                  Taxa fixa
                </Radio>
                <Radio
                  key={1}
                  value={1}
                  onClick={() =>
                    setFee({
                      ...fee,
                      isByKm: 1,
                    })
                  }
                >
                  Taxa por km
                </Radio>
              </Radio.Group>
              <div style={{ display: "flex", marginTop: 20 }}>
                <p style={{ marginRight: 5, fontSize: 15 }}>
                  Pago pela central
                </p>
                <Switch
                  checked={fee?.paidByCentral === 1}
                  onChange={(e) => {
                    setFee({
                      ...fee,
                      paidByCentral: e === false ? 0 : 1,
                    });
                  }}
                />
              </div>
              <Input
                style={{ marginBottom: 10, marginTop: 5 }}
                onChange={(e) =>
                  setFee({
                    ...fee,
                    returnFee: Mask.setMaskMoney(e.target.value),
                  })
                }
                value={fee?.returnFee}
              />
              <Button
                style={{
                  width: "100%",
                }}
                type="primary"
                onClick={updateFee}
              >
                Salvar
              </Button>
            </div>
          </Panel>
          <Panel
            header="Finalizar a viagem apenas pela central, essa opção é apenas válida para viagem com retorno a central"
            key="2"
          >
            <div style={{ display: "block" }}>
              <div style={{ marginBottom: 15 }}>
                <Radio.Group defaultValue={configFinish === "1" ? "1" : "0"}>
                  <Radio key="1" value="1" onClick={() => setConfigFinish("1")}>
                    Ativar
                  </Radio>
                  <Radio key="0" value="0" onClick={() => setConfigFinish("0")}>
                    Desativar
                  </Radio>
                </Radio.Group>
              </div>
              <Button
                style={{
                  width: "100%",
                }}
                type="primary"
                onClick={updateFinishTrip}
              >
                Salvar
              </Button>
            </div>
          </Panel>
          <Panel header="Forma de pagamento da Compra de Voucher" key="3">
            <div>
              <div style={{ marginBottom: 10 }}>
                <Checkbox
                  key={1}
                  checked={card === 1}
                  onChange={(e) => {
                    setCard(e.target.checked === true ? 1 : 0);
                  }}
                >
                  Cartão
                </Checkbox>
                <Checkbox
                  key={2}
                  checked={pix === 1}
                  onChange={(e) => setPix(e.target.checked === true ? 1 : 0)}
                >
                  Pix
                </Checkbox>
              </div>
              <Button
                style={{
                  width: "100%",
                }}
                type="primary"
                onClick={updatePaymentForm}
              >
                Salvar
              </Button>
            </div>
          </Panel>
          <Panel header="Habilitar tipo de chamado" key="4">
            <div>
              <div style={{ marginBottom: 10 }}>
                {callTypes?.map((item, index) => {
                  return (
                    <Checkbox
                      key={item.id}
                      checked={item.isActive === 1}
                      onChange={(e) => {
                        changeValue(index, e.target.checked);
                      }}
                    >
                      {item.name}
                    </Checkbox>
                  );
                })}
              </div>
              <Button
                style={{
                  width: "100%",
                }}
                type="primary"
                onClick={updateCallType}
              >
                Salvar
              </Button>
            </div>
          </Panel>
          <Panel
            header="Faixa de Preços (também pode ser configurada em Tarifas > Tipos de Viagem"
            key="5"
          >
            <div>
              <Button
                style={{
                  width: "100%",
                  marginBottom: 10,
                }}
                type="primary"
                onClick={() => setShowModal(true)}
              >
                Cadastrar nova
              </Button>

              <ContentTable>
                <Table dataSource={listPrices} loading={loading} columns={columns} />
              </ContentTable>
            </div>
          </Panel>
        </Collapse>
      </Content>
      <Modal
        title="Criar nova faixa de preço"
        open={showModal}
        footer={null}
        onCancel={() => {
          setShowModal(false);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical" name="form">
          <Form.Item
            name="description"
            label="Descrição"
            rules={[
              {
                required: true,
                message: "Insira a descrição",
              },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="tripTypeId"
            label="Selecione o tipo de viagem"
            rules={[
              {
                required: true,
                message: "Selecione o tipo de viagem",
              },
            ]}
          >
            <Select
              onChange={(id) => {
                form.setFieldValue("tripTypeId", id);
              }}
            >
              {tripType?.map((type) => (
                <Option key={type.idTripType} value={type.idTripType}>
                  {type.type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="centralId"
            label="Selecione a central"
            rules={[
              {
                required: true,
                message: "Selecione, no mínimo, uma central",
              },
            ]}
          >
            <Select
              onChange={(id) => {
                form.setFieldValue("tripTypeId", id);
              }}
            >
              {listCentral?.map((central) => (
                <Option key={central.id} value={central.id}>
                  {central.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="min_value"
            initialValue="0,00"
            label="De R$"
            rules={[
              {
                required: true,
                message: "Insira o preço inicial",
              },
            ]}
          >
            <Input
              value={form.getFieldValue("min_value")}
              onChange={(e) => {
                form.setFieldValue(
                  "min_value",
                  Mask.setMaskMoney(e.target.value)
                );
              }}
            />
          </Form.Item>

          <Form.Item
            name="max_value"
            initialValue="0,00"
            label="Até R$"
            rules={[
              {
                required: true,
                message: "Insira o preço máximo",
              },
            ]}
          >
            <Input
              value={form.getFieldValue("max_value")}
              onChange={(e) => {
                form.setFieldValue(
                  "max_value",
                  Mask.setMaskMoney(e.target.value)
                );
              }}
            />
          </Form.Item>

          <Form.Item
            name="new_value"
            initialValue="0,00"
            label="Cobrar R$"
            rules={[
              {
                required: true,
                message: "Insira o preço a ser cobrado",
              },
            ]}
          >
            <Input
              value={form.getFieldValue("new_value")}
              onChange={(e) => {
                form.setFieldValue(
                  "new_value",
                  Mask.setMaskMoney(e.target.value)
                );
              }}
            />
          </Form.Item>

          <Button htmlType="submit" type="primary" style={{ marginTop: 10 }}>
            Criar
          </Button>
        </Form>
      </Modal>
      <Modal
        title="Centrais cadastradas nessa faixa de preço"
        open={showModalCentral}
        footer={null}
        onCancel={() => {
          setShowModalCentral(false);
        }}
        destroyOnClose
      >
        <div>
          {howCentralShow?.map((central: CentralType) => (
            <p>{central.name}</p>
          ))}
        </div>
      </Modal>
    </div>
  );
};
