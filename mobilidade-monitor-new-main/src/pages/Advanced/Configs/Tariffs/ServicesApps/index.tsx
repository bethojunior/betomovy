import {
  Container,
  ContentTypesTravels,
  ButtonAddNewTariff,
  CardTariff,
  ImageTariff,
  TextCardTariff,
  TitleCardTariff,
  ConfigDetailsTariffs,
  ContentDetailsTariffs,
  ContentListOptionsDetailsTariffs,
  ContentLogoApp,
  ImageLogoApp,
  ContentButtons,
  ContentPricePolicy,
  LabelText,
  ContentInputs,
  TextArea,
  ContentBtnSaveCashBack,
  TBody,
  THead,
  ButtonDelete,
  ContentColumnInputs,
  ButtonClosePrices,
  Button,
  Select,
  ContentListTypesTravels,
  ContentTable,
  Input,
  Loader,
} from "./styles";

import {
  Collapse,
  Switch,
  Radio,
  Select as SelectAntd,
  Checkbox,
  Button as ButtonAntd,
} from "antd";
import { AxiosError } from "axios";
import swal from "sweetalert";
import { AiOutlineClose } from "react-icons/ai";

import Session from "../../../../../utils/Session";

import { useEffect, useState, Fragment, FormEvent, ChangeEvent } from "react";

import Utils from "../../../../../utils/Utils";
import Mask from "../../../../../services/Mask";

import api from "../../../../../services/api";

import Preload from "../../../../../components/Utils/Preload";
import { ModalNewServices } from "../../../../../components/Advanced/Tariffs/ModalNewServices";

import {
  CommissionDriverProps,
  CashBackProps,
  CommissionPaymentFormProps,
  ListPricesProps,
  PriceRangeProps,
  RatesProps,
  TripPaymentsFormsProps,
  TypesTravelsProps,
} from "./types";
import { theme_colors } from "../../../../../theme/theme";

let commissions: CommissionDriverProps[] = [];

export const ServicesApps = () => {
  const [typesTravels, setTypesTravels] = useState<TypesTravelsProps[]>([]);
  const [travelSelected, setTravelSelected] = useState<TypesTravelsProps>({});
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [listPrices, setListPrices] = useState<ListPricesProps[]>([]);
  const [pricesSelected, setPricesSelected] = useState<ListPricesProps | null>(
    null
  );
  const [tripPaymentsForms, setTripPaymentsForms] = useState<
    TripPaymentsFormsProps[]
  >([]);
  const [driverCommissions, setDriverCommissions] = useState<
    CommissionDriverProps[]
  >([]);

  const [tag, setTag] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("0,00");
  const [colorTag, setColorTag] = useState<string>("");
  const [basePrice, setBasePrice] = useState<string>("0,00");
  const [kmPrice, setKmPrice] = useState<string>("0,00");
  const [minutePrice, setMinutePrice] = useState<string>("0,00");
  const [wayPointPrice, setWayPointPrice] = useState<string>("0,00");
  const [longDistanceRadius, setLongDistanceRadius] = useState<number>(0);
  const [longDistanceKm, setLongDistanceKm] = useState<string>("0,00");
  const [rewardDriverMinPrice, setRewardDriverMinPrice] =
    useState<string>("0,00");
  const [ideaListCommonPrice, setIdeaListCommonPrice] = useState<number>(0);
  const [disableAfterKm, setDisableAfterKm] = useState<string>("0,00");
  const [additionalValueAfterKm, setAdditionalValueAfterKm] =
    useState<string>("0,00");
  const [kmToAdditionalValue, setKmToAdditionalValue] =
    useState<string>("0,00");
  const [typeAdditionalValueAfterKm, setTypeAdditionalValueAfterKm] =
    useState<string>("$");
  const [longDistanceValueToFinalPrice, setLongDistanceValueToFinalPrice] =
    useState<boolean>(false);

  const [valueTypeCalcDriver, setValueTypeCalcDriver] = useState<string>("%");
  const [valueCalcDriver, setValueCalcDriver] = useState<string>("0,00");
  const [disableOnPromotion, setDisableOnPromotion] = useState<boolean>(false);

  const [taxRate, setTaxRate] = useState<string>("0,00");
  const [typeTaxRate, setTypeTaxRate] = useState<"%" | "$">("%");
  const [descriptionTaxRate, setDescriptionTaxRate] = useState<string | null>(
    null
  );

  const [valueSurchase, setValueSurchase] = useState<string>("0,00");
  const [typeValueSurchase, setTypeValueSurchase] = useState<"%" | "$">("%");
  const [descriptionSurchase, setDescriptionSurchase] = useState<string | null>(
    null
  );

  const [commissionPaymentForms, setCommissionPaymentForms] = useState<
    CommissionPaymentFormProps[]
  >([]);

  const [cashBacks, setCashBacks] = useState<CashBackProps[]>([]);

  const [backToTripBalance, setBackToTripBalance] = useState<boolean>(true);
  const [valueTypeCashback, setValueTypeCashback] = useState<"$" | "%">("%");
  const [valueCashback, setValueCashback] = useState<string>("0,00");
  const [addToFinalPrice, setAddToFinalPrice] = useState<boolean>(false);

  const [datasPriceRange, setDatasPriceRange] = useState<PriceRangeProps[]>([]);
  const [minValue, setMinValue] = useState<string>("0,00");
  const [maxValue, setMaxValue] = useState<string>("0,00");
  const [newValue, setNewValue] = useState<string>("0,00");
  const [descriptionPriceRange, setDescritpionPriceRange] =
    useState<string>("");

  const [isShowNewRates, setIsShowNewRates] = useState<boolean>(false);
  const [allRates, setAllRates] = useState<RatesProps[]>([]);
  const [nameRates, setNameRates] = useState<string>("");
  const [valueRates, setValueRates] = useState<string>("0,00");
  const [descriptionRates, setDescriptionRates] = useState<string>("");
  const [typeChargeRates, setTypeChargeRates] = useState<"$" | "%">("%");
  const [statusActiveRates, setStatusActiveRates] = useState<boolean>(false);
  const [selectCharged, setSelectCharged] = useState<"customer" | "driver">(
    "driver"
  );

  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  const cityId = Session.getLocal("citySelected")?.cityId;

  const getTypesTravels = async () => {
    setLoading(true);
    try {
      const responseTypesTravels = await api.get("tripType");

      const typesTravels = responseTypesTravels.data.response.filter(
        (data: TypesTravelsProps) => Number(data.serviceOption) === 1
      );
      setTypesTravels(typesTravels);
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
    setLoading(false);
  };

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
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
    setLoading(false);
  };

  const getCashBacks = async () => {
    setLoading(true);
    try {
      const responseCashBacks = await api.get(
        `cashback?cityId=${cityId}&tripTypeId=${travelSelected.idTripType}`
      );
      setCashBacks(responseCashBacks.data.response);
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
    setLoading(false);
  };

  const getPricesRange = async () => {
    setLoading(true);
    try {
      const responsePricesRange = await api.get(
        `price/range?cityId=${cityId}&tripTypeId=${travelSelected.idTripType}`
      );
      setDatasPriceRange(responsePricesRange.data.response);
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
    setLoading(false);
  };

  const getRates = async () => {
    setLoading(true);
    try {
      const responseRates = await api.get(
        `tax?cityId=${cityId}&tripTypeId=${travelSelected.idTripType}`
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

  const handleSelectTravel = (datasTravel: TypesTravelsProps) => {
    setTravelSelected(datasTravel);
  };

  const onChangeSwitchFinalPrice = (checked: boolean) => {
    setAddToFinalPrice(checked);
  };

  // const onChangeSwitchLongDistanceValueToFinalPrice = (checked: boolean) => {
  //   setLongDistanceValueToFinalPrice(checked);
  // };

  const handleUpdateTariffs = async () => {
    if (Utils.BrlToNumber(minPrice, "positive") <= 0) {
      swal({
        title: "O CAMPO PREÇO MÍNIMO PRECISA SER PREENCHIDO",
        icon: "warning",
      });
      return;
    }

    if (Utils.BrlToNumber(basePrice, "positive") <= 0) {
      swal({
        title: "O CAMPO BASE PROMOCIONAL PRECISA SER PREENCHIDO",
        icon: "warning",
      });
      return;
    }

    if (Utils.BrlToNumber(kmPrice, "positive") <= 0) {
      swal({
        title: "O CAMPO PREÇO KM PRECISA SER PREENCHIDO",
        icon: "warning",
      });
      return;
    }

    if (Utils.BrlToNumber(minutePrice, "positive") <= 0) {
      swal({
        title: "O campo PREÇO MINUTO PRECISA SER PREENCHIDO",
        icon: "warning",
      });
      return;
    }

    swal({
      title: "Atenção",
      text: "Deseja modificar os valores do preço?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccepted) => {
      if (isAccepted) {
        setLoading(true);
        const objectSendPrice = {
          additional_value_after_km: Utils.BrlToNumber(
            additionalValueAfterKm,
            "positive"
          ),
          another_fee: Utils.BrlToNumber(valueSurchase, "positive"),
          another_fee_description: descriptionSurchase,
          another_fee_type: typeValueSurchase,
          base_price: Utils.BrlToNumber(basePrice, "positive"),
          cityId: cityId,
          color: colorTag,
          disable_after_km: Utils.BrlToNumber(disableAfterKm, "positive"),
          idealListCommonPrice: ideaListCommonPrice,
          km_price: Utils.BrlToNumber(kmPrice, "positive"),
          km_to_additional_value: Utils.BrlToNumber(
            kmToAdditionalValue,
            "positive"
          ),
          long_distance_per_km: Utils.BrlToNumber(longDistanceKm, "positive"),
          long_distance_radius: longDistanceRadius,
          long_distance_value_to_final_price: longDistanceValueToFinalPrice,
          min_price: Utils.BrlToNumber(minPrice, "positive"),
          minute_price: Utils.BrlToNumber(minutePrice, "positive"),
          promotional_price_temp: 0,
          reward_driver_min_price: Utils.BrlToNumber(
            rewardDriverMinPrice,
            "positive"
          ),
          tag: tag,
          tax_price: Utils.BrlToNumber(taxRate, "positive"),
          tax_price_description: descriptionTaxRate,
          tax_price_type: typeTaxRate,
          tripTypeId: travelSelected.idTripType,
          type_additional_value_after_km: typeAdditionalValueAfterKm,
          waypoint_price: Utils.BrlToNumber(wayPointPrice, "positive"),
        };
        const newObjectCommission = commissionPaymentForms.map((response) => {
          if (typeof response.value === "string") {
            response.value = Utils.BrlToNumber(
              response.value as string,
              "positive"
            );
            return response;
          }
          return response;
        });

        const objectSendCommission = {
          commissionAnotherFee: {
            another_value: Utils.BrlToNumber(valueSurchase, "positive"),
            taxValueType: typeTaxRate,
            tax_value: Utils.BrlToNumber(taxRate, "positive"),
            valueType: typeValueSurchase,
          },
          commissionsPaymentForm: newObjectCommission,
          value: Utils.BrlToNumber(valueCalcDriver, "positive"),
          tripTypeId: travelSelected.idTripType,
          valueType: valueTypeCalcDriver,
          disableOnPromotion,
        };

        const responseDriverComission = api.post(
          `driverCommission/${cityId}`,
          objectSendCommission
        );

        const responseUpdatePrices = api.post("price", objectSendPrice);

        Promise.all([responseDriverComission, responseUpdatePrices])
          .then((response) => {
            setLoading(false);
            if (!response[1]?.data?.status && !response[1]?.status) {
              let errorMsg = "Não foi possível atualizar o preço.";
              try {
                if (response[1]?.data?.message) {
                  errorMsg = response[1].data.message;
                } else if (response[1]?.request?.response) {
                  const parsed = JSON.parse(response[1].request.response);
                  if (parsed?.response) errorMsg = parsed.response;
                }
              } catch {}
              swal({
                title: errorMsg,
                icon: "warning",
              });
              return;
            }
            swal({
              title: "Preço atualizado com sucesso!",
              icon: "success",
            });
            getTypesTravels();
            getCommissionsDriver();
            getPrices();
            setTravelSelected({});
          })
          .catch((error: AxiosError) => {
            swal({
              title: error.response?.data.response,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleDisabledCalls = () => {
    swal({
      title: "Deseja desabilitar esse tipo de chamada?",
      icon: "info",
      text: "Essa ação pode ser revertida",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        if (pricesSelected?.id === undefined) {
          swal({
            title: "Salve os primeiro para poder desabilitar",
            icon: "warning",
          });
          setLoading(false);
        } else {
          api
            .delete(`price/${pricesSelected?.id}`)
            .then((response) => {
              setLoading(false);
              if (response.status) {
                swal({
                  title: "Tipo de viagem desabilidade com sucesso",
                  icon: "success",
                  text: "Você pode reativar a qualquer momento",
                });
                getCommissionsDriver();
                getPrices();
                getTypesTravels();
                setTravelSelected({});
              } else {
                swal({
                  title: "Ocorreu um erro ao desabilitar chamado",
                  icon: "error",
                });
              }
            })
            .catch((error: AxiosError) => {
              swal({
                title: error.response?.data.response,
                icon: "error",
              });
            })
            .finally(() => {
              setLoading(false);
            });
        }
      }
    });
  };

  const handleChangePaymentsCommissions = (
    index: number,
    field: "tripPaymentFormId" | "value" | "valueType",
    value: string
  ) => {
    const updateObject = [...commissionPaymentForms];
    updateObject[index][field] = value;
    setCommissionPaymentForms(updateObject);
  };

  const handleUpdatedRates = async (
    event: FormEvent<HTMLFormElement>,
    value: string
  ) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const idUpdated = formData.get("id");
    const nameRatesUpdated = formData.get("nameRates");
    const descriptionRatesUpdated = formData.get("descriptionRates");
    const selectChargedRatesUpdated = formData.get("selectChargedRates");
    const valueTypeUpdated = formData.get("valueType");
    const isActiveUpdated = formData.get("isActive");

    if (!nameRatesUpdated) {
      swal({
        title: "Alerta",
        text: "Preencha o campo Nome de Taxas",
        icon: "warning",
      });
      return;
    }

    if (!descriptionRatesUpdated) {
      swal({
        title: "Alerta",
        text: "Preencha o campo descrição",
        icon: "warning",
      });
      return;
    }

    swal({
      title: "Você confirma a atualização desta taxa?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);

        const isActivedFormated =
          String(isActiveUpdated) === "on" ? true : false;

        const objectSend = {
          active: isActivedFormated,
          chargeBy: selectChargedRatesUpdated,
          cityId: cityId,
          description: descriptionRatesUpdated,
          name: nameRatesUpdated,
          tripTypeId: travelSelected.idTripType,
          value: Utils.BrlToNumber(value, "positive"),
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
          .catch((error: AxiosError) => {
            swal({
              title: error.response?.data.response,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleAddRates = async () => {
    if (nameRates.length <= 0) {
      swal({
        title: "Alerta",
        text: "Preencha o campo Nome de Taxas",
        icon: "warning",
      });
      return;
    }

    if (descriptionRates.length <= 0) {
      swal({
        title: "Alerta",
        text: "Preencha o campo descrição",
        icon: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const objectSend = {
        active: statusActiveRates,
        chargeBy: selectCharged,
        cityId: cityId,
        description: descriptionRates,
        name: nameRates,
        tripTypeId: travelSelected.idTripType,
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
      const responseError = error as AxiosError;

      swal({
        title: responseError.response?.data.message,
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
          .catch((error: AxiosError) => {
            swal({
              title: error.response?.data.response,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleAddCashback = async () => {
    setLoading(true);
    try {
      const responseCashback = await api.post("cashback", {
        //@ts-ignore
        value: valueCashback.replaceAll(",", "."),
        valueType: valueTypeCashback,
        cityId: cityId,
        tripTypeId: travelSelected.idTripType,
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
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
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
            const responseError = error as AxiosError;
            swal({
              title: responseError.response?.data.message,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleAddRangePrice = async () => {
    if (
      Utils.BrlToNumber(minValue, "positive") >
      Utils.BrlToNumber(maxValue, "positive")
    ) {
      swal({
        title: "O preço inicial não pode ser maior que o preço final",
        icon: "warning",
      });
      return;
    }

    if (descriptionPriceRange.length <= 0) {
      swal({
        title: "Descrição é obrigatória",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const objectSend = {
        cityId: cityId,
        description: descriptionPriceRange,
        max_value: Utils.BrlToNumber(maxValue, "positive"),
        min_value: Utils.BrlToNumber(minValue, "positive"),
        new_value: Utils.BrlToNumber(newValue, "positive"),
        tripTypeId: travelSelected.idTripType,
      };
      const responseRangePrice = await api.post("price/range", objectSend);
      if (responseRangePrice.status) {
        swal({
          title: "Atualizado com sucesso",
          icon: "success",
        });
        setDescritpionPriceRange("");
        setMaxValue("0,00");
        setMinValue("0,00");
        setNewValue("0,00");
        getPricesRange();
      } else {
        swal({
          title: "Erro ao inserir faixa de preço",
          text: "Certifique que não existe uma faixa com os mesmos valores",
          icon: "info",
        });
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handleDeletePriceRange = (id: number) => {
    swal({
      title: "Deseja deletar essa faixa de preço?",
      text: "Esta ação é irreversível",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      setLoading(true);
      if (isAccept) {
        setLoading(false);
        api
          .delete(`price/range/${id}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Preço apagado com sucesso",
                icon: "success",
              });
              getPricesRange();
            }
          })
          .catch((error: AxiosError) => {
            swal({
              title: error.response?.data.response,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const getPrices = async () => {
    try {
      const responsePrices = await api.get(`price?cityId=${cityId}`);

      const pricesTypes = (responsePrices.data.response || []).filter(
        (data: ListPricesProps) => data?.trip_type?.serviceOption === 1
      );

      setListPrices(pricesTypes);
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
  };

  const getTripPayments = async () => {
    setLoading(true);
    try {
      const responseTripPayments = await api.get("tripPaymentForm");
      setTripPaymentsForms(responseTripPayments.data.response);

      let listCommission: CommissionPaymentFormProps[] = [];

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
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValues((prevState) => ({
      ...prevState,
      [name]: Mask.setMaskMoney(value),
    }));
  };

  useEffect(() => {
    if (Object.keys(travelSelected).length > 0) {
      const listFiltered = listPrices.filter(
        (data) => data.tripTypeId === travelSelected.idTripType
      );
      setPricesSelected(listFiltered[0]);
    }
  }, [travelSelected]);

  useEffect(() => {
    getPricesRange();
    getRates();
  }, [travelSelected]);

  useEffect(() => {
    if (Object.keys(travelSelected).length > 0) {
      getCashBacks();
    }
  }, [travelSelected]);

  useEffect(() => {
    commissions = driverCommissions.filter(
      (data) => data.tripTypeId === travelSelected.idTripType
    );
  }, [travelSelected]);

  useEffect(() => {
    getTypesTravels();
    getPrices();
    getTripPayments();
    getCommissionsDriver();
  }, []);

  useEffect(() => {
    if (pricesSelected) {
      const filteredCommissions = driverCommissions.filter(
        (data) => data.tripTypeId === pricesSelected.tripTypeId
      );
      const dataFormPayments = filteredCommissions[0]?.commissions_payment_form;
      if (Array.isArray(dataFormPayments)) {
        dataFormPayments.map((value, index) => {
          handleChangePaymentsCommissions(
            index,
            "value",
            Mask.setMaskMoneyAlternative(value.value as number)
          );
          handleChangePaymentsCommissions(index, "valueType", value.valueType);
        });
      }
      setTaxRate(Mask.setMaskMoneyAlternative(pricesSelected.tax_price));
      setDescriptionTaxRate(pricesSelected.tax_price_description);
      setValueSurchase(
        Mask.setMaskMoneyAlternative(pricesSelected.another_fee)
      );
      setDescriptionSurchase(pricesSelected.another_fee_description);
      setTag(pricesSelected.tag);
      setColorTag(pricesSelected.color);
      setMinPrice(Mask.setMaskMoneyAlternative(pricesSelected.min_price));
      // setPromotionalPriceTem(
      //   Mask.setMaskMoneyAlternative(pricesSelected.promotional_price_temp)
      // );
      setBasePrice(Mask.setMaskMoneyAlternative(pricesSelected.base_price));
      setKmPrice(Mask.setMaskMoneyAlternative(pricesSelected.km_price));
      setMinutePrice(Mask.setMaskMoneyAlternative(pricesSelected.minute_price));
      setWayPointPrice(
        Mask.setMaskMoneyAlternative(pricesSelected.waypoint_price)
      );
      setLongDistanceKm(
        Mask.setMaskMoneyAlternative(pricesSelected.long_distance_per_km)
      );
      setRewardDriverMinPrice(
        Mask.setMaskMoneyAlternative(pricesSelected.reward_driver_min_price)
      );
      setIdeaListCommonPrice(pricesSelected.idealListCommonPrice);
      setDisableAfterKm(
        pricesSelected.disable_after_km !== null
          ? Mask.setMaskMoneyAlternative(pricesSelected.disable_after_km)
          : "0,00"
      );
      setTypeAdditionalValueAfterKm(
        pricesSelected.type_additional_value_after_km
      );
      setKmToAdditionalValue(
        Mask.setMaskMoneyAlternative(pricesSelected.km_to_additional_value)
      );
      setAdditionalValueAfterKm(
        Mask.setMaskMoneyAlternative(pricesSelected.additional_value_after_km)
      );
      setLongDistanceRadius(pricesSelected.long_distance_radius);
      setLongDistanceValueToFinalPrice(
        pricesSelected.long_distance_value_to_final_price === 1 ? true : false
      );
      setValueCalcDriver(Mask.setMaskMoneyAlternative(commissions[0]?.value));
      setValueTypeCalcDriver(commissions[0]?.valueType);
      setDisableOnPromotion(
        commissions[0]?.disableOnPromotion === 1 ? true : false
      );
    } else {
      setTaxRate("0,00");
      setDescriptionTaxRate(null);
      setValueSurchase("0,00");
      setDescriptionSurchase(null);
      setTag("");
      setColorTag(theme_colors.black);
      setMinPrice("0,00");
      setBasePrice("0,00");
      setKmPrice("0,00");
      setMinutePrice("0,00");
      setWayPointPrice("0,00");
      setLongDistanceKm("0,00");
      setRewardDriverMinPrice("0,00");
      setIdeaListCommonPrice(0);
      setDisableAfterKm("0,00");
      setTypeAdditionalValueAfterKm("$");
      setKmToAdditionalValue("0,00");
      setAdditionalValueAfterKm("0,00");
      setLongDistanceRadius(0);
      setLongDistanceValueToFinalPrice(false);
      setValueCalcDriver("0,00");
      setValueTypeCalcDriver("%");
      setDisableOnPromotion(false);
    }
  }, [pricesSelected]);

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

  let listTravelsDisabled = typesTravels.filter((item) => {
    return (
      listPrices.filter((data) => {
        return Number(item.idTripType) === Number(data.trip_type?.idTripType ?? data.tripTypeId);
      }).length === 0
    );
  });

  if (loading) return <Loader spinning />;

  return (
    <Container>
      <Preload visible={loading} />
      <ContentTypesTravels>
        <ButtonAddNewTariff onClick={() => setVisibleModal(true)}>
          Adicionar serviço
        </ButtonAddNewTariff>
        <ContentListTypesTravels>
          {listPrices.map((value) => {
            return (
              <CardTariff
                key={value.trip_type.idTripType}
                selected={
                  travelSelected.idTripType === value.trip_type.idTripType
                }
                onClick={() => handleSelectTravel(value.trip_type)}
              >
                <ImageTariff
                  src={
                    value.trip_type?.picture
                      ? (value.trip_type.picture.startsWith("http")
                          ? value.trip_type.picture
                          : `https://minio.704app.com.br/rota101fb704/tripType/${value.trip_type.picture}`)
                      : "/default-trip-icon.png"
                  }
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = "/default-trip-icon.png";
                  }}
                />
                <TitleCardTariff>{value.trip_type?.type}</TitleCardTariff>
                <TextCardTariff>{`Id: ${value.trip_type?.idTripType}`}</TextCardTariff>
              </CardTariff>
            );
          })}
        </ContentListTypesTravels>
      </ContentTypesTravels>

      {Object.keys(travelSelected).length > 0 ? (
        <ContentDetailsTariffs>
          <ConfigDetailsTariffs>
            <ContentListOptionsDetailsTariffs>
              <Collapse>
                <Collapse.Panel header="Política de preço" key={1}>
                  <ContentPricePolicy>
                    <ContentInputs>
                      <LabelText>ETIQUETA (TAG)</LabelText>
                      <Input
                        type="text"
                        value={tag}
                        onChange={(event) => setTag(event.target.value)}
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>COR DA ETIQUETA(10)</LabelText>
                      <input
                        type="color"
                        value={colorTag}
                        onChange={(event) => setColorTag(event.target.value)}
                      />
                    </ContentInputs>
                  </ContentPricePolicy>
                  <ContentPricePolicy>
                    <ContentInputs>
                      <LabelText>PREÇO MÍNIMO*</LabelText>
                      <Input
                        type="text"
                        value={minPrice}
                        onChange={(event) =>
                          setMinPrice(Mask.setMaskMoney(event.target.value))
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>PREÇO BASE*</LabelText>
                      <Input
                        type="text"
                        value={basePrice}
                        onChange={(event) =>
                          setBasePrice(Mask.setMaskMoney(event.target.value))
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>PREÇO KM DESLOCAMENTO*</LabelText>
                      <Input
                        type="text"
                        value={kmPrice}
                        onChange={(event) =>
                          setKmPrice(Mask.setMaskMoney(event.target.value))
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>PREÇO MINUTO*</LabelText>
                      <Input
                        type="text"
                        value={minutePrice}
                        onChange={(event) =>
                          setMinutePrice(Mask.setMaskMoney(event.target.value))
                        }
                      />
                    </ContentInputs>
                  </ContentPricePolicy>
                  <ContentPricePolicy>
                    <ContentInputs>
                      <LabelText>TAXA DE IMPOSTO</LabelText>
                      <Input
                        type="text"
                        value={taxRate}
                        onChange={(event) =>
                          setTaxRate(Mask.setMaskMoney(event.target.value))
                        }
                      />
                      <Radio.Group
                        onChange={(event) => setTypeTaxRate(event.target.value)}
                        value={typeTaxRate}
                      >
                        <Radio value="%" checked>
                          %
                        </Radio>
                        <Radio value="$">$</Radio>
                      </Radio.Group>
                    </ContentInputs>
                    <LabelText>DESCRIÇÃO (TAXA DE IMPOSTO)</LabelText>
                    <Input.TextArea
                      rows={5}
                      cols={33}
                      value={
                        descriptionTaxRate === null ? "" : descriptionTaxRate
                      }
                      onChange={(event) =>
                        setDescriptionTaxRate(event.target.value)
                      }
                    />
                  </ContentPricePolicy>
                  <ContentPricePolicy>
                    <ContentInputs>
                      <LabelText>TAXA EXTRA</LabelText>
                      <Input
                        type="text"
                        value={valueSurchase}
                        onChange={(event) =>
                          setValueSurchase(
                            Mask.setMaskMoney(event.target.value)
                          )
                        }
                      />
                      <Radio.Group
                        onChange={(event) =>
                          setTypeValueSurchase(event.target.value)
                        }
                        value={typeValueSurchase}
                      >
                        <Radio value="%" checked>
                          %
                        </Radio>
                        <Radio value="$">$</Radio>
                      </Radio.Group>
                    </ContentInputs>
                    <LabelText>DESCRIÇÃO (TAXA EXTRA)</LabelText>
                    <Input.TextArea
                      rows={5}
                      cols={33}
                      value={
                        descriptionSurchase === null ? "" : descriptionSurchase
                      }
                      onChange={(event) =>
                        setDescriptionSurchase(event.target.value)
                      }
                    />
                  </ContentPricePolicy>
                </Collapse.Panel>
                <Collapse.Panel header="Taxa Spread" key={2}>
                  <ContentPricePolicy>
                    <ContentInputs>
                      <LabelText>TAXA DE SERVIÇO</LabelText>
                      <Input
                        type="text"
                        value={valueCalcDriver}
                        onChange={(event) =>
                          setValueCalcDriver(
                            Mask.setMaskMoney(event.target.value)
                          )
                        }
                      />
                      <Radio.Group
                        value={valueTypeCalcDriver}
                        onChange={(event) =>
                          setValueTypeCalcDriver(event.target.value)
                        }
                        name="valueType"
                      >
                        <Radio value="%">%</Radio>
                        <Radio value="$">$</Radio>
                      </Radio.Group>
                    </ContentInputs>
                    <Checkbox
                      checked={disableOnPromotion}
                      onChange={(event) =>
                        setDisableOnPromotion(event.target.checked)
                      }
                    />
                    <label>Desabilitar comissão no preço promocional</label>
                  </ContentPricePolicy>
                </Collapse.Panel>
                <Collapse.Panel header="Formas de Pagamentos/Taxas" key={3}>
                  <ContentPricePolicy>
                    {tripPaymentsForms &&
                      tripPaymentsForms.map((value, index) => {
                        return (
                          <Fragment key={value?.idTripPaymentForm}>
                            {value?.active === 1 ? (
                              <ContentInputs>
                                <LabelText>{value?.name}</LabelText>
                                <Input
                                  type="tel"
                                  autoComplete="off"
                                  value={Mask.setMaskMoney(
                                    String(commissionPaymentForms[index].value)
                                  )}
                                  onChange={(event) =>
                                    handleChangePaymentsCommissions(
                                      index,
                                      "value",
                                      Mask.setMaskMoney(event.target.value)
                                    )
                                  }
                                />
                                <Radio.Group
                                  value={
                                    commissionPaymentForms[index].valueType
                                  }
                                  onChange={(event) =>
                                    handleChangePaymentsCommissions(
                                      index,
                                      "valueType",
                                      event.target.value
                                    )
                                  }
                                  name="valueType"
                                >
                                  <Radio value="%">%</Radio>
                                  <Radio value="$">$</Radio>
                                </Radio.Group>
                              </ContentInputs>
                            ) : null}
                          </Fragment>
                        );
                      })}
                  </ContentPricePolicy>
                </Collapse.Panel>
                <Collapse.Panel header="CashBack" key={4}>
                  <ContentPricePolicy>
                    <ContentInputs>
                      <Input
                        type="text"
                        value={valueCashback}
                        onChange={(event) =>
                          setValueCashback(
                            Mask.setMaskMoney(event.target.value)
                          )
                        }
                      />
                      <Radio.Group
                        onChange={(event) =>
                          setValueTypeCashback(event.target.value)
                        }
                        value={valueTypeCashback}
                      >
                        <Radio value="%" checked>
                          %
                        </Radio>
                        <Radio value="$">$</Radio>
                      </Radio.Group>
                    </ContentInputs>
                    <ContentInputs>
                      <Switch
                        size="small"
                        onChange={onChangeSwitchFinalPrice}
                      />
                      <LabelText>Soma a tarifa final</LabelText>
                    </ContentInputs>
                    <h3>Saldo direcionado para</h3>
                    <ContentInputs
                      style={{
                        justifyContent: "initial",
                      }}
                    >
                      <Radio.Group
                        onChange={(event) =>
                          setBackToTripBalance(event.target.value)
                        }
                        value={backToTripBalance}
                      >
                        <Radio value={true}>Voucher</Radio>
                        <Radio value={false}>Conta App</Radio>
                      </Radio.Group>
                    </ContentInputs>
                    <ContentTable>
                      <table
                        style={{
                          width: "100%",
                        }}
                      >
                        <THead>
                          <tr>
                            <th>Criado em</th>
                            <th>Valor</th>
                          </tr>
                        </THead>
                        <TBody>
                          {cashBacks &&
                            cashBacks.map((value) => {
                              return (
                                <tr key={value.id}>
                                  <th>
                                    {new Date(
                                      value.created_at
                                    ).toLocaleString()}
                                  </th>
                                  <th>{`${
                                    value.valueType
                                  } ${Mask.setMaskMoneyAlternative(
                                    value.value
                                  )}`}</th>
                                  <th>
                                    <ButtonDelete
                                      onClick={() =>
                                        handleDeleteCashback(value.id)
                                      }
                                    >
                                      <AiOutlineClose
                                        size={20}
                                        fontWeight="bold"
                                      />
                                    </ButtonDelete>
                                  </th>
                                </tr>
                              );
                            })}
                        </TBody>
                      </table>
                    </ContentTable>
                    <ContentBtnSaveCashBack>
                      <ButtonAntd type="primary" onClick={handleAddCashback}>
                        Salvar Cashback
                      </ButtonAntd>
                    </ContentBtnSaveCashBack>
                  </ContentPricePolicy>
                </Collapse.Panel>
                <Collapse.Panel header="Faixa de preços" key={5}>
                  <LabelText>Descrição</LabelText>
                  <Input.TextArea
                    rows={5}
                    cols={33}
                    value={descriptionPriceRange}
                    onChange={(event) =>
                      setDescritpionPriceRange(event.target.value)
                    }
                  />
                  <ContentInputs>
                    <ContentColumnInputs>
                      <LabelText>De R$</LabelText>
                      <Input
                        type="text"
                        value={minValue}
                        onChange={(event) =>
                          setMinValue(Mask.setMaskMoney(event.target.value))
                        }
                      />
                    </ContentColumnInputs>
                    <ContentColumnInputs>
                      <LabelText>Até R$</LabelText>
                      <Input
                        type="text"
                        value={maxValue}
                        onChange={(event) =>
                          setMaxValue(Mask.setMaskMoney(event.target.value))
                        }
                      />
                    </ContentColumnInputs>
                    <span
                      style={{
                        marginTop: 20,
                      }}
                    >
                      =
                    </span>
                    <ContentColumnInputs>
                      <LabelText>Cobrar R$</LabelText>
                      <Input
                        type="text"
                        value={newValue}
                        onChange={(event) =>
                          setNewValue(Mask.setMaskMoney(event.target.value))
                        }
                      />
                    </ContentColumnInputs>
                    <ButtonAntd type="primary" onClick={handleAddRangePrice}>
                      Salvar
                    </ButtonAntd>
                  </ContentInputs>
                  <ContentTable>
                    <table
                      style={{
                        width: "100%",
                      }}
                    >
                      <THead>
                        <tr>
                          <th>Nome</th>
                          <th>Inicial</th>
                          <th>Final</th>
                          <th>Fixo</th>
                          <th>Tipo</th>
                        </tr>
                      </THead>
                      <TBody>
                        {datasPriceRange &&
                          datasPriceRange.map((value) => {
                            return (
                              <Fragment key={value.id}>
                                <tr>
                                  <th colSpan={5}>{value.description}</th>
                                </tr>
                                <tr>
                                  <th>
                                    {value.created_at
                                      ? new Date(
                                          value.created_at
                                        ).toLocaleDateString()
                                      : "-"}
                                  </th>
                                  <th>
                                    {`R$ ${Mask.setMaskMoneyAlternative(
                                      value.min_value
                                    )}`}
                                  </th>
                                  <th>
                                    {`R$ ${Mask.setMaskMoneyAlternative(
                                      value.max_value
                                    )}`}
                                  </th>
                                  <th>
                                    {`R$ ${Mask.setMaskMoneyAlternative(
                                      value.new_value
                                    )}`}
                                  </th>
                                  <th>{value.trip_type?.type || value.tripTypeName || "Geral"}</th>
                                  <th>
                                    <ButtonClosePrices
                                      onClick={() =>
                                        handleDeletePriceRange(value.id)
                                      }
                                    >
                                      X
                                    </ButtonClosePrices>
                                  </th>
                                </tr>
                              </Fragment>
                            );
                          })}
                      </TBody>
                    </table>
                  </ContentTable>
                </Collapse.Panel>
                <Collapse.Panel header="Taxas" key={6}>
                  {allRates.map((value, index) => {
                    return (
                      <form
                        onSubmit={(event) =>
                          handleUpdatedRates(
                            event,
                            inputValues[`valueRates-${index}`]
                          )
                        }
                        key={value.id}
                      >
                        <ContentInputs>
                          <ContentColumnInputs>
                            <input type="hidden" name="id" value={value.id} />
                            <LabelText>Nome da taxa</LabelText>
                            <Input
                              type="text"
                              defaultValue={value.name}
                              name="nameRates"
                              id="nameRates"
                            />
                          </ContentColumnInputs>
                          <ContentColumnInputs>
                            <LabelText>Valor a ser cobrado</LabelText>
                            <Input
                              type="text"
                              defaultValue={Mask.setMaskMoneyAlternative(
                                value.value
                              )}
                              value={inputValues[`valueRates-${index}`] || ""}
                              onChange={handleInputChange}
                              name={`valueRates-${index}`}
                              id={`valueRates-${index}`}
                            />
                          </ContentColumnInputs>
                        </ContentInputs>
                        <LabelText>Descrição</LabelText>
                        <TextArea
                          rows={5}
                          cols={33}
                          defaultValue={value.description}
                          name="descriptionRates"
                        />
                        <ContentInputs>
                          <ContentColumnInputs>
                            <LabelText>Quem será cobrado</LabelText>
                            <Select
                              name="selectChargedRates"
                              defaultValue={value.chargeBy}
                            >
                              <option value="driver">Motorista</option>
                              <option value="customer">Cliente</option>
                            </Select>
                          </ContentColumnInputs>
                          <ContentColumnInputs>
                            <LabelText>Tipo de cobrança</LabelText>
                            <ContentInputs>
                              <Radio.Group
                                defaultValue={value.valueType}
                                name="valueType"
                              >
                                <Radio value="%">%</Radio>
                                <Radio value="$">$</Radio>
                              </Radio.Group>
                            </ContentInputs>
                          </ContentColumnInputs>
                          <ContentColumnInputs>
                            <LabelText>Status</LabelText>
                            <ContentInputs
                              style={{
                                justifyContent: "center",
                                gap: 2,
                              }}
                            >
                              <Checkbox
                                defaultChecked={
                                  value.active === 1 ? true : false
                                }
                                name="isActive"
                              />
                              <LabelText>Ativada</LabelText>
                            </ContentInputs>
                          </ContentColumnInputs>
                        </ContentInputs>
                        <ContentInputs
                          style={{
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            color={theme_colors.primary_antd}
                            type="submit"
                          >
                            Atualizar
                          </Button>
                          <Button
                            color={theme_colors.red_crismon}
                            type="button"
                            onClick={() => handeDeleteRates(value.id)}
                          >
                            Excluir
                          </Button>
                        </ContentInputs>
                      </form>
                    );
                  })}
                  {isShowNewRates ? (
                    <>
                      <ContentInputs>
                        <ContentColumnInputs>
                          <LabelText>Nome da taxa</LabelText>
                          <Input
                            type="text"
                            value={nameRates}
                            onChange={(event) =>
                              setNameRates(event.target.value)
                            }
                          />
                        </ContentColumnInputs>
                        <ContentColumnInputs>
                          <LabelText>Valor a ser cobrado</LabelText>
                          <Input
                            type="text"
                            value={valueRates}
                            onChange={(event) =>
                              setValueRates(
                                Mask.setMaskMoney(event.target.value)
                              )
                            }
                          />
                        </ContentColumnInputs>
                      </ContentInputs>
                      <LabelText>Descrição</LabelText>
                      <TextArea
                        rows={5}
                        cols={33}
                        onChange={(event) =>
                          setDescriptionRates(event.target.value)
                        }
                      />
                      <ContentInputs>
                        <ContentColumnInputs>
                          <LabelText>Quem será cobrado</LabelText>
                          <SelectAntd
                            onChange={selectChargedRates}
                            defaultValue="driver"
                          >
                            <SelectAntd.Option value="driver">
                              Motorista
                            </SelectAntd.Option>
                            <SelectAntd.Option value="customer">
                              Cliente
                            </SelectAntd.Option>
                          </SelectAntd>
                        </ContentColumnInputs>
                        <ContentColumnInputs>
                          <LabelText>Tipo de cobrança</LabelText>
                          <ContentInputs>
                            <Radio.Group
                              onChange={(event) =>
                                setTypeChargeRates(event.target.value)
                              }
                              value={typeChargeRates}
                            >
                              <Radio value="%" checked>
                                %
                              </Radio>
                              <Radio value="$">$</Radio>
                            </Radio.Group>
                          </ContentInputs>
                        </ContentColumnInputs>
                        <ContentColumnInputs>
                          <LabelText>Status</LabelText>
                          <ContentInputs
                            style={{
                              justifyContent: "center",
                              gap: 2,
                            }}
                          >
                            <Switch
                              size="small"
                              onChange={(checked) =>
                                setStatusActiveRates(checked)
                              }
                            />
                            <LabelText>Ativada</LabelText>
                          </ContentInputs>
                        </ContentColumnInputs>
                      </ContentInputs>
                      <ContentInputs
                        style={{
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          color={theme_colors.primary_antd}
                          onClick={handleAddRates}
                        >
                          Criar
                        </Button>
                      </ContentInputs>
                    </>
                  ) : null}
                  {!isShowNewRates ? (
                    <ContentInputs
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      <ButtonAntd
                        type="primary"
                        onClick={() => setIsShowNewRates(true)}
                      >
                        Nova Taxa
                      </ButtonAntd>
                    </ContentInputs>
                  ) : null}
                </Collapse.Panel>
              </Collapse>
            </ContentListOptionsDetailsTariffs>
            <ContentButtons>
              <ButtonAntd
                type="primary"
                size="large"
                onClick={handleUpdateTariffs}
              >
                ATUALIZAR
              </ButtonAntd>
              <ButtonAntd size="large" onClick={handleDisabledCalls}>
                DESABILITAR SERVIÇO
              </ButtonAntd>
            </ContentButtons>
          </ConfigDetailsTariffs>
          <ContentLogoApp>
            <ImageLogoApp src={import.meta.env.LOGO_APP} />
          </ContentLogoApp>
        </ContentDetailsTariffs>
      ) : null}

      <ModalNewServices
        datasTariffs={listTravelsDisabled}
        setVisible={setVisibleModal}
        visible={visibleModal}
        listPrices={listPrices}
        setListPrices={setListPrices}
        onSelect={handleSelectTravel}
      />
    </Container>
  );
};
