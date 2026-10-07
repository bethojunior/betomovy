import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import swal from "sweetalert";

import api from "../../../../../../services/api";
import Mask from "../../../../../../services/Mask";
import Utils from "../../../../../../utils/Utils";
import { RatesProps } from "../types";

// "Taxas" avulsas do tipo de viagem (endpoint `tax`) — não confundir com
// taxa de imposto/taxa extra da tarifa, nem com a taxa por forma de pagamento.
export const useTripRates = (
  cityId: number,
  tripTypeId: number | null | undefined,
  setLoading: (loading: boolean) => void
) => {
  const [allRates, setAllRates] = useState<RatesProps[]>([]);
  const [isShowNewRates, setIsShowNewRates] = useState<boolean>(false);
  const [nameRates, setNameRates] = useState<string>("");
  const [valueRates, setValueRates] = useState<string>("0,00");
  const [descriptionRates, setDescriptionRates] = useState<string>("");
  const [typeChargeRates, setTypeChargeRates] = useState<"$" | "%">("%");
  const [statusActiveRates, setStatusActiveRates] = useState<boolean>(false);
  const [selectCharged, setSelectCharged] = useState<"customer" | "driver">(
    "driver"
  );
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  const getRates = async () => {
    setLoading(true);
    try {
      const responseRates = await api.get(
        `tax?cityId=${cityId}&tripTypeId=${tripTypeId}`
      );
      setAllRates(responseRates.data.response);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const selectChargedRates = (value: "customer" | "driver") => {
    setSelectCharged(value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValues((prevState) => ({
      ...prevState,
      [name]: Mask.setMaskMoney(value),
    }));
  };

  const handleAddRates = async () => {
    setLoading(true);
    try {
      const objectSend = {
        active: statusActiveRates,
        chargeBy: selectCharged,
        cityId: cityId,
        description: descriptionRates,
        name: nameRates,
        tripTypeId: tripTypeId,
        value: Utils.BrlToNumber(valueRates, "positive"),
        valueType: typeChargeRates,
      };
      const responseRates = await api.post("tax", objectSend);
      if (responseRates.status) {
        swal({
          title: "Taxa adicionada com sucesso!",
          icon: "success",
        });
        getRates();
        setIsShowNewRates(false);
        setNameRates("");
        setValueRates("0,00");
        setDescriptionRates("");
        setTypeChargeRates("%");
        setStatusActiveRates(false);
        setSelectCharged("driver");
      }
    } catch (error) {
      console.log(error);
      swal({
        title: "Erro ao criar taxas",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handeDeleteRates = async (id: number) => {
    swal({
      title: "Você confirma a exclusão dessa tarifa",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`tax/${id}`)
          .then((response) => {
            setLoading(false);
            if (response.status) {
              swal({
                title: "Tarifa excluída com sucesso!",
                icon: "success",
              });
              getRates();
            }
          })
          .catch((error) => {
            console.log(error);
            swal({
              title: "Erro ao deletar tarifa",
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleUpdatedRates = async (
    event: FormEvent<HTMLFormElement>,
    value: string
  ) => {
    event.preventDefault();
    swal({
      title: "Você confirma a atualização desta taxa?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        const formData = new FormData(event.target as HTMLFormElement);

        const idUpdated = formData.get("id");
        const nameRatesUpdated = formData.get("nameRates");
        const descriptionRatesUpdated = formData.get("descriptionRates");
        const selectChargedRatesUpdated = formData.get("selectChargedRates");
        const valueTypeUpdated = formData.get("valueType");
        const isActiveUpdated = formData.get("isActive");

        const isActivedFormated =
          String(isActiveUpdated) === "on" ? true : false;

        const objectSend = {
          active: isActivedFormated,
          chargeBy: selectChargedRatesUpdated,
          cityId: cityId,
          description: descriptionRatesUpdated,
          name: nameRatesUpdated,
          tripTypeId: tripTypeId,
          value: Utils.BrlToNumber(value as string, "positive"),
          valueType: valueTypeUpdated,
        };

        api
          .put(`tax/${idUpdated}`, objectSend)
          .then((response) => {
            setLoading(false);
            if (response.status) {
              swal({
                title: "Taxa atualizada com sucesso!",
                icon: "success",
              });
              getRates();
            }
          })
          .catch((error) => {
            console.log(error);
            swal({
              title: "Erro ao atualizar taxas",
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
    getRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripTypeId]);

  useEffect(() => {
    if (allRates.length > 0) {
      const initialInputValues: { [key: string]: string } = {};
      allRates.forEach((datas: RatesProps, index) => {
        initialInputValues[`valueRates-${index}`] =
          Mask.setMaskMoneyAlternative(datas.value);
      });

      setInputValues(initialInputValues);
    }
  }, [allRates]);

  return {
    allRates,
    isShowNewRates,
    setIsShowNewRates,
    nameRates,
    setNameRates,
    valueRates,
    setValueRates,
    descriptionRates,
    setDescriptionRates,
    typeChargeRates,
    setTypeChargeRates,
    statusActiveRates,
    setStatusActiveRates,
    selectCharged,
    selectChargedRates,
    inputValues,
    handleInputChange,
    handleAddRates,
    handeDeleteRates,
    handleUpdatedRates,
  };
};
