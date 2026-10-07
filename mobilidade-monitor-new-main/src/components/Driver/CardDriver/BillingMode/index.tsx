import { useContext, useState } from "react";
import swal from "sweetalert";
import { Switch } from "antd";
import { FiCreditCard, FiFileText, FiChevronRight, FiChevronDown } from "react-icons/fi";

import {
  BillingCard,
  SwitchRow,
  PrepaidLabel,
  ContentFormsPayments,
  PaymentFormRow,
  PaymentFormRowLeft,
  ContentTable,
  PaymentFormTable,
  THeader,
  TBody,
  PaymentCheckbox,
} from "./styles";
import { SectionTitleRow } from "../styles";
import { BillingModeProps } from "./types";
import {
  TripPaymentFormGroup,
  FormOfPaymentGroup,
  TripPaymentFormData,
  FormOfPaymentData,
} from "../types";

import AuthContext from "../../../../contexts/auth";
import { MOTORISTA } from "../../../../constants/permissions";
import api from "../../../../services/api";

export const BillingMode = ({
  idDriver,
  prepaid,
  setLoading,
  onAlert,
}: BillingModeProps) => {
  const { hasPermission } = useContext(AuthContext);
  const [valueBillingMode, setValueBillingMode] = useState<boolean>(
    prepaid === 1 ? true : false
  );

  const [paymentForms, setPaymentForms] = useState<TripPaymentFormData[]>([]);
  const [driverPaymentForm, setDriverPaymentForm] = useState<
    FormOfPaymentData[]
  >([]);
  const [paymentFormBlocked, setPaymentFormBlocked] = useState<
    FormOfPaymentData[]
  >([]);
  const [paymentFormImposition, setPaymentFormImposition] = useState<
    FormOfPaymentData[]
  >([]);

  const changeBillingMode = async (checked: boolean) => {
    setLoading(true);
    try {
      const responseBillingMode = await api.put(`driver/${idDriver}`, {
        prepaid: checked,
      });
      if (responseBillingMode.status) {
        setValueBillingMode(
          responseBillingMode.data.response.prepaid === 1 ? true : false
        );
        onAlert("Status atualizado com sucesso!", "success");
      } else {
        onAlert("Erro ao atualizar status", "warning");
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao alterar o modo de cobrança",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const getTablePaymentForm = async (value: number) => {
    setLoading(true);

    const requestPaymentForms =
      api.get<TripPaymentFormGroup>("tripPaymentForm");

    const requestPaymentFormBlocked = api.get<FormOfPaymentGroup>(
      `driver/${value}/driverFormOfPaymentBlocked`
    );
    const requestDriverPaymentForm = api.get<FormOfPaymentGroup>(
      `driver/${value}/driverFormOfPayment`
    );
    const requestPaymentFormImposition = api.get<FormOfPaymentGroup>(
      `driver/${value}/driverFormOfPaymentImposition`
    );

    Promise.all([
      requestPaymentForms,
      requestPaymentFormBlocked,
      requestDriverPaymentForm,
      requestPaymentFormImposition,
    ]).then((values) => {
      setLoading(false);
      if (values[0].status === 200) {
        setPaymentForms(values[0].data.response);
        setPaymentFormBlocked(values[1].data.response);
        setDriverPaymentForm(values[2].data.response);
        setPaymentFormImposition(values[3].data.response);
      }
      return "";
    });
  };

  const checkStatusPaymentForm = (
    result: TripPaymentFormData,
    stateToFind: FormOfPaymentData[]
  ) => {
    if (stateToFind.length > 0) {
      return !!stateToFind?.find(
        (itens: FormOfPaymentData) =>
          itens.trip_payment_form.idTripPaymentForm === result.idTripPaymentForm
      );
    }
    return false;
  };

  const handleUpdatePaymentBlock = (option: number, id: string) => {
    let optionsArray = [];
    const elChecked = Number(id);
    let optionChecked = [];

    if (option === 1) {
      optionChecked = paymentFormBlocked;
    } else {
      optionChecked = paymentFormImposition;
    }

    optionsArray = optionChecked.map((result) => {
      return result.tripPaymentFormId;
    });

    if (optionsArray.find((el) => el === elChecked)) {
      const remove = optionsArray.indexOf(elChecked);
      optionsArray.splice(remove, 1);
    } else {
      optionsArray.push(elChecked);
    }

    if (option === 1) {
      setLoading(true);
      api
        .put(`driver/${idDriver}/driverFormOfPaymentBlocked`, {
          tripPaymentForms: optionsArray,
        })
        .then((result) => {
          if (!result.data.status) {
            onAlert(
              "Não foi possível bloquear essa forma de pagamento, tenta novamente",
              "error"
            );
            return;
          }
          setPaymentFormBlocked(result.data.response);
          return getTablePaymentForm(idDriver);
        })
        .catch((error) => {
          console.error(error);
          swal({
            title: "Erro ao atualizar forma de pagamento",
            icon: "error",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (option === 2) {
      setLoading(true);
      api
        .put(`driver/${idDriver}/driverFormOfPaymentImposition`, {
          tripPaymentForms: optionsArray,
        })
        .then((result) => {
          if (!result.data.status) {
            onAlert(
              "Não foi possível impor essa forma de pagamento, tenta novamente",
              "error"
            );
            return;
          }
          setPaymentFormImposition(result.data.response);
          return getTablePaymentForm(idDriver);
        })
        .catch((error) => {
          console.error(error);
          swal({
            title: "Erro ao atualizar forma de pagamento",
            icon: "error",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <BillingCard>
      <SectionTitleRow>
        <FiCreditCard size={18} />
        Modo de cobrança
      </SectionTitleRow>
      <SwitchRow>
        <Switch
          checked={valueBillingMode}
          onChange={changeBillingMode}
          size="small"
          disabled={!hasPermission(MOTORISTA, "editar")}
        />
        <PrepaidLabel>Apenas pré pago</PrepaidLabel>
      </SwitchRow>

      <ContentFormsPayments>
        <PaymentFormRow
          disabled={!hasPermission(MOTORISTA, "editar")}
          onClick={() => {
            if (paymentForms.length > 0) {
              setPaymentForms([]);
            } else {
              getTablePaymentForm(idDriver);
            }
          }}
        >
          <PaymentFormRowLeft>
            <FiFileText size={16} />
            Formas de pagamento
          </PaymentFormRowLeft>
          {paymentForms.length > 0 ? (
            <FiChevronDown size={16} />
          ) : (
            <FiChevronRight size={16} />
          )}
        </PaymentFormRow>
        <div>
          {paymentForms.length > 0 ? (
            <ContentTable>
              <PaymentFormTable>
                <THeader>
                  <th>Escolha do motorista</th>
                  <th>Bloqueio</th>
                  <th>Imposição</th>
                </THeader>
                <TBody>
                  {paymentForms.map((value) => {
                    return (
                      <tr key={value.idTripPaymentForm}>
                        <td>
                          <PaymentCheckbox
                            checked={
                              checkStatusPaymentForm(
                                value,
                                driverPaymentForm
                              ) || true
                            }
                          />
                          {value.name}
                        </td>
                        <td>
                          <input
                            type="radio"
                            id={String(value.idTripPaymentForm)}
                            onClick={(e) =>
                              handleUpdatePaymentBlock(
                                1,
                                (e.target as Element).id
                              )
                            }
                            checked={checkStatusPaymentForm(
                              value,
                              paymentFormBlocked
                            )}
                            disabled={!hasPermission(MOTORISTA, "editar")}
                          />
                        </td>
                        <td>
                          <input
                            type="radio"
                            id={String(value.idTripPaymentForm)}
                            onClick={(e) =>
                              handleUpdatePaymentBlock(
                                2,
                                (e.target as Element).id
                              )
                            }
                            checked={checkStatusPaymentForm(
                              value,
                              paymentFormImposition
                            )}
                            disabled={!hasPermission(MOTORISTA, "editar")}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </TBody>
              </PaymentFormTable>
            </ContentTable>
          ) : null}
        </div>
      </ContentFormsPayments>
    </BillingCard>
  );
};
