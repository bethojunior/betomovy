import { useEffect, useMemo, useState } from "react";
import api from "../../../../../../services/api";
import Mask from "../../../../../../services/Mask";
import {
  CommissionDriverProps,
  CommissionPaymentFormProps,
  ListPricesProps,
  TripPaymentsFormsProps,
  TypesTravelsProps,
} from "../types";

// Comissão do motorista (valor base por tipo de viagem) + taxa por forma de
// pagamento (acréscimo sobre a comissão, configurável por forma de pagamento).
export const useDriverCommission = (
  cityId: number,
  pricesSelected: ListPricesProps | null | undefined,
  setLoading: (loading: boolean) => void,
  travelSelected?: TypesTravelsProps
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

  const targetTripId = useMemo(() => {
    const raw =
      travelSelected?.idTripType ??
      (travelSelected as any)?.id ??
      pricesSelected?.tripTypeId ??
      (pricesSelected as any)?.trip_type?.idTripType;
    const n = Number(raw);
    return !isNaN(n) && n > 0 ? n : 0;
  }, [travelSelected, pricesSelected]);

  const commissionForSelectedTrip = useMemo(() => {
    if (!targetTripId) return undefined;
    return driverCommissions.find(
      (data) => Number(data.tripTypeId) === targetTripId
    );
  }, [driverCommissions, targetTripId]);

  const getCommissionsDriver = async (forcedCityId?: number) => {
    const activeCityId = Number(forcedCityId ?? cityId);
    if (!activeCityId || isNaN(activeCityId) || activeCityId <= 0) return [];
    setLoading(true);
    let commissionsList: CommissionDriverProps[] = [];
    try {
      const responseCommissionDriver = await api.get(
        `driverCommission/${activeCityId}`
      );

      const raw =
        responseCommissionDriver.data?.response ??
        responseCommissionDriver.data?.data;
      if (Array.isArray(raw)) {
        commissionsList = raw;
        setDriverCommissions(raw);
      }
    } catch (error) {
      console.warn("Aviso ao buscar comissões de motorista:", error);
    } finally {
      setLoading(false);
    }
    return commissionsList;
  };

  const getTripPayments = async () => {
    setLoading(true);
    try {
      const responseTripPayments = await api.get("tripPaymentForm");
      const rawPayments =
        responseTripPayments.data?.response ??
        responseTripPayments.data?.data;
      const paymentList: TripPaymentsFormsProps[] = Array.isArray(rawPayments)
        ? rawPayments
        : [];
      setTripPaymentsForms(paymentList);

      const savedPaymentForms =
        commissionForSelectedTrip?.commissions_payment_form ??
        commissionForSelectedTrip?.commissionsPaymentForm ??
        [];

      const listCommission: CommissionPaymentFormProps[] = paymentList.map(
        (value: TripPaymentsFormsProps) => {
          const formIdStr = String(value.idTripPaymentForm);
          const saved = savedPaymentForms.find(
            (item: any) =>
              String(item.tripPaymentFormId ?? item.id) === formIdStr
          );
          if (saved) {
            const num = Number(saved.value ?? 0);
            return {
              tripPaymentFormId: formIdStr,
              value: Mask.setMaskMoneyAlternative(isNaN(num) ? 0 : num),
              valueType: saved.valueType === "$" ? "$" : "%",
            };
          }
          return {
            tripPaymentFormId: formIdStr,
            value: "0,00",
            valueType: "%",
          };
        }
      );
      setCommissionPaymentForms(listCommission);
    } catch (error) {
      console.warn("Erro ao buscar formas de pagamento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePaymentsCommissions = (
    formId: string | number,
    field: "value" | "valueType",
    value: string
  ) => {
    const formIdStr = String(formId);
    setCommissionPaymentForms((current) => {
      const exists = current.some(
        (f) => String(f.tripPaymentFormId) === formIdStr
      );
      if (!exists) {
        return [
          ...current,
          {
            tripPaymentFormId: formIdStr,
            value: field === "value" ? value : "0,00",
            valueType: field === "valueType" ? value : "%",
          },
        ];
      }
      return current.map((item) => {
        if (String(item.tripPaymentFormId) === formIdStr) {
          return { ...item, [field]: value };
        }
        return item;
      });
    });
  };

  useEffect(() => {
    if (targetTripId > 0) {
      const savedPaymentForms =
        commissionForSelectedTrip?.commissions_payment_form ??
        commissionForSelectedTrip?.commissionsPaymentForm ??
        [];

      setCommissionPaymentForms((current) => {
        const baseList =
          current.length > 0
            ? current
            : tripPaymentsForms.map((p) => ({
                tripPaymentFormId: String(p.idTripPaymentForm),
                value: "0,00",
                valueType: "%",
              }));

        return baseList.map((form) => {
          const saved = savedPaymentForms.find(
            (item: any) =>
              String(item.tripPaymentFormId ?? item.id) ===
              String(form.tripPaymentFormId)
          );

          if (saved) {
            const num = Number(saved.value ?? 0);
            return {
              ...form,
              value: Mask.setMaskMoneyAlternative(isNaN(num) ? 0 : num),
              valueType: saved.valueType === "$" ? "$" : "%",
            };
          }
          return { ...form, value: "0,00", valueType: "%" };
        });
      });

      const rawVal = commissionForSelectedTrip?.value;
      const numVal =
        typeof rawVal === "number" ? rawVal : Number(rawVal ?? 0);
      setValueCalcDriver(
        Mask.setMaskMoneyAlternative(isNaN(numVal) ? 0 : numVal)
      );
      setValueTypeCalcDriver(
        commissionForSelectedTrip?.valueType === "$" ? "$" : "%"
      );
      setDisableOnPromotion(
        commissionForSelectedTrip?.disableOnPromotion == 1 ||
          commissionForSelectedTrip?.disableOnPromotion === true
      );
    } else {
      setValueCalcDriver("0,00");
      setValueTypeCalcDriver("%");
      setDisableOnPromotion(false);
    }
  }, [targetTripId, commissionForSelectedTrip, tripPaymentsForms]);

  return {
    tripPaymentsForms,
    driverCommissions,
    commissionPaymentForms,
    setCommissionPaymentForms,
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
