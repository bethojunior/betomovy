import { useEffect, useMemo, useState } from "react";
import swal from "sweetalert";

import api from "../../../../../../services/api";
import Mask from "../../../../../../services/Mask";
import {
  CommissionDriverProps,
  CommissionPaymentFormProps,
  ListPricesProps,
  TripPaymentsFormsProps,
} from "../types";

// Comissão do motorista (valor base por tipo de viagem) + taxa por forma de
// pagamento (acréscimo sobre a comissão, configurável por forma de pagamento).
export const useDriverCommission = (
  cityId: number,
  pricesSelected: ListPricesProps | null | undefined,
  setLoading: (loading: boolean) => void
) => {
  const [tripPaymentsForms, setTripPaymentsForms] = useState<
    TripPaymentsFormsProps[]
  >([]);
  const [driverCommissions, setDriverCommissions] = useState<
    CommissionDriverProps[]
  >([]);
  const [commissionPaymentForms, setCommissionPaymentForms] = useState<
    CommissionPaymentFormProps[]
  >([]);

  const [valueTypeCalcDriver, setValueTypeCalcDriver] = useState<string>("%");
  const [valueCalcDriver, setValueCalcDriver] = useState<string>("0,00");
  const [disableOnPromotion, setDisableOnPromotion] = useState<boolean>(false);

  const commissionForSelectedTrip = useMemo(
    () =>
      driverCommissions.find(
        (data) => data.tripTypeId === pricesSelected?.tripTypeId
      ),
    [driverCommissions, pricesSelected?.tripTypeId]
  );

  const getCommissionsDriver = async () => {
    setLoading(true);
    try {
      const responseCommissionDriver = await api.get(
        `driverCommission/${cityId}`
      );

      if (responseCommissionDriver.status) {
        setDriverCommissions(responseCommissionDriver.data.response);
      }
    } catch (error) {
      console.log(error);
      swal({
        title: "Erro ao capturar dados de comissão de motoristas",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const getTripPayments = async () => {
    setLoading(true);
    try {
      const responseTripPayments = await api.get("tripPaymentForm");
      setTripPaymentsForms(responseTripPayments.data.response);

      const listCommission: CommissionPaymentFormProps[] = [];

      responseTripPayments.data.response.map(
        (value: TripPaymentsFormsProps) => {
          const objectCommission = {
            tripPaymentFormId: String(value.idTripPaymentForm),
            value: "0,00",
            valueType: "%",
          };

          listCommission.push(objectCommission);
        }
      );
      setCommissionPaymentForms(listCommission);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleChangePaymentsCommissions = (
    index: number,
    field: "tripPaymentFormId" | "value" | "valueType",
    value: string
  ) => {
    setCommissionPaymentForms((current) => {
      if (!current[index]) return current;

      const updated = [...current];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  useEffect(() => {
    if (pricesSelected) {
      const savedPaymentForms =
        commissionForSelectedTrip?.commissions_payment_form ?? [];

      setCommissionPaymentForms((current) =>
        current.map((form) => {
          const saved = savedPaymentForms.find(
            (item) => String(item.tripPaymentFormId) === form.tripPaymentFormId
          );

          return saved
            ? {
                ...form,
                value: Mask.setMaskMoneyAlternative(Number(saved.value || 0)),
                valueType: saved.valueType,
              }
            : { ...form, value: "0,00", valueType: "%" };
        })
      );

      setValueCalcDriver(
        Mask.setMaskMoneyAlternative(commissionForSelectedTrip?.value ?? 0)
      );
      setValueTypeCalcDriver(commissionForSelectedTrip?.valueType as string);
      setDisableOnPromotion(
        commissionForSelectedTrip?.disableOnPromotion === 1 ? true : false
      );
    } else {
      setValueCalcDriver("0,00");
      setValueTypeCalcDriver("%");
      setDisableOnPromotion(false);
    }
  }, [pricesSelected, commissionForSelectedTrip]);

  return {
    tripPaymentsForms,
    driverCommissions,
    commissionPaymentForms,
    valueTypeCalcDriver,
    setValueTypeCalcDriver,
    valueCalcDriver,
    setValueCalcDriver,
    disableOnPromotion,
    setDisableOnPromotion,
    getCommissionsDriver,
    getTripPayments,
    handleChangePaymentsCommissions,
  };
};
