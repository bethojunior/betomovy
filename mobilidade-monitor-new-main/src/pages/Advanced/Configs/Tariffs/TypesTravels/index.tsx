import {
  Container,
  ContentTypesTravels,
  ButtonAddNewTariff,
  CardTariff,
  ImageTariff,
  TextCardTariff,
  TitleCardTariff,
  ButtonActions,
  ConfigDetailsTariffs,
  ContentDetailsTariffs,
  ContentListOptionsDetailsTariffs,
  ContentLogoApp,
  ImageLogoApp,
  ContentButtons,
  ContentPricePolicy,
  InputText,
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
  Loader,
  CustomOrderContainer,
  CustomOrderLabel,
  CustomOrderSubmenu,
  CustomOrderList,
  CustomOrderItem,
  CustomOrderItemInfo,
  CustomOrderItemImage,
  CustomOrderItemText,
  CustomOrderItemName,
  CustomOrderItemId,
  CustomOrderControls,
  CustomOrderButton,
  CustomOrderSaveButton,
  CustomOrderNewBadge,
  SwitchContainer,
  SwitchLabel,
} from "./styles";

import Session from "../../../../../utils/Session";
import { Collapse, Switch, Radio, Select as SelectAntd, Checkbox } from "antd";

import { AiOutlineClose } from "react-icons/ai";

import { useContext, useEffect, useState, Fragment } from "react";

import Utils from "../../../../../utils/Utils";
import Mask from "../../../../../services/Mask";

import api from "../../../../../services/api";
import AuthContext from "../../../../../contexts/auth";
import { TARIFAS } from "../../../../../constants/permissions";

import { ModalNewTariffs } from "../../../../../components/Advanced/Tariffs/ModalNewTariffs";

import swal from "sweetalert";

import { TypesTravelsProps } from "./types";

import { useCashback } from "./hooks/useCashback";
import { useCustomOrderConfig } from "./hooks/useCustomOrderConfig";
import { useCustomOrderList } from "./hooks/useCustomOrderList";
import { useDriverCommission } from "./hooks/useDriverCommission";
import { useInDriverConfig } from "./hooks/useInDriverConfig";
import { usePriceRange } from "./hooks/usePriceRange";
import { useTariffPricing } from "./hooks/useTariffPricing";
import { useTripRates } from "./hooks/useTripRates";
import { MoneyValueTypeInput } from "./components/MoneyValueTypeInput";

export const TypesTravels = () => {
  const { hasPermission } = useContext(AuthContext);
  const [typesTravels, setTypesTravels] = useState<TypesTravelsProps[]>([]);
  const [travelSelected, setTravelSelected] = useState<TypesTravelsProps>({});
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const canManageFloatingLimits = hasPermission(TARIFAS, "limite_flutuante");

  const cityId = Session.getLocal("citySelected")?.cityId;

  const { customOrderConfig, getCustomOrderConfig } = useCustomOrderConfig();

  const {
    listPrices,
    setListPrices,
    pricesSelected,
    priceOrderMap,
    getPrices,
    handleDisabledCalls: disableSelectedTripType,
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
  } = useTariffPricing(cityId, customOrderConfig, travelSelected, setLoading);

  const {
    tripPaymentsForms,
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
  } = useDriverCommission(cityId, pricesSelected, setLoading);

  const {
    customOrderList,
    handleMoveUp,
    handleMoveDown,
    handleSaveCustomOrder,
  } = useCustomOrderList(
    cityId,
    listPrices,
    customOrderConfig,
    getPrices,
    getTypesTravels,
    setLoading
  );

  const { isInDriverEnabled, getInDriverConfig } = useInDriverConfig();

  const {
    cashBacks,
    backToTripBalance,
    setBackToTripBalance,
    valueTypeCashback,
    setValueTypeCashback,
    valueCashback,
    setValueCashback,
    onChangeSwitchFinalPrice,
    handleAddCashback,
    handleDeleteCashback,
  } = useCashback(cityId, travelSelected.idTripType, setLoading);

  const {
    datasPriceRange,
    minValue,
    setMinValue,
    maxValue,
    setMaxValue,
    newValue,
    setNewValue,
    descriptionPriceRange,
    setDescritpionPriceRange,
    handleAddRangePrice,
    handleDeletePriceRange,
  } = usePriceRange(cityId, travelSelected.idTripType, setLoading);

  const {
    allRates,
    isShowNewRates,
    setIsShowNewRates,
    nameRates,
    setNameRates,
    valueRates,
    setValueRates,
    setDescriptionRates,
    typeChargeRates,
    setTypeChargeRates,
    setStatusActiveRates,
    selectChargedRates,
    inputValues,
    handleInputChange,
    handleAddRates,
    handeDeleteRates,
    handleUpdatedRates,
  } = useTripRates(cityId, travelSelected.idTripType, setLoading);

  async function getTypesTravels() {
    setLoading(true);
    try {
      const responseTypesTravels = await api.get("tripType");
      const typesTravels = responseTypesTravels.data.response.filter(
        (data: TypesTravelsProps) => data.serviceOption === 0
      );

      setTypesTravels(typesTravels);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  const handleSelectTravel = (datasTravel: TypesTravelsProps) => {
    setLoading(true);
    setTravelSelected(datasTravel);
    setLoading(false);
  };

  const onChangeSwitchLongDistanceValueToFinalPrice = (checked: boolean) => {
    setLongDistanceValueToFinalPrice(checked);
  };

  const handleUpdateTariffs = async () => {
    if (Utils.BrlToNumber(minPrice, "positive") <= 0) {
      swal({
        title: "O CAMPO PREÇO MÍNIMO PRECISA SER PREENCHIDO",
        icon: "warning",
      });
      return;
    }

    // if (Utils.BrlToNumber(promotionalPriceTemp, "positive") <= 0) {
    //   swal({
    //     title: "O CAMPO PREÇO PROMOCIONAL PRECISA SER PREENCHIDO",
    //     icon: "warning",
    //   });
    //   return;
    // }

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

    if (ideaListCommonPrice <= 0) {
      swal({
        title:
          "O CAMPO LISTA IDEAL DE MOTORISTAS PRÓXIMOS (DINÂMICA) PRECISA SER PREENCHIDO",
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
        const currentTripOrder = priceOrderMap.get(travelSelected.idTripType as number) ?? null;
        const objectSendPrice = {
          additional_value_after_km: Utils.BrlToNumber(
            additionalValueAfterKm,
            "positive"
          ),
          another_fee: Utils.BrlToNumber(valueSurchase, "positive"),
          another_fee_description: !descriptionSurchase
            ? ""
            : descriptionSurchase,
          another_fee_type: typeValueSurchase,
          base_price: Utils.BrlToNumber(basePrice, "positive"),
          cityId: cityId,
          color: colorTag,
          disable_after_km:
            Utils.BrlToNumber(disableAfterKm, "positive") === 0
              ? null
              : Utils.BrlToNumber(disableAfterKm, "positive"),
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
          promotional_price_temp: Utils.BrlToNumber(
            promotionalPriceTemp,
            "positive"
          ),
          reward_driver_min_price: Utils.BrlToNumber(
            rewardDriverMinPrice,
            "positive"
          ),
          tag: tag,
          tax_price: Utils.BrlToNumber(taxRate, "positive"),
          tax_price_description: !descriptionTaxRate ? "" : descriptionTaxRate,
          tax_price_type: typeTaxRate,
          tripTypeId: travelSelected.idTripType,
          order: currentTripOrder,
          type_additional_value_after_km: typeAdditionalValueAfterKm,
          waypoint_price: Utils.BrlToNumber(wayPointPrice, "positive"),
          waiting_tolerance_seconds: Number(waitingToleranceSeconds),
          waiting_penalty_fee: Utils.BrlToNumber(waitingPenaltyFee, "positive"),
          waiting_extra_fee_per_minute: Utils.BrlToNumber(
            waitingExtraFeePerMinute,
            "positive"
          ),
          percentage_min_offer: Utils.BrlToNumber(floatingLimitsOfferMin, "positive"),
          percentage_max_offer: Utils.BrlToNumber(floatingLimitsOfferMax, "positive"),
          percentage_min_trip_partner: Utils.BrlToNumber(floatingLimitsThirdPartyMin, "positive"),
          percentage_max_trip_partner: Utils.BrlToNumber(floatingLimitsThirdPartyMax, "positive"),
        };
        const newObjectCommission = commissionPaymentForms.map((response) => {
          if (typeof response.value === "string") {
            return {
              ...response,
              value: Utils.BrlToNumber(response.value as string, "positive"),
            };
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
          .catch((error) => {
            console.error(error);
            swal({
              title: "Erro ao atualizar tarifas",
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
    disableSelectedTripType(() => {
      getCommissionsDriver();
      getTypesTravels();
      setTravelSelected({});
    });
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsInitialLoading(true);

      const isCustomOrderEnabled = await getCustomOrderConfig();

      await getTypesTravels();
      await getTripPayments();
      await getCommissionsDriver();
      await getInDriverConfig();

      await getPrices(isCustomOrderEnabled);

      setIsInitialLoading(false);
    };

    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  const listTravelsDisabled = typesTravels.filter((item) => {
    return (
      listPrices.filter((data) => {
        return item.idTripType === (data.trip_type?.idTripType ?? data.tripTypeId);
      }).length === 0
    );
  });
  if (isInitialLoading) return <Loader spinning />;

  return (
    <Container>
      {loading && (<Loader spinning />)}
      {customOrderConfig && (
        <CustomOrderContainer>
          <CustomOrderSubmenu>
            <CustomOrderLabel style={{ marginBottom: '1rem' }}>
              Organize a ordem de exibição:
            </CustomOrderLabel>

            <CustomOrderList>
              {customOrderList.map((item, index) => (
                <CustomOrderItem key={item.idTripType}>
                  <CustomOrderItemInfo>
                    <CustomOrderItemImage
                      src={item.picture || '/default-trip-icon.png'}
                      alt={item.type || 'Tipo de viagem'}
                    />
                    <CustomOrderItemText>
                      <CustomOrderItemName>{item.type}</CustomOrderItemName>
                      <CustomOrderItemId>
                        Id: {item.idTripType} | Posição: {index + 1}
                        {priceOrderMap.get(item.idTripType as number) === null && (
                          <CustomOrderNewBadge> (Novo)</CustomOrderNewBadge>
                        )}
                      </CustomOrderItemId>
                    </CustomOrderItemText>
                  </CustomOrderItemInfo>

                  <CustomOrderControls>
                    <CustomOrderButton
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                    >
                      ↑
                    </CustomOrderButton>
                    <CustomOrderButton
                      onClick={() => handleMoveDown(index)}
                      disabled={index === customOrderList.length - 1}
                    >
                      ↓
                    </CustomOrderButton>
                  </CustomOrderControls>
                </CustomOrderItem>
              ))}
            </CustomOrderList>

            <CustomOrderSaveButton onClick={handleSaveCustomOrder}>
              Salvar Ordem
            </CustomOrderSaveButton>
          </CustomOrderSubmenu>
        </CustomOrderContainer>
      )}

      <ContentTypesTravels>
        <ButtonAddNewTariff onClick={() => setVisibleModal(true)}>
          Adicionar novo
        </ButtonAddNewTariff>
        <ContentListTypesTravels>
          {listPrices.map((value) => {
            return (
              <Fragment key={value.trip_type.idTripType}>
                <CardTariff
                  selected={
                    travelSelected.idTripType === value.trip_type.idTripType
                  }
                  onClick={() => handleSelectTravel(value.trip_type)}
                >
                  <ImageTariff src={value.trip_type?.picture} />
                  <TitleCardTariff>{value.trip_type?.type}</TitleCardTariff>
                  <TextCardTariff>{`Id: ${value.trip_type?.idTripType}`}</TextCardTariff>
                </CardTariff>
              </Fragment>
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
                      <LabelText>ETIQUETA(10)</LabelText>
                      <InputText
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
                      <InputText
                        type="text"
                        value={minPrice}
                        onChange={(event) =>
                          setMinPrice(Mask.setMaskMoney(event.target.value))
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>PREÇO MÍNIMO PROMOCIONAL</LabelText>
                      <InputText
                        type="text"
                        value={promotionalPriceTemp}
                        onChange={(event) =>
                          setPromotionalPriceTem(
                            Mask.setMaskMoney(event.target.value)
                          )
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>PREÇO BASE*</LabelText>
                      <InputText
                        type="text"
                        value={basePrice}
                        onChange={(event) =>
                          setBasePrice(Mask.setMaskMoney(event.target.value))
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>PREÇO KM*</LabelText>
                      <InputText
                        type="text"
                        value={kmPrice}
                        onChange={(event) =>
                          setKmPrice(Mask.setMaskMoney(event.target.value))
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>PREÇO MINUTO*</LabelText>
                      <InputText
                        type="text"
                        value={minutePrice}
                        onChange={(event) =>
                          setMinutePrice(Mask.setMaskMoney(event.target.value))
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>PREÇO POR PARADA</LabelText>
                      <InputText
                        type="text"
                        value={wayPointPrice}
                        onChange={(event) =>
                          setWayPointPrice(
                            Mask.setMaskMoney(event.target.value)
                          )
                        }
                      />
                    </ContentInputs>
                  </ContentPricePolicy>
                  <ContentPricePolicy>
                    <h2>Bonus de longa distancia</h2>
                    <ContentInputs>
                      <LabelText>PAGO PELO CLIENTE</LabelText>
                      <Switch
                        checked={longDistanceValueToFinalPrice}
                        onChange={onChangeSwitchLongDistanceValueToFinalPrice}
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>RAIO DE CHAMADO (KM)</LabelText>
                      <InputText
                        type="number"
                        value={longDistanceRadius}
                        onChange={(event) =>
                          setLongDistanceRadius(Number(event.target.value))
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>R$ DO BONUS</LabelText>
                      <InputText
                        type="text"
                        value={longDistanceKm}
                        onChange={(event) =>
                          setLongDistanceKm(
                            Mask.setMaskMoney(event.target.value)
                          )
                        }
                      />
                    </ContentInputs>
                  </ContentPricePolicy>
                  <ContentPricePolicy>
                    <ContentInputs>
                      <LabelText>VALOR BONUS(PROMOCIONAL)</LabelText>
                      <InputText
                        type="text"
                        value={rewardDriverMinPrice}
                        onChange={(event) =>
                          setRewardDriverMinPrice(
                            Mask.setMaskMoney(event.target.value)
                          )
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>
                        LISTA IDEAL DE MOTORISTAS PRÓXIMOS (DINÂMICA)
                      </LabelText>
                      <InputText
                        type="number"
                        value={ideaListCommonPrice}
                        onChange={(event) =>
                          setIdeaListCommonPrice(Number(event.target.value))
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>MÁX KM PARA TARIFA</LabelText>
                      <InputText
                        type="text"
                        value={disableAfterKm}
                        onChange={(event) =>
                          setDisableAfterKm(
                            Mask.setMaskMoney(event.target.value)
                          )
                        }
                      />
                    </ContentInputs>
                  </ContentPricePolicy>
                  <ContentPricePolicy>
                    <MoneyValueTypeInput
                      label="TAXA DE IMPOSTO"
                      value={taxRate}
                      onChangeValue={setTaxRate}
                      valueType={typeTaxRate}
                      onChangeType={(type) =>
                        setTypeTaxRate(type as "%" | "$")
                      }
                    />
                    <LabelText>DESCRIÇÃO (TAXA DE IMPOSTO)</LabelText>
                    <TextArea
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
                    <MoneyValueTypeInput
                      label="TAXA EXTRA"
                      value={valueSurchase}
                      onChangeValue={setValueSurchase}
                      valueType={typeValueSurchase}
                      onChangeType={(type) =>
                        setTypeValueSurchase(type as "%" | "$")
                      }
                    />
                    <LabelText>DESCRIÇÃO (TAXA EXTRA)</LabelText>
                    <TextArea
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
                  <ContentPricePolicy>
                    <ContentInputs>
                      <LabelText>
                        DISTANCIA PARA COBRAR VALOR ADICIONAL
                      </LabelText>
                      <InputText
                        type="text"
                        value={kmToAdditionalValue}
                        onChange={(event) =>
                          setKmToAdditionalValue(
                            Mask.setMaskMoney(event.target.value)
                          )
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>VALOR DA DISTANCIA ADICIONAL</LabelText>
                      <InputText
                        type="text"
                        value={additionalValueAfterKm}
                        onChange={(event) =>
                          setAdditionalValueAfterKm(
                            Mask.setMaskMoney(event.target.value)
                          )
                        }
                      />
                      <Radio.Group
                        value={typeAdditionalValueAfterKm}
                        onChange={(event) =>
                          setTypeAdditionalValueAfterKm(event.target.value)
                        }
                      >
                        <Radio value="$">$</Radio>
                        <Radio value="km">km</Radio>
                      </Radio.Group>
                    </ContentInputs>
                  </ContentPricePolicy>
                </Collapse.Panel>
                <Collapse.Panel header="Tempo em espera" key={2}>
                  <ContentPricePolicy>
                    <ContentInputs>
                      <LabelText>TEMPO EM SEGUNDOS PARA TOLERÂNCIA*</LabelText>
                      <InputText
                        type="text"
                        value={waitingToleranceSeconds}
                        onChange={(event) =>
                          setWaitingToleranceSeconds(event.target.value)
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>MULTA PARA A TOLERÂNCIA*</LabelText>
                      <InputText
                        type="text"
                        value={waitingPenaltyFee}
                        onChange={(event) =>
                          setWaitingPenaltyFee(
                            Mask.setMaskMoney(event.target.value)
                          )
                        }
                      />
                    </ContentInputs>
                    <ContentInputs>
                      <LabelText>VALOR PARA CADA MINUTO EXCEDENTE*</LabelText>
                      <InputText
                        type="text"
                        value={waitingExtraFeePerMinute}
                        onChange={(event) =>
                          setWaitingExtraFeePerMinute(
                            Mask.setMaskMoney(event.target.value)
                          )
                        }
                      />
                    </ContentInputs>
                  </ContentPricePolicy>
                </Collapse.Panel>
                <Collapse.Panel header="Cálculos Motoristas" key={3}>
                  <ContentPricePolicy>
                    <MoneyValueTypeInput
                      label="TAXA DE SERVIÇO"
                      value={valueCalcDriver}
                      onChangeValue={setValueCalcDriver}
                      valueType={valueTypeCalcDriver}
                      onChangeType={setValueTypeCalcDriver}
                      radioGroupName="valueTypeCalcDriver"
                    />
                    <Checkbox
                      checked={disableOnPromotion}
                      onChange={(event) =>
                        setDisableOnPromotion(event.target.checked)
                      }
                    />
                    <label>Desabilitar comissão no preço promocional</label>
                  </ContentPricePolicy>
                </Collapse.Panel>
                <Collapse.Panel header="Formas de Pagamentos/Taxas" key={4}>
                  <ContentPricePolicy>
                    {tripPaymentsForms &&
                      tripPaymentsForms.map((value, index) => {
                        return (
                          <Fragment key={value?.idTripPaymentForm}>
                            {value?.active === 1 ? (
                              <MoneyValueTypeInput
                                label={value?.name}
                                inputType="tel"
                                autoComplete="off"
                                value={Mask.setMaskMoneyAlternative(
                                  Utils.BrlToNumber(
                                    String(commissionPaymentForms[index]?.value ?? "0,00"),
                                    "positive"
                                  )
                                )}
                                onChangeValue={(maskedValue) =>
                                  handleChangePaymentsCommissions(
                                    index,
                                    "value",
                                    maskedValue
                                  )
                                }
                                valueType={
                                  commissionPaymentForms[index]?.valueType as string
                                }
                                onChangeType={(type) =>
                                  handleChangePaymentsCommissions(
                                    index,
                                    "valueType",
                                    type
                                  )
                                }
                                radioGroupName={`valueTypePaymentForm-${value?.idTripPaymentForm}`}
                              />
                            ) : null}
                          </Fragment>
                        );
                      })}
                  </ContentPricePolicy>
                </Collapse.Panel>
                <Collapse.Panel header="CashBack" key={5}>
                  <ContentPricePolicy>
                    <ContentInputs>
                      <InputText
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
                      <Switch onChange={onChangeSwitchFinalPrice} />
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
                      <Button color="#0069d9" onClick={handleAddCashback}>
                        Salvar Cashback
                      </Button>
                    </ContentBtnSaveCashBack>
                  </ContentPricePolicy>
                </Collapse.Panel>
                <Collapse.Panel header="Faixa de preços" key={6}>
                  <LabelText>Descrição</LabelText>
                  <TextArea
                    rows={5}
                    cols={33}
                    value={descriptionPriceRange}
                    onChange={(event) =>
                      setDescritpionPriceRange(event.target.value)
                    }
                  ></TextArea>
                  <ContentInputs>
                    <ContentColumnInputs>
                      <LabelText>De R$</LabelText>
                      <InputText
                        type="text"
                        value={minValue}
                        onChange={(event) =>
                          setMinValue(Mask.setMaskMoney(event.target.value))
                        }
                      />
                    </ContentColumnInputs>
                    <ContentColumnInputs>
                      <LabelText>Até R$</LabelText>
                      <InputText
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
                      <InputText
                        type="text"
                        value={newValue}
                        onChange={(event) =>
                          setNewValue(Mask.setMaskMoney(event.target.value))
                        }
                      />
                    </ContentColumnInputs>
                    <Button color="#27283c" onClick={handleAddRangePrice}>
                      Salvar
                    </Button>
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
                <Collapse.Panel header="Taxas" key={7}>
                  {allRates.map((value, index) => {
                    return (
                      <Fragment key={value.id}>
                        <form
                          onSubmit={(event) =>
                            handleUpdatedRates(
                              event,
                              inputValues[`valueRates-${index}`]
                            )
                          }
                        >
                          <ContentInputs>
                            <ContentColumnInputs>
                              <input type="hidden" name="id" value={value.id} />
                              <LabelText>Nome da taxa</LabelText>
                              <InputText
                                type="text"
                                defaultValue={value.name}
                                name="nameRates"
                                id="nameRates"
                              />
                            </ContentColumnInputs>
                            <ContentColumnInputs>
                              <LabelText>Valor a ser cobrado</LabelText>
                              <InputText
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
                            <Button color="#0069d9" type="submit">
                              Atualizar
                            </Button>
                            <Button
                              color="#C82333"
                              type="button"
                              onClick={() => handeDeleteRates(value.id)}
                            >
                              Excluir
                            </Button>
                          </ContentInputs>
                        </form>
                      </Fragment>
                    );
                  })}
                  {isShowNewRates ? (
                    <>
                      <ContentInputs>
                        <ContentColumnInputs>
                          <LabelText>Nome da taxa</LabelText>
                          <InputText
                            type="text"
                            value={nameRates}
                            onChange={(event) =>
                              setNameRates(event.target.value)
                            }
                          />
                        </ContentColumnInputs>
                        <ContentColumnInputs>
                          <LabelText>Valor a ser cobrado</LabelText>
                          <InputText
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
                            <Switch
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
                        <Button color="#0069d9" onClick={handleAddRates}>
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
                      <Button
                        color="#0069d9"
                        onClick={() => setIsShowNewRates(true)}
                      >
                        Nova Taxa
                      </Button>
                    </ContentInputs>
                  ) : null}
                </Collapse.Panel>
                {isInDriverEnabled && canManageFloatingLimits && (
                  <Collapse.Panel header="Limite flutuantes" key={8}>
                    <LabelText>
                      Chamado por oferta (apenas para este tipo de chamado)
                    </LabelText>
                    <ContentInputs>
                      <ContentColumnInputs>
                        <LabelText>Valor mínimo %</LabelText>
                        <InputText
                          type="text"
                          value={floatingLimitsOfferMin}
                          onChange={(event) =>
                            setFloatingLimitsOfferMin(
                              Mask.setMaskMoney(event.target.value)
                            )
                          }
                          placeholder="Valor mínimo %"
                        />
                      </ContentColumnInputs>
                      <ContentColumnInputs>
                        <LabelText>Valor máximo %</LabelText>
                        <InputText
                          type="text"
                          value={floatingLimitsOfferMax}
                          onChange={(event) =>
                            setFloatingLimitsOfferMax(
                              Mask.setMaskMoney(event.target.value)
                            )
                          }
                          placeholder="Valor máximo %"
                        />
                      </ContentColumnInputs>
                    </ContentInputs>

                    <LabelText>Chamado para terceiros</LabelText>

                    <SwitchContainer>
                      <Switch
                        checked={floatingLimitsThirdPartyEnabled}
                        onChange={(checked) => setFloatingLimitsThirdPartyEnabled(checked)}
                        size="small"
                      />
                      <SwitchLabel>
                        Permitir para terceiros
                      </SwitchLabel>
                    </SwitchContainer>

                    <ContentInputs>
                      <ContentColumnInputs>
                        <LabelText>Valor mínimo %</LabelText>
                        <InputText
                          type="text"
                          value={floatingLimitsThirdPartyMin}
                          onChange={(event) =>
                            setFloatingLimitsThirdPartyMin(
                              Mask.setMaskMoney(event.target.value)
                            )
                          }
                          disabled={!floatingLimitsThirdPartyEnabled}
                          placeholder="Valor mínimo %"
                        />
                      </ContentColumnInputs>
                      <ContentColumnInputs>
                        <LabelText>Valor máximo %</LabelText>
                        <InputText
                          type="text"
                          value={floatingLimitsThirdPartyMax}
                          onChange={(event) =>
                            setFloatingLimitsThirdPartyMax(
                              Mask.setMaskMoney(event.target.value)
                            )
                          }
                          disabled={!floatingLimitsThirdPartyEnabled}
                          placeholder="Valor máximo %"
                        />
                      </ContentColumnInputs>
                    </ContentInputs>
                  </Collapse.Panel>
                )}
              </Collapse>
            </ContentListOptionsDetailsTariffs>
            <ContentButtons>
              <ButtonActions onClick={handleUpdateTariffs}>
                ATUALIZAR
              </ButtonActions>
              <ButtonActions onClick={handleDisabledCalls}>
                DESABILITAR CHAMADO
              </ButtonActions>
            </ContentButtons>
          </ConfigDetailsTariffs>
          <ContentLogoApp>
            <ImageLogoApp src={import.meta.env.LOGO_APP} />
          </ContentLogoApp>
        </ContentDetailsTariffs>
      ) : null}

      <ModalNewTariffs
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
