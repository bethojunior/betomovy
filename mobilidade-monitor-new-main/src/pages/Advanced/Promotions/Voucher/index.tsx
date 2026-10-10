import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { CitiesType } from "../Coupon/types";
import { Button, Form, Input, Modal, Select, Table } from "antd";
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

interface VoucherTypes {
  amount: string;
  cityId: number;
  cityName: string;
  id: number;
  percentage: string;
  user: string;
  value: string;
}

export const Voucher = () => {
       
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [voucher, setVoucher] = useState<VoucherTypes[]>([]);
  const [city, setCity] = useState<CitiesType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [lastPage, setLastPage] = useState<number | null>(null);
  const [modeEdit, setModeEdit] = useState(false);

  const [form] = Form.useForm();

  const amount = Form.useWatch("amount", form);
  const percentage = Form.useWatch("percentage", form);

  const { Option } = Select;

  const columns = [
    {
      title: "Valor do Voucher",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      ellipsis: true,
      render: (amount: number) => (
        <label>{Mask.setMaskMoneyNumber(amount | 0)}</label>
      ),
    },
    {
      title: "Desconto em %",
      dataIndex: "percentage",
      key: "percentage",
      width: 150,
      ellipsis: true,
      render: (percentage: number) => (
        <label>{Mask.setMaskMoneyNumber(percentage | 0)}</label>
      ),
    },
    {
      title: "Valor pago",
      dataIndex: "value",
      key: "value",
      width: 150,
      ellipsis: true,
      render: (value: number) => (
        <label>{Mask.setMaskMoneyNumber(value | 0)}</label>
      ),
    },
    {
      title: "Cidade",
      dataIndex: "cityName",
      key: "cityName",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Ofertado para",
      dataIndex: "user",
      key: "user",
      width: 200,
      ellipsis: true,
      render: (user: string) => (
        <label>{user === "client" ? "Cliente" : "Central"}</label>
      ),
    },
    {
      title: "Ações",
      dataIndex: "",
      key: "",
      width: 150,
      ellipsis: true,
      render: (item: VoucherTypes) => (
        <ContentBtnActions>
          <Button
            onClick={() => {
              setModeEdit(true);
              form.setFieldsValue(item);
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

  const get = async (page: number | null = 1) => {
    setLoadingTable(true);
    api(`voucherPromotion?page=${page}`).then((result) => {
      setLoadingTable(false);
      if (!result?.data?.status) {
        const errorMsg = result?.data?.message || result?.data?.response?.[0] || "Erro ao carregar vouchers";
        setMessageAlert(errorMsg);
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setVoucher(result.data?.response?.data || result.data?.data || []);

      if (result.data?.response?.next_page_url !== null && page !== null) {
        setNextPage(page + 1);
      } else {
        setNextPage(null);
      }

      if (result.data?.response?.prev_page_url !== null && page !== null) {
        setLastPage(page - 1);
      } else {
        setLastPage(null);
      }
    }).catch(() => {
      setLoadingTable(false);
    });
  };

  useEffect(() => {
    setLoadingTable(true);
    get();

    api("city/actives/fully").then((result) => {
      setLoadingTable(false);
      if (!result?.data?.status) {
        return;
      }

      setCity(result.data?.response || result.data?.data || []);
    });
  }, []);

  // useEffect(() => {
  //   if (showModal) {
  //     calculateNewValue();
  //   }
  // }, [showModal]);

  useEffect(() => {
    if (amount === undefined || percentage === undefined) return;

    const amountNumber = Number(
      Mask.setRemoveMaskMoney(amount || "0")
    );
    const percentageNumber = Number(
      Mask.setRemoveMaskMoney(percentage || "0")
    );

    let finalValue = amountNumber;

    if (percentageNumber > 0) {
      finalValue = amountNumber - (percentageNumber / 100) * amountNumber;
    }

    form.setFieldValue(
      "value",
      Mask.setMaskMoneyNumber(finalValue)
    );
  }, [amount, percentage]);


  const remove = async (id: number) => {
    swal({
      title: "Deseja deletar esse voucher?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
    }).then(async (answer) => {
      if (!answer) {
        return;
      }

      setLoadingTable(true);
      const { data } = await api.delete(`voucherPromotion/${id}`);

      if (!data.status) {
        setLoadingTable(false);
        setMessageAlert(
          "Ocorreu um erro ao deletar o voucher, tente novamente"
        );
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setMessageAlert("Voucher deletado com sucesso!");
      setTypeAlert("success");
      setShowAlert(true);
      get();
    });
  };

  const calculateFinalValue = (amount: string, percentage: string) => {
    const amountNumber = Number(Mask.setRemoveMaskMoney(amount || "0"));
    const percentageNumber = Number(Mask.setRemoveMaskMoney(percentage || "0"));

    if (percentageNumber > 0) {
      return amountNumber - (percentageNumber / 100) * amountNumber;
    }

    return amountNumber;
  };


  const handleSubmit = async (values: VoucherTypes) => {

    const { amount, cityId, percentage, user } = values;
    const finalValue = calculateFinalValue(amount, percentage);

    setLoadingTable(true);

    let response;

    if (modeEdit) {
      response = await api.put(`voucherPromotion/${values.id}`, {
        amount: Number(Mask.setRemoveMaskMoney(amount)),
        cityId,
        percentage: Number(Mask.setRemoveMaskMoney(percentage)),
        user,
        value: finalValue,
      });

    } else {
      response = await api.post("voucherPromotion", {
        amount: Number(Mask.setRemoveMaskMoney(amount)),
        cityId,
        percentage: Number(Mask.setRemoveMaskMoney(percentage)),
        user: user || "client",
        value: finalValue,
      });

    }

    setLoadingTable(false);
    if (!response.data.status) {
      setMessageAlert(
        `Ocorreu um erro ao ${
          modeEdit ? "editar" : "adicionar"
        } o voucher, tente novamente`
      );
      setTypeAlert("error");
      setShowAlert(true);
      return;
    }

    setShowAlert(true);
    setMessageAlert(
      `Voucher ${modeEdit ? "editado" : "adicionado"} com sucesso!`
    );
    setTypeAlert("success");
    setShowModal(false);
    form.resetFields();
    get();
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
        }}
      >
        Adicionar Voucher
      </Button>

      <ContentTable>
        <Table columns={columns} dataSource={voucher} pagination={false} loading={loadingTable}/>
      </ContentTable>

      <ContentPagination>
        <Button
          disabled={lastPage === null}
          onClick={() => get(lastPage)}
          icon={<AiOutlineArrowLeft />}
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        />

        <Button
          disabled={nextPage === null}
          onClick={() => get(nextPage)}
          icon={<AiOutlineArrowRight />}
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        />
      </ContentPagination>
      <Modal
        title={modeEdit ? "Editar voucher" : "Criar voucher"}
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical" name="form">
          <Form.Item name="id" style={{ display: "none" }} />
          <Form.Item
            name="amount"
            label="Valor do Voucher"
            initialValue="0,00"
            rules={[
              {
                required: true,
                message: "Insira o valor do voucher",
              },
            ]}
          >
            <Input
              value={form.getFieldValue("amount")}
              onChange={(e) => {
                form.setFieldValue("amount", Mask.setMaskMoney(e.target.value));
              }}

            />
          </Form.Item>
          <Form.Item
            name="percentage"
            label="Desconto em %"
            initialValue="0,00"
            rules={[
              {
                required: true,
                message: "Insira o desconto",
              },
            ]}
          >
            <Input
              value={form.getFieldValue("percentage")}
              onChange={(e) => {
                form.setFieldValue(
                  "percentage",
                  Mask.setMaskMoney(e.target.value)
                );
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="value"
            label="Valor que o cliente vai pagar"
            initialValue="0,00"
            rules={[
              {
                required: true,
                message: "O campo valor é obrigatório",
              },
            ]}
          >
            <Input readOnly />
          </Form.Item>

          <Form.Item
            name="cityId"
            label="Cidade de funcionamento do voucher"
            rules={[
              {
                required: true,
                message: "Selecione a cidade de funcionamento",
              },
            ]}
          >
            <Select>
              {city?.map((city) => (
                <Option key={city.cityId} value={city.cityId}>
                  {city.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="user" label="Para quem será ofertado">
            <Select defaultValue="client">
              <Option key={1} value="client">
                Cliente final
              </Option>
              <Option key={2} value="central">
                Central
              </Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Criar
          </Button>
        </Form>
      </Modal>
    </Container>
  );
};
