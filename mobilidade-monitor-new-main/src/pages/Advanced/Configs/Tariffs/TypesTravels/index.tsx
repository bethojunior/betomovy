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
  WizardStepper,
  WizardStepItem,
  WizardStepNumber,
  WizardStepContent,
  WizardStepTitle,
  WizardNavContainer,
  WizardButtonPrev,
  WizardButtonNext,
  SuccessScreenContainer,
  SuccessIconBadge,
  SuccessTitle,
  SuccessSubtitle,
  SuccessSummaryGrid,
  SuccessSummaryCard,
  SuccessSummaryLabel,
  SuccessSummaryValue,
  SummarySectionCard,
} from "./styles";

import Session from "../../../../../utils/Session";
import { Collapse, Switch, Radio, Select as SelectAntd, Checkbox, Modal } from "antd";

import {
  AiOutlineClose,
  AiOutlineCheck,
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
  AiOutlineCheckCircle,
} from "react-icons/ai";

import { useContext, useEffect, useState, Fragment } from "react";

import Utils from "../../../../../utils/Utils";
import Mask from "../../../../../services/Mask";

import api from "../../../../../services/api";
import AuthContext from "../../../../../contexts/auth";
import { TARIFAS } from "../../../../../constants/permissions";

import { ModalNewTariffs } from "../../../../../components/Advanced/Tariffs/ModalNewTariffs";

import swal from "sweetalert";
import logoMovy from "../../../../../assets/logo-movy-transparent.png";

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
import { TariffWizard } from "./components/TariffWizard";

export const TypesTravels = () => {
  const { hasPermission } = useContext(AuthContext);
  const [typesTravels, setTypesTravels] = useState<TypesTravelsProps[]>([]);
  const [travelSelected, setTravelSelected] = useState<TypesTravelsProps>({});
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);
  const [isWizardModalOpen, setIsWizardModalOpen] = useState<boolean>(false);
  const canManageFloatingLimits = hasPermission(TARIFAS, "limite_flutuante");

  const rawCitySelected = Session.getLocal("citySelected");
  const parsedCity = (() => {
    if (!rawCitySelected) return null;
    if (typeof rawCitySelected === "string") {
      try {
        return JSON.parse(rawCitySelected);
      } catch {
        return null;
      }
    }
    return rawCitySelected;
  })();
  const cityId = Number(parsedCity?.cityId ?? parsedCity?.id ?? 0);

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

  async function getTypesTravels(): Promise<TypesTravelsProps[]> {
    setLoading(true);
    let filteredTypes: TypesTravelsProps[] = [];
    try {
      const responseTypesTravels = await api.get("tripType");
      filteredTypes = (responseTypesTravels.data?.response || []).filter(
        (data: TypesTravelsProps) => Number(data.serviceOption) === 0
      );

      setTypesTravels(filteredTypes);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    return filteredTypes;
  }

  const handleSelectTravel = (datasTravel: TypesTravelsProps) => {
    setLoading(true);
    const fullTripType = typesTravels.find(
      (t) => Number(t.idTripType) === Number(datasTravel.idTripType)
    );
    setTravelSelected(fullTripType ? { ...fullTripType, ...datasTravel } : datasTravel);
    setCurrentStep(1);
    setIsSavedSuccess(false);
    setIsWizardModalOpen(true);
    setLoading(false);
  };

  const onChangeSwitchLongDistanceValueToFinalPrice = (checked: boolean) => {
    setLongDistanceValueToFinalPrice(checked);
  };

  const handleUpdateTariffs = async () => {
    const tripId = Number(travelSelected.idTripType ?? (travelSelected as any).id);
    if (!tripId || isNaN(tripId) || tripId <= 0) {
      swal({
        title: "NENHUM TIPO DE VIAGEM SELECIONADO",
        text: "Selecione um tipo de viagem antes de atualizar os valores.",
        icon: "warning",
      });
      return;
    }

    const parsedCityId = Number(cityId);
    if (!parsedCityId || isNaN(parsedCityId) || parsedCityId <= 0) {
      swal({
        title: "NENHUMA CIDADE SELECIONADA",
        text: "Selecione uma cidade no menu superior antes de atualizar as tarifas.",
        icon: "warning",
      });
      return;
    }

    if (!minPrice || Utils.BrlToNumber(minPrice, "positive") <= 0) {
      swal({
        title: "PREÇO MÍNIMO OBRIGATÓRIO",
        text: "O Preço Mínimo é obrigatório e deve ser maior que zero (ex: 12,00).",
        icon: "warning",
      });
      setCurrentStep(1);
      return;
    }

    const effectiveIdeaListCommonPrice = ideaListCommonPrice > 0 ? ideaListCommonPrice : 5;

    setLoading(true);
        try {
          const currentTripOrder = priceOrderMap.get(tripId) ?? null;
          const objectSendPrice = {
            additional_value_after_km: Utils.BrlToNumber(
              additionalValueAfterKm,
              "positive"
            ) || 0,
            another_fee: Utils.BrlToNumber(valueSurchase, "positive") || 0,
            another_fee_description: !descriptionSurchase
              ? ""
              : descriptionSurchase,
            another_fee_type: typeValueSurchase || "%",
            base_price: Utils.BrlToNumber(basePrice, "positive"),
            cityId: parsedCityId,
            color: colorTag || "#000000",
            disable_after_km:
              Utils.BrlToNumber(disableAfterKm, "positive") === 0
                ? null
                : Utils.BrlToNumber(disableAfterKm, "positive"),
            idealListCommonPrice: Number(effectiveIdeaListCommonPrice),
            km_price: Utils.BrlToNumber(kmPrice, "positive"),
            km_to_additional_value: Utils.BrlToNumber(
              kmToAdditionalValue,
              "positive"
            ) || 0,
            long_distance_per_km: Utils.BrlToNumber(longDistanceKm, "positive") || 0,
            long_distance_radius: Number(longDistanceRadius) || 0,
            long_distance_value_to_final_price: !!longDistanceValueToFinalPrice,
            min_price: Utils.BrlToNumber(minPrice, "positive"),
            minute_price: Utils.BrlToNumber(minutePrice, "positive"),
            promotional_price_temp: Utils.BrlToNumber(
              promotionalPriceTemp,
              "positive"
            ) || 0,
            reward_driver_min_price: Utils.BrlToNumber(
              rewardDriverMinPrice,
              "positive"
            ) || 0,
            tag: tag || "",
            tax_price: Utils.BrlToNumber(taxRate, "positive") || 0,
            tax_price_description: !descriptionTaxRate ? "" : descriptionTaxRate,
            tax_price_type: typeTaxRate || "%",
            tripTypeId: tripId,
            order: currentTripOrder,
            type_additional_value_after_km: typeAdditionalValueAfterKm || "$",
            waypoint_price: Utils.BrlToNumber(wayPointPrice, "positive") || 0,
            waiting_tolerance_seconds: Number(waitingToleranceSeconds) || 0,
            waiting_penalty_fee: Utils.BrlToNumber(waitingPenaltyFee, "positive") || 0,
            waiting_extra_fee_per_minute: Utils.BrlToNumber(
              waitingExtraFeePerMinute,
              "positive"
            ) || 0,
            percentage_min_offer: Utils.BrlToNumber(floatingLimitsOfferMin, "positive") || 0,
            percentage_max_offer: Utils.BrlToNumber(floatingLimitsOfferMax, "positive") || 0,
            percentage_min_trip_partner: Utils.BrlToNumber(floatingLimitsThirdPartyMin, "positive") || 0,
            percentage_max_trip_partner: Utils.BrlToNumber(floatingLimitsThirdPartyMax, "positive") || 0,
          };
          const newObjectCommission = commissionPaymentForms.map((response) => {
            if (typeof response.value === "string") {
              return {
                ...response,
                value: Utils.BrlToNumber(response.value as string, "positive") || 0,
              };
            }
            return response;
          });

          const objectSendCommission = {
            commissionAnotherFee: {
              another_value: Utils.BrlToNumber(valueSurchase, "positive") || 0,
              taxValueType: typeTaxRate || "%",
              tax_value: Utils.BrlToNumber(taxRate, "positive") || 0,
              valueType: typeValueSurchase || "%",
            },
            commissionsPaymentForm: newObjectCommission,
            value: Utils.BrlToNumber(valueCalcDriver, "positive") || 0,
            tripTypeId: tripId,
            valueType: valueTypeCalcDriver || "%",
            disableOnPromotion: !!disableOnPromotion,
          };

          // Salvar price primeiro (crítico), depois comissão independentemente
          await api.post("price", objectSendPrice);

          try {
            await api.post(`driverCommission/${parsedCityId}`, objectSendCommission);
          } catch (commissionError: any) {
            console.warn("Aviso: erro ao salvar comissão do motorista:", commissionError);
          }

          swal({
            title: "Preço atualizado com sucesso!",
            icon: "success",
          });

          const currentSavedId = tripId;
          const freshTypes = await getTypesTravels();
          await getCommissionsDriver();
          await getPrices();

          const updatedTripType = (freshTypes || []).find(
            (t) => Number(t.idTripType) === currentSavedId
          );
          if (updatedTripType) {
            setTravelSelected({ ...updatedTripType, ...travelSelected, idTripType: currentSavedId });
          } else {
            setTravelSelected({ ...travelSelected, idTripType: currentSavedId });
          }
          setIsSavedSuccess(true);
          setCurrentStep(5);
        } catch (error: any) {
          console.error("Erro ao atualizar tarifas:", error);
          let errorMsg = "Ocorreu um erro ao atualizar os preços e comissões.";
          if (error.response?.data?.message) {
            errorMsg = error.response.data.message;
          } else if (error.response?.data?.response) {
            errorMsg = typeof error.response.data.response === "string" 
              ? error.response.data.response 
              : JSON.stringify(error.response.data.response);
          } else if (error.message) {
            errorMsg = error.message;
          }
          swal({
            title: "Erro ao atualizar tarifas",
            text: errorMsg,
            icon: "error",
          });
        } finally {
          setLoading(false);
        }
  };

  const handleDisabledCalls = () => {
    disableSelectedTripType(() => {
      getCommissionsDriver();
      getTypesTravels();
      setTravelSelected({});
    });
  };

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      let activeCityId = cityId;

      if (!activeCityId || isNaN(activeCityId) || activeCityId <= 0) {
        try {
          const res = await api.get("city");
          const rawCities = res.data?.response?.data || res.data?.response || [];
          if (Array.isArray(rawCities) && rawCities.length > 0) {
            const firstCity = rawCities[0];
            const cityObj = {
              cityId: Number(firstCity.id || firstCity.cityId),
              nome: firstCity.nome || firstCity.name,
              polygon: firstCity.polygon,
            };
            Session.setLocal("citySelected", cityObj);
            activeCityId = cityObj.cityId;
          }
        } catch (e) {
          console.error("Erro ao verificar cidades ativas:", e);
        }
      }

      try {
        setLoading(true);
        const isCustomOrderEnabled = await getCustomOrderConfig().catch(() => false);

        await Promise.allSettled([
          getTypesTravels(),
          getTripPayments(),
          getCommissionsDriver(),
          getInDriverConfig(),
          getPrices(isCustomOrderEnabled),
        ]);
      } catch (err) {
        console.error("Erro ao carregar dados das tarifas:", err);
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
          setLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  const listTravelsDisabled = typesTravels.filter((item) => {
    return (
      listPrices.filter((data) => {
        return Number(item.idTripType) === Number(data.trip_type?.idTripType ?? data.tripTypeId);
      }).length === 0
    );
  });

  if (!cityId && !isInitialLoading) {
    return (
      <Container>
        <div
          style={{
            padding: "2.5rem",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: 16,
            margin: "2rem auto",
            maxWidth: 600,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ color: "#070A1A", fontWeight: 700, marginBottom: 12 }}>
            Nenhuma Cidade Selecionada
          </h2>
          <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.6 }}>
            Selecione uma cidade no menu superior para carregar, configurar e gerenciar as tarifas e tipos de viagem correspondentes.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {(isInitialLoading || loading) && (<Loader spinning />)}
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
            const tripId = value.trip_type?.idTripType ?? value.tripTypeId;
            const fullType = typesTravels.find((t) => Number(t.idTripType) === Number(tripId));
            const tripTypeObj = { ...(fullType || {}), ...(value.trip_type || {}) };
            const pic = tripTypeObj?.picture || fullType?.picture;
            const displayTitle = tripTypeObj?.type || fullType?.type || `Tarifa ${tripId}`;

            return (
              <Fragment key={tripId}>
                <CardTariff
                  selected={
                    Number(travelSelected.idTripType) === Number(tripId)
                  }
                  onClick={() => handleSelectTravel({ ...tripTypeObj, idTripType: tripId, type: displayTitle, picture: pic })}
                >
                  <ImageTariff
                    src={
                      pic
                        ? (pic.startsWith("http")
                            ? pic
                            : `https://minio.704app.com.br/rota101fb704/tripType/${pic}`)
                        : "/default-trip-icon.png"
                    }
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = "/default-trip-icon.png";
                    }}
                  />
                  <TitleCardTariff>{displayTitle}</TitleCardTariff>
                  <TextCardTariff>{`Id: ${tripId}`}</TextCardTariff>
                </CardTariff>
              </Fragment>
            );
          })}
        </ContentListTypesTravels>
      </ContentTypesTravels>

      {Object.keys(travelSelected).length > 0 ? (
        <ContentDetailsTariffs
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
            border: '1.5px solid #E2E8F0',
            borderRadius: 16,
            padding: '1.5rem 2rem',
            marginTop: '1.5rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: '1 1 320px' }}>
            <ImageTariff
              src={
                travelSelected?.picture
                  ? (travelSelected.picture.startsWith('http')
                      ? travelSelected.picture
                      : 'https://minio.704app.com.br/rota101fb704/tripType/' + travelSelected.picture)
                  : logoMovy
              }
              alt={travelSelected?.type || 'Tarifa Movy'}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = logoMovy;
              }}
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'contain',
                background: '#ffffff',
                padding: '8px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#00349A',
                    background: '#E0F2FE',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  Id: {travelSelected?.idTripType ?? '—'}
                </span>
                {travelSelected?.gender?.name && (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#475569',
                      background: '#F1F5F9',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    Gênero: {travelSelected.gender.name}
                  </span>
                )}
              </div>
              <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 700, color: '#0F172A' }}>
                {travelSelected?.type || 'Tarifa Selecionada'}
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                {travelSelected?.description || 'Valores e regras operacionais ativos para esta modalidade.'}
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              background: '#FFFFFF',
              padding: '0.85rem 1.25rem',
              borderRadius: 12,
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
                Preço Mínimo
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                R$ {minPrice || '0,00'}
              </div>
            </div>
            <div style={{ width: 1, height: 32, background: '#E2E8F0' }} />
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
                Preço Base
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                R$ {basePrice || '0,00'}
              </div>
            </div>
            <div style={{ width: 1, height: 32, background: '#E2E8F0' }} />
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
                Preço KM
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                R$ {kmPrice || '0,00'}
              </div>
            </div>
            <div style={{ width: 1, height: 32, background: '#E2E8F0' }} />
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>
                Comissão
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                {valueCalcDriver || '0,00'} {valueTypeCalcDriver}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <ButtonActions
              onClick={() => {
                setCurrentStep(1);
                setIsSavedSuccess(false);
                setIsWizardModalOpen(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.75rem 1.4rem',
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              ⚙️ Abrir Assistente de Edição
            </ButtonActions>
            <button
              onClick={handleDisabledCalls}
              style={{
                background: '#FEE2E2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                borderRadius: 8,
                padding: '0.75rem 1.25rem',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#FCA5A5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FEE2E2')}
            >
              Desabilitar Tarifa
            </button>
          </div>
        </ContentDetailsTariffs>
      ) : null}

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: "4px 0" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "rgba(255, 255, 255, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 4,
                border: "1px solid rgba(4, 243, 250, 0.3)",
              }}
            >
              <img
                src={
                  travelSelected?.picture
                    ? (travelSelected.picture.startsWith('http')
                        ? travelSelected.picture
                        : 'https://minio.704app.com.br/rota101fb704/tripType/' + travelSelected.picture)
                    : logoMovy
                }
                alt={travelSelected?.type || 'Tarifa'}
                style={{ width: "100%", height: "100%", objectFit: 'contain' }}
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = logoMovy;
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', letterSpacing: "0.3px" }}>
                Configuração de Tarifa: {travelSelected?.type || "Modalidade"}
              </div>
              <div style={{ fontSize: 12, color: '#04F3FA', fontWeight: 600 }}>
                ID: {travelSelected?.idTripType ?? "—"} • Assistente Passo a Passo
              </div>
            </div>
          </div>
        }
        open={isWizardModalOpen}
        onCancel={() => setIsWizardModalOpen(false)}
        footer={null}
        width={980}
        centered
        destroyOnClose={false}
        zIndex={10000020}
        bodyStyle={{
          maxHeight: '82vh',
          overflowY: 'auto',
          padding: '1.25rem 1.75rem',
          backgroundColor: '#FFFFFF',
        }}
      >
        <TariffWizard
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isSavedSuccess={isSavedSuccess}
          setIsSavedSuccess={setIsSavedSuccess}
          travelSelected={travelSelected}
          cityId={cityId}
          tag={tag}
          setTag={setTag}
          colorTag={colorTag}
          setColorTag={setColorTag}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          promotionalPriceTemp={promotionalPriceTemp}
          setPromotionalPriceTem={setPromotionalPriceTem}
          basePrice={basePrice}
          setBasePrice={setBasePrice}
          kmPrice={kmPrice}
          setKmPrice={setKmPrice}
          minutePrice={minutePrice}
          setMinutePrice={setMinutePrice}
          wayPointPrice={wayPointPrice}
          setWayPointPrice={setWayPointPrice}
          longDistanceValueToFinalPrice={longDistanceValueToFinalPrice}
          onChangeSwitchLongDistanceValueToFinalPrice={onChangeSwitchLongDistanceValueToFinalPrice}
          longDistanceRadius={longDistanceRadius}
          setLongDistanceRadius={setLongDistanceRadius}
          longDistanceKm={longDistanceKm}
          setLongDistanceKm={setLongDistanceKm}
          rewardDriverMinPrice={rewardDriverMinPrice}
          setRewardDriverMinPrice={setRewardDriverMinPrice}
          ideaListCommonPrice={ideaListCommonPrice}
          setIdeaListCommonPrice={setIdeaListCommonPrice}
          disableAfterKm={disableAfterKm}
          setDisableAfterKm={setDisableAfterKm}
          kmToAdditionalValue={kmToAdditionalValue}
          setKmToAdditionalValue={setKmToAdditionalValue}
          additionalValueAfterKm={additionalValueAfterKm}
          setAdditionalValueAfterKm={setAdditionalValueAfterKm}
          typeAdditionalValueAfterKm={typeAdditionalValueAfterKm}
          setTypeAdditionalValueAfterKm={setTypeAdditionalValueAfterKm}
          taxRate={taxRate}
          setTaxRate={setTaxRate}
          typeTaxRate={typeTaxRate}
          setTypeTaxRate={setTypeTaxRate}
          descriptionTaxRate={descriptionTaxRate}
          setDescriptionTaxRate={setDescriptionTaxRate}
          valueSurchase={valueSurchase}
          setValueSurchase={setValueSurchase}
          typeValueSurchase={typeValueSurchase}
          setTypeValueSurchase={setTypeValueSurchase}
          descriptionSurchase={descriptionSurchase}
          setDescriptionSurchase={setDescriptionSurchase}
          waitingToleranceSeconds={waitingToleranceSeconds}
          setWaitingToleranceSeconds={setWaitingToleranceSeconds}
          waitingPenaltyFee={waitingPenaltyFee}
          setWaitingPenaltyFee={setWaitingPenaltyFee}
          waitingExtraFeePerMinute={waitingExtraFeePerMinute}
          setWaitingExtraFeePerMinute={setWaitingExtraFeePerMinute}
          valueCalcDriver={valueCalcDriver}
          setValueCalcDriver={setValueCalcDriver}
          valueTypeCalcDriver={valueTypeCalcDriver}
          setValueTypeCalcDriver={setValueTypeCalcDriver}
          disableOnPromotion={disableOnPromotion}
          setDisableOnPromotion={setDisableOnPromotion}
          tripPaymentsForms={tripPaymentsForms}
          commissionPaymentForms={commissionPaymentForms}
          handleChangePaymentsCommissions={handleChangePaymentsCommissions}
          valueCashback={valueCashback}
          setValueCashback={setValueCashback}
          valueTypeCashback={valueTypeCashback}
          setValueTypeCashback={setValueTypeCashback}
          onChangeSwitchFinalPrice={onChangeSwitchFinalPrice}
          backToTripBalance={backToTripBalance}
          setBackToTripBalance={setBackToTripBalance}
          cashBacks={cashBacks}
          handleDeleteCashback={handleDeleteCashback}
          handleAddCashback={handleAddCashback}
          descriptionPriceRange={descriptionPriceRange}
          setDescritpionPriceRange={setDescritpionPriceRange}
          minValue={minValue}
          setMinValue={setMinValue}
          maxValue={maxValue}
          setMaxValue={setMaxValue}
          newValue={newValue}
          setNewValue={setNewValue}
          handleAddRangePrice={handleAddRangePrice}
          datasPriceRange={datasPriceRange}
          handleDeletePriceRange={handleDeletePriceRange}
          allRates={allRates}
          handleUpdatedRates={handleUpdatedRates}
          inputValues={inputValues}
          handleInputChange={handleInputChange}
          handeDeleteRates={handeDeleteRates}
          isShowNewRates={isShowNewRates}
          setIsShowNewRates={setIsShowNewRates}
          nameRates={nameRates}
          setNameRates={setNameRates}
          valueRates={valueRates}
          setValueRates={setValueRates}
          setDescriptionRates={setDescriptionRates}
          selectChargedRates={selectChargedRates}
          typeChargeRates={typeChargeRates}
          setTypeChargeRates={setTypeChargeRates}
          setStatusActiveRates={setStatusActiveRates}
          handleAddRates={handleAddRates}
          isInDriverEnabled={isInDriverEnabled}
          canManageFloatingLimits={canManageFloatingLimits}
          floatingLimitsOfferMin={floatingLimitsOfferMin}
          setFloatingLimitsOfferMin={setFloatingLimitsOfferMin}
          floatingLimitsOfferMax={floatingLimitsOfferMax}
          setFloatingLimitsOfferMax={setFloatingLimitsOfferMax}
          floatingLimitsThirdPartyEnabled={floatingLimitsThirdPartyEnabled}
          setFloatingLimitsThirdPartyEnabled={setFloatingLimitsThirdPartyEnabled}
          floatingLimitsThirdPartyMin={floatingLimitsThirdPartyMin}
          setFloatingLimitsThirdPartyMin={setFloatingLimitsThirdPartyMin}
          floatingLimitsThirdPartyMax={floatingLimitsThirdPartyMax}
          setFloatingLimitsThirdPartyMax={setFloatingLimitsThirdPartyMax}
          handleUpdateTariffs={handleUpdateTariffs}
          handleDisabledCalls={handleDisabledCalls}
          setVisibleModal={setVisibleModal}
          loading={loading}
          onCloseModal={() => setIsWizardModalOpen(false)}
        />
      </Modal>

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
