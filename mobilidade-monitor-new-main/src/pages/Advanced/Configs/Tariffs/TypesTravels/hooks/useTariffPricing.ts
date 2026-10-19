import { useEffect, useMemo, useState } from "react";
import swal from "sweetalert";

import api from "../../../../../../services/api";
import Mask from "../../../../../../services/Mask";
import { ListPricesProps, TypesTravelsProps } from "../types";

// Política de preço/tarifa do tipo de viagem selecionado (preço base, km,
// minuto, tempo em espera, taxa de imposto/extra, longa distância, limites
// flutuantes). Não inclui comissão do motorista (ver useDriverCommission).
export const useTariffPricing = (
  cityId: number,
  customOrderConfig: boolean,
  travelSelected: TypesTravelsProps,
  setLoading: (loading: boolean) => void
) => {
  const [listPrices, setListPrices] = useState<ListPricesProps[]>([]);
  const [pricesSelected, setPricesSelected] = useState<ListPricesProps | null>(
    null
  );

  const [tag, setTag] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("0,00");
  const [colorTag, setColorTag] = useState<string>("");
  const [promotionalPriceTemp, setPromotionalPriceTem] =
    useState<string>("0,00");
  const [basePrice, setBasePrice] = useState<string>("0,00");
  const [kmPrice, setKmPrice] = useState<string>("0,00");
  const [minutePrice, setMinutePrice] = useState<string>("0,00");
  const [wayPointPrice, setWayPointPrice] = useState<string>("0,00");
  const [longDistanceRadius, setLongDistanceRadius] = useState<number>(0);
  const [longDistanceKm, setLongDistanceKm] = useState<string>("0,00");
  const [rewardDriverMinPrice, setRewardDriverMinPrice] =
    useState<string>("0,00");
  const [ideaListCommonPrice, setIdeaListCommonPrice] = useState<number>(5);
  const [disableAfterKm, setDisableAfterKm] = useState<string>("0,00");
  const [additionalValueAfterKm, setAdditionalValueAfterKm] =
    useState<string>("0,00");
  const [kmToAdditionalValue, setKmToAdditionalValue] =
    useState<string>("0,00");
  const [typeAdditionalValueAfterKm, setTypeAdditionalValueAfterKm] =
    useState<string>("$");
  const [longDistanceValueToFinalPrice, setLongDistanceValueToFinalPrice] =
    useState<boolean>(false);

  const [waitingToleranceSeconds, setWaitingToleranceSeconds] = useState("");
  const [waitingPenaltyFee, setWaitingPenaltyFee] = useState("");
  const [waitingExtraFeePerMinute, setWaitingExtraFeePerMinute] = useState("");

  const [taxRate, setTaxRate] = useState<string>("0,00");
  const [typeTaxRate, setTypeTaxRate] = useState<"%" | "$">("%");
  const [descriptionTaxRate, setDescriptionTaxRate] = useState<string | null>(
    null
  );

  const [valueSurchase, setValueSurchase] = useState<string>("0,00");
  const [typeValueSurchase, setTypeValueSurchase] = useState<"%" | "$">("%");
  const [descriptionSurchase, setDescriptionSurchase] = useState<
    string | null
  >(null);

  const [floatingLimitsOfferMin, setFloatingLimitsOfferMin] =
    useState<string>("0,00");
  const [floatingLimitsOfferMax, setFloatingLimitsOfferMax] =
    useState<string>("0,00");
  const [floatingLimitsThirdPartyEnabled, setFloatingLimitsThirdPartyEnabled] =
    useState<boolean>(false);
  const [floatingLimitsThirdPartyMin, setFloatingLimitsThirdPartyMin] =
    useState<string>("0,00");
  const [floatingLimitsThirdPartyMax, setFloatingLimitsThirdPartyMax] =
    useState<string>("0,00");

  const priceOrderMap = useMemo(() => {
    return new Map<number, number | null>(
      listPrices.map((p) => [p.tripTypeId as number, p.order ?? null])
    );
  }, [listPrices]);

  const isNoTravelSelected = Object.keys(travelSelected).length === 0;

  const getPrices = async (useCustomOrderParam?: boolean) => {
    setLoading(true);
    try {
      const responsePrices = await api.get(`price?cityId=${cityId}`, {
        headers: { cityid: cityId },
      });
      const rawPrices = responsePrices.data?.response || [];
      const pricesTypes = (Array.isArray(rawPrices) ? rawPrices : []).filter(
        (data: ListPricesProps) =>
          data &&
          data.trip_type &&
          Number(data.trip_type.serviceOption ?? 0) === 0
      );

      const shouldApplyCustomOrder =
        useCustomOrderParam !== undefined
          ? useCustomOrderParam
          : customOrderConfig;

      let sortedPrices;
      if (shouldApplyCustomOrder) {
        sortedPrices = pricesTypes.sort(
          (a: ListPricesProps, b: ListPricesProps) => {
            const orderA = a.order === null ? 999 : a.order;
            const orderB = b.order === null ? 999 : b.order;
            return orderA - orderB;
          }
        );
      } else {
        sortedPrices = pricesTypes;
      }

      setListPrices(sortedPrices);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisabledCalls = (
    onSuccess: () => void
  ) => {
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
                getPrices();
                onSuccess();
              } else {
                swal({
                  title: "Ocorreu um erro ao desabilitar chamado",
                  icon: "error",
                });
              }
            })
            .catch((error) => {
              console.log(error);
              swal({
                title: "Erro ao desabilitar chamado",
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

  useEffect(() => {
    if (!isNoTravelSelected) {
      const selectedId = Number(travelSelected.idTripType);
      const listFiltered = listPrices.filter(
        (data) =>
          Number(data.tripTypeId ?? data.trip_type?.idTripType) === selectedId
      );
      setPricesSelected(listFiltered[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelSelected, listPrices]);

  useEffect(() => {
    if (pricesSelected) {
      console.log(Mask.setMaskMoneyAlternative(pricesSelected.min_price));
      setTaxRate(Mask.setMaskMoneyAlternative(pricesSelected.tax_price));
      setDescriptionTaxRate(pricesSelected.tax_price_description);
      setValueSurchase(
        Mask.setMaskMoneyAlternative(pricesSelected.another_fee)
      );
      setDescriptionSurchase(pricesSelected.another_fee_description);
      setTypeValueSurchase(pricesSelected.another_fee_type === "$" ? "$" : "%");

      setTag(pricesSelected.tag);
      setColorTag(pricesSelected.color);
      setMinPrice(Mask.setMaskMoneyAlternative(pricesSelected.min_price));
      setPromotionalPriceTem(
        Mask.setMaskMoneyAlternative(pricesSelected.promotional_price_temp)
      );
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
      setWaitingToleranceSeconds(
        String(pricesSelected?.waiting_tolerance_seconds || 0)
      );
      setWaitingPenaltyFee(
        Mask.setMaskMoney(pricesSelected.waiting_penalty_fee)
      );
      setWaitingExtraFeePerMinute(
        Mask.setMaskMoney(pricesSelected.waiting_extra_fee_per_minute)
      );

      setFloatingLimitsOfferMin(
        Mask.setMaskMoneyAlternative(pricesSelected.percentage_min_offer || 0)
      );
      setFloatingLimitsOfferMax(
        Mask.setMaskMoneyAlternative(pricesSelected.percentage_max_offer || 0)
      );
      setFloatingLimitsThirdPartyMin(
        Mask.setMaskMoneyAlternative(
          pricesSelected.percentage_min_trip_partner || 0
        )
      );
      setFloatingLimitsThirdPartyMax(
        Mask.setMaskMoneyAlternative(
          pricesSelected.percentage_max_trip_partner || 0
        )
      );
      setFloatingLimitsThirdPartyEnabled(
        pricesSelected.percentage_max_trip_partner
          ? pricesSelected.percentage_max_trip_partner > 0
          : false
      );
    } else {
      setTaxRate("0,00");
      setDescriptionTaxRate(null);
      setValueSurchase("0,00");
      setDescriptionSurchase(null);
      setTag("");
      setColorTag("#000000");
      setMinPrice("0,00");
      setPromotionalPriceTem("0,00");
      setBasePrice("0,00");
      setKmPrice("0,00");
      setMinutePrice("0,00");
      setWayPointPrice("0,00");
      setLongDistanceKm("0,00");
      setRewardDriverMinPrice("0,00");
      setIdeaListCommonPrice(5);
      setDisableAfterKm("0,00");
      setTypeAdditionalValueAfterKm("$");
      setKmToAdditionalValue("0,00");
      setAdditionalValueAfterKm("0,00");
      setLongDistanceRadius(0);
      setLongDistanceValueToFinalPrice(false);
      setWaitingToleranceSeconds("");
      setWaitingPenaltyFee("");
      setWaitingExtraFeePerMinute("");
      setFloatingLimitsOfferMin("0,00");
      setFloatingLimitsOfferMax("0,00");
      setFloatingLimitsThirdPartyEnabled(false);
      setFloatingLimitsThirdPartyMin("0,00");
      setFloatingLimitsThirdPartyMax("0,00");
    }
  }, [pricesSelected]);

  return {
    listPrices,
    setListPrices,
    pricesSelected,
    setPricesSelected,
    priceOrderMap,
    getPrices,
    handleDisabledCalls,
    tag,
    setTag,
    minPrice,
    setMinPrice,
    colorTag,
    setColorTag,
    promotionalPriceTemp,
    setPromotionalPriceTem,
    basePrice,
    setBasePrice,
    kmPrice,
    setKmPrice,
    minutePrice,
    setMinutePrice,
    wayPointPrice,
    setWayPointPrice,
    longDistanceRadius,
    setLongDistanceRadius,
    longDistanceKm,
    setLongDistanceKm,
    rewardDriverMinPrice,
    setRewardDriverMinPrice,
    ideaListCommonPrice,
    setIdeaListCommonPrice,
    disableAfterKm,
    setDisableAfterKm,
    additionalValueAfterKm,
    setAdditionalValueAfterKm,
    kmToAdditionalValue,
    setKmToAdditionalValue,
    typeAdditionalValueAfterKm,
    setTypeAdditionalValueAfterKm,
    longDistanceValueToFinalPrice,
    setLongDistanceValueToFinalPrice,
    waitingToleranceSeconds,
    setWaitingToleranceSeconds,
    waitingPenaltyFee,
    setWaitingPenaltyFee,
    waitingExtraFeePerMinute,
    setWaitingExtraFeePerMinute,
    taxRate,
    setTaxRate,
    typeTaxRate,
    setTypeTaxRate,
    descriptionTaxRate,
    setDescriptionTaxRate,
    valueSurchase,
    setValueSurchase,
    typeValueSurchase,
    setTypeValueSurchase,
    descriptionSurchase,
    setDescriptionSurchase,
    floatingLimitsOfferMin,
    setFloatingLimitsOfferMin,
    floatingLimitsOfferMax,
    setFloatingLimitsOfferMax,
    floatingLimitsThirdPartyEnabled,
    setFloatingLimitsThirdPartyEnabled,
    floatingLimitsThirdPartyMin,
    setFloatingLimitsThirdPartyMin,
    floatingLimitsThirdPartyMax,
    setFloatingLimitsThirdPartyMax,
  };
};
