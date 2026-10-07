import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Button } from "antd";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import swal from "sweetalert";

import api from "../../../../services/api";
import Mask from "../../../../services/Mask";
import Utils from "../../../../utils/Utils";
import { Form } from "../styles";
import {
  CitiesType,
  CreditPrepaidProps,
  PaymentFormType,
} from "../types";

const typesOfRoleId = {
  admin: 1,
  manager: 2,
};

type AlertType = "success" | "info" | "warning" | "error";

interface CreditPrepaidErrorResponse {
  status: boolean;
  response?: string[] | string;
  message?: string;
  paramError?: boolean;
}

const VALIDATION_LABEL_TO_FORM_FIELD: Record<string, string> = {
  "tarjeta": "stripe",
  "título": "title",
  "sub-título": "subtitle",
  "preço de compra": "valueGain",
  "preço de venda": "valueBuy",
  "informções da conta": "dataPayment",
  "dados de pagamento": "dataPayment",
  "formas de pagamento": "paymentForm",
  "tipo": "type",
  "dias vendidos": "quantityDaysSold",
  "dias comprados": "quantityDaysPurchased",
  "cidade": "city",
};

function findFormFieldForMessage(message: string): string | undefined {
  const normalized = message.toLowerCase();
  const match = Object.entries(VALIDATION_LABEL_TO_FORM_FIELD).find(
    ([label]) => normalized.includes(label)
  );
  return match?.[1];
}

function extractValidationMessages(error: unknown): string[] {
  const data = (error as AxiosError<CreditPrepaidErrorResponse>)?.response
    ?.data;
  if (!data?.paramError || !data.response) return [];

  return Array.isArray(data.response) ? data.response : [data.response];
}

// Domínio "Tipos de créditos pré-pago" + "Modo de funcionamento do pré-pago"
// (as duas Panels que dependem de canManagePrepaid). Fica isolado do resto
// da tela de Cobranças (lançamento de motorista), que não tem nenhuma relação.
export const usePrepaidCreditTypes = (
  canManagePrepaid: boolean,
  setMessage: (message: string) => void,
  setTypeAlert: (type: AlertType) => void,
  setShowAlert: (visible: boolean) => void
) => {
  const { BrlToNumber } = Utils;

  const [loading, setLoading] = useState(false);
  const [havePermission, setHavePermission] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentFormType[]>([]);
  const [cities, setCities] = useState<CitiesType[]>([]);
  const [prepaidAll, setPrepaidAll] = useState<CreditPrepaidProps[]>([]);
  const [prepaidByCity, setPrepaidByCity] = useState<CreditPrepaidProps[]>([]);
  const [keyPrePaid, setKeyPrepaid] = useState("0");
  const [showModal, setShowModal] = useState(false);
  const [typePrePaid, setTypePrePaid] = useState<string>("value");
  const [editingPrepaid, setEditingPrepaid] = useState<CreditPrepaidProps | null>(
    null
  );
  const [showListPrepaid, setShowListPrepaid] = useState<"all" | "city">(
    "city"
  );

  const [form] = Form.useForm();

  const getPrepaidInformations = async () => {
    setLoading(true);
    try {
      const prePaid = api.get("creditPrepaid");
      const config = api.get("config");
      const payment = api.get("paymentForm");
      const city = api.get("city/actives/fully");

      const result = await Promise.all([prePaid, config, payment, city]);

      if (result[0].status) setPrepaidAll(result[0].data.response);
      if (result[2].status) setPaymentForm(result[2].data.response);
      if (result[3].status) setCities(result[3].data.response);
      result[1]?.data.response.find((res: any) => {
        if (res.type == "MOTORISTA") {
          setKeyPrepaid(res.config[13].value);
        }
      });
    } catch (e: any) {
      setMessage("Ocorreu um erro ao carregar as informações");
      setTypeAlert("error");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userConfig = localStorage.getItem("@App:user");

    if (userConfig !== null) {
      const roleId = JSON.parse(userConfig).roleId;

      if (roleId === typesOfRoleId.admin || roleId === typesOfRoleId.manager) {
        setHavePermission(true);
      }
    }
  }, []);

  useEffect(() => {
    getPrepaidInformations();
  }, []);

  useEffect(() => {
    const citySelected = localStorage.getItem("citySelected");

    if (citySelected && showListPrepaid === "city") {
      const prepaidAllByCity = prepaidAll.filter(
        (data) =>
          data.cityId === JSON.parse(citySelected).cityId ||
          data.cityId === null
      );
      setPrepaidByCity(prepaidAllByCity);
    }
  }, [prepaidAll, showListPrepaid]);

  const changeListPrepaid = async () => {
    setShowListPrepaid((current) => (current === "all" ? "city" : "all"));
  };

  const deletePrePaid = async (id: number) => {
    if (!canManagePrepaid) {
      setMessage("Você não possui permissão para esta ação");
      setTypeAlert("warning");
      setShowAlert(true);
      return;
    }
    swal({
      title: "Deseja remover esse tipo de pré-pago?",
      icon: "warning",
      buttons: ["Cancelar", "Continuar"],
    }).then(async (answer) => {
      if (answer) {
        setLoading(true);
        api
          .delete(`creditPrepaid/${id}`)
          .then((response) => {
            if (response.status) {
              setMessage("Pré pago deletado com sucesso.");
              setTypeAlert("success");
              setShowAlert(true);

              api
                .get("creditPrepaid")
                .then((response) => {
                  setPrepaidAll(response.data.response);
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          })
          .catch((error) => {
            console.error(error);
            setMessage("Erro ao deletar pré pago, tente novamente");
            setTypeAlert("error");
            setShowAlert(true);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const updateConfig = async (value: boolean) => {
    if (!canManagePrepaid) {
      setMessage("Você não possui permissão para esta ação");
      setTypeAlert("warning");
      setShowAlert(true);
      return;
    }
    swal({
      title: "Deseja alterar esses dados?",
      icon: "warning",
      buttons: ["Cancelar", "Continuar"],
    }).then(async (answer) => {
      if (!answer) {
        return;
      }

      setLoading(true);
      const { data } = await api.put("config", {
        only_prepaid_per_period: value ? "1" : "0",
      });

      setLoading(false);
      if (!data.status) {
        setMessage("Erro ao alterar o modo do pré pago, tente novamente");
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      setMessage("Modo alterado sucesso!");
      setTypeAlert("success");
      setShowAlert(true);

      setKeyPrepaid(value ? "1" : "0");
    });
  };

  const buildCreditPrepaidPayload = (values: any) => ({
    accountInformation: values.dataPayment,
    cityId: values.city,
    paymentForms: values.paymentForm,
    purchasePrice: values.valueGain
      ? BrlToNumber(values.valueGain, "positive")
      : null,
    quantityDaysPurchased: values.quantityDaysPurchased,
    quantityDaysSold: values.quantityDaysSold,
    sellPrice: BrlToNumber(values.valueBuy, "positive"),
    stripe: values.stripe,
    superTitle: values.subtitle,
    title: values.title,
    type: values.type || "value",
  });

  const closePrepaidModal = () => {
    setShowModal(false);
    setEditingPrepaid(null);
    form.resetFields();
    setTypePrePaid("value");
  };

  const handleOpenCreatePrepaid = () => {
    setEditingPrepaid(null);
    form.resetFields();
    setTypePrePaid("value");
    setShowModal(true);
  };

  const handleOpenEditPrepaid = (record: CreditPrepaidProps) => {
    setEditingPrepaid(record);
    setTypePrePaid(record.type);
    form.setFieldsValue({
      stripe: record.stripe,
      title: record.title,
      subtitle: record.superTitle,
      city: record.cityId ?? 0,
      type: record.type,
      valueBuy: Mask.setMaskMoneyAlternative(Number(record.sellPrice)),
      valueGain: Mask.setMaskMoneyAlternative(Number(record.purchasePrice)),
      quantityDaysSold: record.quantityDaysSold ?? "0",
      quantityDaysPurchased: record.quantityDaysPurchased ?? "0",
      paymentForm: record.credit_prepaid_payment_form.map(
        (item) => item.paymentFormId
      ),
      dataPayment: record.accountInformation,
    });
    setShowModal(true);
  };

  const handleSubmit = async (values: any) => {
    if (!canManagePrepaid) {
      setMessage("Você não possui permissão para esta ação");
      setTypeAlert("warning");
      setShowAlert(true);
      return;
    }
    const isEditing = editingPrepaid !== null;
    try {
      setLoading(true);
      const payload = buildCreditPrepaidPayload(values);
      const responseCreditPrepaid = isEditing
        ? await api.put(`creditPrepaid/${editingPrepaid!.id}`, payload)
        : await api.post("creditPrepaid", payload);

      if (responseCreditPrepaid.status) {
        setMessage(
          isEditing ? "Pré pago atualizado com sucesso" : "Pré pago criado com sucesso"
        );
        setTypeAlert("success");
        setShowAlert(true);
        getPrepaidInformations();
        closePrepaidModal();
      }
    } catch (error) {
      console.error(error);

      const validationMessages = extractValidationMessages(error);

      if (validationMessages.length > 0) {
        form.setFields(
          validationMessages.reduce<{ name: string; errors: string[] }[]>(
            (fields, message) => {
              const fieldName = findFormFieldForMessage(message);
              if (!fieldName) return fields;

              const existingField = fields.find((f) => f.name === fieldName);
              if (existingField) {
                existingField.errors.push(message);
              } else {
                fields.push({ name: fieldName, errors: [message] });
              }
              return fields;
            },
            []
          )
        );
        setMessage(validationMessages.join(" "));
      } else {
        setMessage(
          isEditing
            ? "Erro ao atualizar pré pago, tente novamente"
            : "Erro ao criar novo pré pago, tente novamente"
        );
      }
      setTypeAlert("error");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const columnsPrePaid: any = [
    {
      title: "Targeta",
      dataIndex: "stripe",
      key: "stripe",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Subtítulo",
      dataIndex: "superTitle",
      key: "superTitle",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      width: 150,
      ellipsis: true,
      render: (type: string) => (
        <p> {type === "value" ? "Valor" : "Por periodo"}</p>
      ),
    },
    {
      title: "Cidades",
      dataIndex: "cityName",
      key: "cityName",
      width: 150,
      ellipsis: true,
      render: (cityName: string) => (
        <p> {cityName === null ? "Todas" : cityName}</p>
      ),
    },
    {
      title: "Dias vendidos",
      dataIndex: "quantityDaysPurchased",
      key: "quantityDaysPurchased",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Dias comprados",
      dataIndex: "quantityDaysSold",
      key: "quantityDaysSold",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Valor da compra",
      dataIndex: "purchasePrice",
      key: "purchasePrice",
      width: 150,
      ellipsis: true,
      render: (purchasePrice: string) => (
        <p>{Mask.setMaskMoneyNumber(Number(purchasePrice))}</p>
      ),
    },
    {
      title: "Valor da venda",
      dataIndex: "sellPrice",
      key: "sellPrice",
      width: 150,
      ellipsis: true,
      render: (sellPrice: string) => (
        <p>{Mask.setMaskMoneyNumber(Number(sellPrice))}</p>
      ),
    },
    {
      title: "Dados da conta",
      dataIndex: "accountInformation",
      key: "accountInformation",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Ação",
      dataIndex: "id",
      key: "actionPrePaid",
      width: 100,
      ellipsis: true,
      align: "center",
      render: (id: number, record: CreditPrepaidProps) => (
        <>
          <Button
            type="link"
            key={`edit-${record.id}`}
            disabled={!canManagePrepaid}
            onClick={() => handleOpenEditPrepaid(record)}
            icon={<AiFillEdit style={{ color: "#1890ff", fontSize: 20 }} />}
          />
          <Button
            type="link"
            key={`delete-${id}`}
            disabled={!canManagePrepaid}
            onClick={() => deletePrePaid(id)}
            icon={<AiFillDelete style={{ color: "red", fontSize: 20 }} />}
          />
        </>
      ),
    },
  ];

  return {
    loading,
    havePermission,
    paymentForm,
    cities,
    prepaidAll,
    prepaidByCity,
    showListPrepaid,
    changeListPrepaid,
    keyPrePaid,
    updateConfig,
    showModal,
    typePrePaid,
    setTypePrePaid,
    editingPrepaid,
    form,
    columnsPrePaid,
    handleOpenCreatePrepaid,
    closePrepaidModal,
    handleSubmit,
  };
};
