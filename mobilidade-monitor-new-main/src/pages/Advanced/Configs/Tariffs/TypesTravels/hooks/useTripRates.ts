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
    if (!cityId || !tripTypeId) {
      setAllRates([]);
      return;
    }
    setLoading(true);
    try {
      const responseRates = await api.get(
        `tax?cityId=${cityId}&tripTypeId=${tripTypeId}`
      );
      if (responseRates.data && responseRates.data.response) {
        setAllRates(
          Array.isArray(responseRates.data.response)
            ? responseRates.data.response
            : []
        );
      } else {
        setAllRates([]);
      }
    } catch (error) {
      console.log(error);
      setAllRates([]);
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
    if (!cityId || !tripTypeId) {
      swal({
        title: "Selecione uma cidade e modalidade antes de adicionar uma taxa",
        icon: "warning",
      });
      return;
    }
    if (!nameRates.trim()) {
      swal({
        title: "Informe o nome da taxa",
        icon: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      const objectSend = {
        active: statusActiveRates ? 1 : 0,
        chargeBy: selectCharged,
        cityId: Number(cityId),
        description: descriptionRates || "",
        name: nameRates.trim(),
        tripTypeId: Number(tripTypeId),
        value: Utils.BrlToNumber(valueRates, "positive"),
        valueType: typeChargeRates,
      };
      const responseRates = await api.post("tax", objectSend);
      if (
        responseRates.data?.status ||
        responseRates.status === 200 ||
        responseRates.status === 201
      ) {
        swal({
          title: "Taxa adicionada com sucesso!",
          icon: "success",
        });
        await getRates();
        setIsShowNewRates(false);
        setNameRates("");
        setValueRates("0,00");
        setDescriptionRates("");
        setTypeChargeRates("%");
        setStatusActiveRates(false);
        setSelectCharged("driver");
      } else {
        swal({
          title: responseRates.data?.message || "Erro ao criar taxas",
          icon: "error",
        });
      }
    } catch (error: any) {
      console.log(error);
      swal({
        title: error.response?.data?.message || "Erro ao criar taxas",
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
            if (response.data?.status !== false && (response.data?.status || response.status === 200)) {
              swal({
                title: "Tarifa excluída com sucesso!",
                icon: "success",
              });
              getRates();
            } else {
              swal({
                title: response.data?.message || "Erro ao deletar tarifa",
                icon: "error",
              });
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
        if (!idUpdated) {
          swal({
            title: "ID da taxa não localizado",
            icon: "warning",
          });
          setLoading(false);
          return;
        }

        const nameRatesUpdated = formData.get("nameRates");
        if (!nameRatesUpdated || !String(nameRatesUpdated).trim()) {
          swal({
            title: "O nome da taxa é obrigatório",
            icon: "warning",
          });
          setLoading(false);
          return;
        }

        const descriptionRatesUpdated = formData.get("descriptionRates");
        const selectChargedRatesUpdated = formData.get("selectChargedRates") || "driver";
        const valueTypeUpdated = formData.get("valueType") || "%";
        const isActiveUpdated = formData.get("isActive");

        const isActivedFormated =
          String(isActiveUpdated) === "on" || isActiveUpdated === "true" || isActiveUpdated === true;

        const effectiveValue = value !== undefined && value !== null && String(value).trim() !== ""
          ? Utils.BrlToNumber(String(value), "positive")
          : 0;

        const objectSend = {
          active: isActivedFormated ? 1 : 0,
          chargeBy: selectChargedRatesUpdated,
          cityId: Number(cityId),
          description: descriptionRatesUpdated || "",
          name: String(nameRatesUpdated).trim(),
          tripTypeId: Number(tripTypeId),
          value: effectiveValue,
          valueType: valueTypeUpdated,
        };

        api
          .put(`tax/${idUpdated}`, objectSend)
          .then((response) => {
            setLoading(false);
            if (response.data?.status || response.status === 200) {
              swal({
                title: "Taxa atualizada com sucesso!",
                icon: "success",
              });
              getRates();
            } else {
              swal({
                title: response.data?.message || "Erro ao atualizar taxas",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            swal({
              title: error.response?.data?.message || "Erro ao atualizar taxas",
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
  }, [cityId, tripTypeId]);

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
