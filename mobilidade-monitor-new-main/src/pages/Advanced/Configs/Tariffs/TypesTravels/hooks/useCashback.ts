import { useEffect, useState } from "react";
import swal from "sweetalert";

import api from "../../../../../../services/api";
import { CashBackProps } from "../types";

export const useCashback = (
  cityId: number,
  tripTypeId: number | null | undefined,
  setLoading: (loading: boolean) => void
) => {
  const [cashBacks, setCashBacks] = useState<CashBackProps[]>([]);
  const [backToTripBalance, setBackToTripBalance] = useState<boolean>(true);
  const [valueTypeCashback, setValueTypeCashback] = useState<"$" | "%">("%");
  const [valueCashback, setValueCashback] = useState<string>("0,00");
  const [addToFinalPrice, setAddToFinalPrice] = useState<boolean>(false);

  const getCashBacks = async () => {
    setLoading(true);
    try {
      const responseCashBacks = await api.get(
        `cashback?cityId=${cityId}&tripTypeId=${tripTypeId}`
      );
      setCashBacks(responseCashBacks.data.response);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onChangeSwitchFinalPrice = (checked: boolean) => {
    setAddToFinalPrice(checked);
  };

  const handleAddCashback = async () => {
    setLoading(true);
    try {
      const responseCashback = await api.post("cashback", {
        //@ts-expect-error - replaceAll existe em runtime; alvo de lib do TS está desatualizado
        value: valueCashback.replaceAll(",", "."),
        valueType: valueTypeCashback,
        cityId: cityId,
        tripTypeId: tripTypeId,
        addToFinalPrice,
        backToTripBalance,
      });

      if (responseCashback.status) {
        swal({
          title: "Inserido com sucesso",
          text: "Verifique suas mudanças no seu app",
          icon: "success",
        });
        getCashBacks();
      } else {
        swal({
          title: "Erro ao inserir cashback",
          icon: "warning",
        });
      }
    } catch (error) {
      console.log(error);
      swal({
        title: "Erro ao adicionar cashback",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handleDeleteCashback = (id: number) => {
    swal({
      title: "Deseja mesmo deletar esse cashback?",
      text: "Esta ação é irreversível!",
      icon: "warning",
      buttons: ["Não", "Sim"],
    }).then((isAccepted) => {
      if (isAccepted) {
        setLoading(true);
        api
          .delete(`cashback/${id}`)
          .then((response) => {
            setLoading(false);
            if (response.status) {
              swal({
                title: "Deletado com sucesso",
                text: "Verifique suas mudanças em seu app",
                icon: "success",
              });
              getCashBacks();
            }
          })
          .catch((error) => {
            console.log(error);
            swal({
              title: "Erro ao deletar cashback",
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  useEffect(() => {
    if (tripTypeId != null) {
      getCashBacks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripTypeId]);

  return {
    cashBacks,
    backToTripBalance,
    setBackToTripBalance,
    valueTypeCashback,
    setValueTypeCashback,
    valueCashback,
    setValueCashback,
    addToFinalPrice,
    onChangeSwitchFinalPrice,
    handleAddCashback,
    handleDeleteCashback,
  };
};
