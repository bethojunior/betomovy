import React, { Fragment } from "react";
import { Switch, Radio, Select as SelectAntd, Checkbox } from "antd";
import {
  AiOutlineClose,
  AiOutlineCheck,
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
  AiOutlineCheckCircle,
  AiOutlineEdit,
  AiOutlinePlus,
} from "react-icons/ai";

import Mask from "../../../../../../../services/Mask";
import Utils from "../../../../../../../utils/Utils";
import { MoneyValueTypeInput } from "../MoneyValueTypeInput";

import {
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
  ContentPricePolicy,
  ContentInputs,
  LabelText,
  InputText,
  TextArea,
  ContentTable,
  THead,
  TBody,
  ButtonDelete,
  ContentBtnSaveCashBack,
  Button,
  ContentColumnInputs,
  ButtonClosePrices,
  ButtonActions,
  Select,
  SwitchContainer,
  SwitchLabel,
} from "../../styles";

interface TariffWizardProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isSavedSuccess: boolean;
  setIsSavedSuccess: (val: boolean) => void;
  travelSelected: any;
  cityId: number;
  // Step 1: Preços
  tag: string;
  setTag: (val: string) => void;
  colorTag: string;
  setColorTag: (val: string) => void;
  minPrice: string;
  setMinPrice: (val: string) => void;
  promotionalPriceTemp: string;
  setPromotionalPriceTem: (val: string) => void;
  basePrice: string;
  setBasePrice: (val: string) => void;
  kmPrice: string;
  setKmPrice: (val: string) => void;
  minutePrice: string;
  setMinutePrice: (val: string) => void;
  wayPointPrice: string;
  setWayPointPrice: (val: string) => void;
  longDistanceValueToFinalPrice: boolean;
  onChangeSwitchLongDistanceValueToFinalPrice: (checked: boolean) => void;
  longDistanceRadius: number;
  setLongDistanceRadius: (val: number) => void;
  longDistanceKm: string;
  setLongDistanceKm: (val: string) => void;
  rewardDriverMinPrice: string;
  setRewardDriverMinPrice: (val: string) => void;
  ideaListCommonPrice: number;
  setIdeaListCommonPrice: (val: number) => void;
  disableAfterKm: string;
  setDisableAfterKm: (val: string) => void;
  kmToAdditionalValue: string;
  setKmToAdditionalValue: (val: string) => void;
  additionalValueAfterKm: string;
  setAdditionalValueAfterKm: (val: string) => void;
  typeAdditionalValueAfterKm: string;
  setTypeAdditionalValueAfterKm: (val: string) => void;
  // Step 2: Espera
  waitingToleranceSeconds: string;
  setWaitingToleranceSeconds: (val: string) => void;
  waitingPenaltyFee: string;
  setWaitingPenaltyFee: (val: string) => void;
  waitingExtraFeePerMinute: string;
  setWaitingExtraFeePerMinute: (val: string) => void;
  // Step 3: Motorista
  valueCalcDriver: string;
  setValueCalcDriver: (val: string) => void;
  valueTypeCalcDriver: "%" | "$";
  setValueTypeCalcDriver: (val: "%" | "$") => void;
  disableOnPromotion: boolean;
  setDisableOnPromotion: (val: boolean) => void;
  tripPaymentsForms: any[];
  commissionPaymentForms: any[];
  handleChangePaymentsCommissions: (index: number, field: string, value: any) => void;
  // Step 4: Cashback, Faixa, Taxas, InDriver
  valueCashback: string;
  setValueCashback: (val: string) => void;
  valueTypeCashback: string;
  setValueTypeCashback: (val: string) => void;
  onChangeSwitchFinalPrice: (checked: boolean) => void;
  backToTripBalance: boolean;
  setBackToTripBalance: (val: boolean) => void;
  cashBacks: any[];
  handleDeleteCashback: (id: number) => void;
  handleAddCashback: () => void;
  descriptionPriceRange: string;
  setDescritpionPriceRange: (val: string) => void;
  minValue: string;
  setMinValue: (val: string) => void;
  maxValue: string;
  setMaxValue: (val: string) => void;
  newValue: string;
  setNewValue: (val: string) => void;
  handleAddRangePrice: () => void;
  datasPriceRange: any[];
  handleDeletePriceRange: (id: number) => void;
  allRates: any[];
  handleUpdatedRates: (event: any, val: any) => void;
  inputValues: any;
  handleInputChange: (event: any) => void;
  handeDeleteRates: (id: number) => void;
  isShowNewRates: boolean;
  setIsShowNewRates: (val: boolean) => void;
  nameRates: string;
  setNameRates: (val: string) => void;
  valueRates: string;
  setValueRates: (val: string) => void;
  setDescriptionRates: (val: string) => void;
  selectChargedRates: (val: string) => void;
  typeChargeRates: string;
  setTypeChargeRates: (val: string) => void;
  setStatusActiveRates: (val: boolean) => void;
  handleAddRates: () => void;
  isInDriverEnabled: boolean;
  canManageFloatingLimits: boolean;
  floatingLimitsOfferMin: string;
  setFloatingLimitsOfferMin: (val: string) => void;
  floatingLimitsOfferMax: string;
  setFloatingLimitsOfferMax: (val: string) => void;
  floatingLimitsThirdPartyEnabled: boolean;
  setFloatingLimitsThirdPartyEnabled: (val: boolean) => void;
  floatingLimitsThirdPartyMin: string;
  setFloatingLimitsThirdPartyMin: (val: string) => void;
  floatingLimitsThirdPartyMax: string;
  setFloatingLimitsThirdPartyMax: (val: string) => void;
  // Actions
  handleUpdateTariffs: () => void;
  handleDisabledCalls: () => void;
  setVisibleModal: (val: boolean) => void;
  onCloseModal?: () => void;
  loading?: boolean;
}

interface StepInstructionBannerProps {
  title: string;
  children: React.ReactNode;
}

const StepInstructionBanner: React.FC<StepInstructionBannerProps> = ({ title, children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      background: '#FFF1F2',
      border: '1.5px solid #F43F5E',
      borderRadius: '10px',
      padding: '0.85rem 1.15rem',
      marginBottom: '1.25rem',
      boxShadow: '0 2px 8px rgba(244, 63, 94, 0.08)',
    }}
  >
    <span style={{ fontSize: '20px', lineHeight: 1 }}>⚠️</span>
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: '13px',
          fontWeight: 800,
          color: '#E11D48',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '4px',
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: '13px', color: '#9F1239', lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  </div>
);

export const TariffWizard: React.FC<TariffWizardProps> = ({
  currentStep,
  setCurrentStep,
  isSavedSuccess,
  setIsSavedSuccess,
  travelSelected,
  cityId,
  onCloseModal,
  loading = false,
  tag,
  setTag,
  colorTag,
  setColorTag,
  minPrice,
  setMinPrice,
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
  longDistanceValueToFinalPrice,
  onChangeSwitchLongDistanceValueToFinalPrice,
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
  kmToAdditionalValue,
  setKmToAdditionalValue,
  additionalValueAfterKm,
  setAdditionalValueAfterKm,
  typeAdditionalValueAfterKm,
  setTypeAdditionalValueAfterKm,
  waitingToleranceSeconds,
  setWaitingToleranceSeconds,
  waitingPenaltyFee,
  setWaitingPenaltyFee,
  waitingExtraFeePerMinute,
  setWaitingExtraFeePerMinute,
  valueCalcDriver,
  setValueCalcDriver,
  valueTypeCalcDriver,
  setValueTypeCalcDriver,
  disableOnPromotion,
  setDisableOnPromotion,
  tripPaymentsForms,
  commissionPaymentForms,
  handleChangePaymentsCommissions,
  valueCashback,
  setValueCashback,
  valueTypeCashback,
  setValueTypeCashback,
  onChangeSwitchFinalPrice,
  backToTripBalance,
  setBackToTripBalance,
  cashBacks,
  handleDeleteCashback,
  handleAddCashback,
  descriptionPriceRange,
  setDescritpionPriceRange,
  minValue,
  setMinValue,
  maxValue,
  setMaxValue,
  newValue,
  setNewValue,
  handleAddRangePrice,
  datasPriceRange,
  handleDeletePriceRange,
  allRates,
  handleUpdatedRates,
  inputValues,
  handleInputChange,
  handeDeleteRates,
  isShowNewRates,
  setIsShowNewRates,
  nameRates,
  setNameRates,
  valueRates,
  setValueRates,
  setDescriptionRates,
  selectChargedRates,
  typeChargeRates,
  setTypeChargeRates,
  setStatusActiveRates,
  handleAddRates,
  isInDriverEnabled,
  canManageFloatingLimits,
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
  handleUpdateTariffs,
  handleDisabledCalls,
  setVisibleModal,
}) => {
  return (
    <>
      {/* Stepper Navigation */}
      <WizardStepper>
        <WizardStepItem
          active={currentStep === 1}
          completed={currentStep > 1}
          onClick={() => {
            setIsSavedSuccess(false);
            setCurrentStep(1);
          }}
        >
          <WizardStepNumber active={currentStep === 1} completed={currentStep > 1}>
            1
          </WizardStepNumber>
          Tarifas & Preços
        </WizardStepItem>
        <WizardStepItem
          active={currentStep === 2}
          completed={currentStep > 2}
          onClick={() => {
            setIsSavedSuccess(false);
            setCurrentStep(2);
          }}
        >
          <WizardStepNumber active={currentStep === 2} completed={currentStep > 2}>
            2
          </WizardStepNumber>
          Tempo em Espera
        </WizardStepItem>
        <WizardStepItem
          active={currentStep === 3}
          completed={currentStep > 3}
          onClick={() => {
            setIsSavedSuccess(false);
            setCurrentStep(3);
          }}
        >
          <WizardStepNumber active={currentStep === 3} completed={currentStep > 3}>
            3
          </WizardStepNumber>
          Motorista & Comissões
        </WizardStepItem>
        <WizardStepItem
          active={currentStep === 4}
          completed={currentStep > 4}
          onClick={() => {
            setIsSavedSuccess(false);
            setCurrentStep(4);
          }}
        >
          <WizardStepNumber active={currentStep === 4} completed={currentStep > 4}>
            4
          </WizardStepNumber>
          Taxas & Cashback
        </WizardStepItem>
        <WizardStepItem
          active={currentStep === 5}
          completed={isSavedSuccess}
          onClick={() => setCurrentStep(5)}
        >
          <WizardStepNumber active={currentStep === 5} completed={isSavedSuccess}>
            {isSavedSuccess ? "✓" : "5"}
          </WizardStepNumber>
          {isSavedSuccess ? "Sucesso!" : "Resumo & Salvar"}
        </WizardStepItem>
      </WizardStepper>

      {/* Passo 1: Tarifas e Preços */}
      {currentStep === 1 && (
        <WizardStepContent>
          <WizardStepTitle>1. Política de Preço & Tarifas</WizardStepTitle>
          <StepInstructionBanner title="Instruções Obrigatórias em Vermelho - Como Preencher as Tarifas:">
            <div>• <strong>PREÇO MÍNIMO (Obrigatório)*:</strong> Digite o valor mínimo cobrado pela corrida (ex: 12,00). Deve ser maior que 0.</div>
            <div>• <strong>PREÇO BASE*:</strong> Valor da bandeirada ao iniciar o chamado (ex: 0,00 ou 5,00).</div>
            <div>• <strong>PREÇO KM*:</strong> Valor cobrado por cada quilômetro rodado (ex: 2,50). Se a modalidade tiver taxa fixa por entrega, digite 0,00.</div>
            <div>• <strong>PREÇO MINUTO*:</strong> Valor cobrado por minuto de duração (ex: 0,30 ou 0,00 caso não tarifado por tempo).</div>
            <div>• <strong>ETIQUETA E COR:</strong> Texto de destaque e cor da badge visível no aplicativo do passageiro.</div>
            <div style={{ marginTop: 4, fontWeight: 700 }}>⚠️ Atenção: Utilize vírgula para centavos (ex: 12,00). Não deixe campos obrigatórios vazios!</div>
          </StepInstructionBanner>
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
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                <input
                  type="color"
                  value={colorTag || "#00349A"}
                  onChange={(event) => setColorTag(event.target.value)}
                  style={{
                    width: "48px",
                    height: "38px",
                    padding: "2px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: "#ffffff",
                  }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#475569",
                    fontFamily: "monospace",
                    background: "#f1f5f9",
                    padding: "4px 8px",
                    borderRadius: "6px",
                  }}
                >
                  {colorTag || "#00349A"}
                </span>
              </div>
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
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#00349A", margin: "0 0 10px 0" }}>
              Bônus de longa distância
            </h3>
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
              <LabelText>LONGA DISTANCIA KM</LabelText>
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
              <LabelText>RECOMPENSA AO MOTORISTA PREÇO MÍNIMO</LabelText>
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
              <LabelText>DESABILITAR APÓS (KM)</LabelText>
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
            <ContentInputs>
              <LabelText>VALOR ADICIONAL APÓS KM</LabelText>
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
              <LabelText>DISTANCIA ADICIONAL</LabelText>
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
          <WizardNavContainer>
            <div />
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <ButtonActions
                onClick={handleUpdateTariffs}
                disabled={loading}
                style={{
                  minWidth: "210px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "SALVANDO NO BANCO..." : "ATUALIZAR E SALVAR TARIFA"}
              </ButtonActions>
              <WizardButtonNext onClick={() => setCurrentStep(2)}>
                Próximo: Tempo em Espera <AiOutlineArrowRight size={16} />
              </WizardButtonNext>
            </div>
          </WizardNavContainer>
        </WizardStepContent>
      )}

      {/* Passo 2: Tempo em Espera */}
      {currentStep === 2 && (
        <WizardStepContent>
          <WizardStepTitle>2. Tempo em Espera & Tolerância</WizardStepTitle>
          <StepInstructionBanner title="Instruções Obrigatórias em Vermelho - Tempo em Espera:">
            <div>• <strong>TOLERÂNCIA DE ESPERA (segundos):</strong> Quantidade de segundos que o motorista aguarda gratuitamente no embarque (ex: 180s = 3 minutos, 300s = 5 minutos).</div>
            <div>• <strong>MULTA DE ESPERA (R$):</strong> Cobrança fixa cobrada do cliente caso ultrapasse o tempo de tolerância gratuito (ex: 5,00).</div>
            <div>• <strong>MINUTO EXCEDENTE (R$):</strong> Valor adicional cobrado a cada minuto que passar após a tolerância (ex: 0,50).</div>
            <div style={{ marginTop: 4, fontWeight: 700 }}>⚠️ Se não desejar cobrar tempo de espera nesta modalidade, preencha 0 em todos os campos.</div>
          </StepInstructionBanner>
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
          <WizardNavContainer>
            <WizardButtonPrev onClick={() => setCurrentStep(1)}>
              <AiOutlineArrowLeft size={16} /> Voltar: Tarifas
            </WizardButtonPrev>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <ButtonActions
                onClick={handleUpdateTariffs}
                disabled={loading}
                style={{
                  minWidth: "210px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "SALVANDO NO BANCO..." : "ATUALIZAR E SALVAR TARIFA"}
              </ButtonActions>
              <WizardButtonNext onClick={() => setCurrentStep(3)}>
                Próximo: Motorista & Comissões <AiOutlineArrowRight size={16} />
              </WizardButtonNext>
            </div>
          </WizardNavContainer>
        </WizardStepContent>
      )}

      {/* Passo 3: Motorista & Comissões */}
      {currentStep === 3 && (
        <WizardStepContent>
          <WizardStepTitle>3. Cálculos de Motoristas & Comissões</WizardStepTitle>
          <StepInstructionBanner title="Instruções Obrigatórias em Vermelho - Comissão do Motorista:">
            <div>• <strong>TAXA DE SERVIÇO GERAL:</strong> Porcentagem (%) ou valor fixo ($) que a central retém por viagem finalizada (ex: 15% ou R$ 2,00).</div>
            <div>• <strong>TIPO DE CÁLCULO:</strong> Escolha "%" para reter percentual ou "$" para valor fixo por corrida.</div>
            <div>• <strong>COMISSÕES POR FORMA DE PAGAMENTO:</strong> Configure taxas personalizadas para Dinheiro, PIX, Cartão ou Saldo do App.</div>
            <div>• <strong>DESABILITAR EM PROMOÇÃO:</strong> Marque para isentar o motorista da comissão durante viagens promocionais.</div>
            <div style={{ marginTop: 4, fontWeight: 700 }}>⚠️ Esta comissão é automaticamente debitada ou descontada do saldo do motorista ao concluir a corrida.</div>
          </StepInstructionBanner>
          <ContentPricePolicy>
            <MoneyValueTypeInput
              label="TAXA DE SERVIÇO"
              value={valueCalcDriver}
              onChangeValue={setValueCalcDriver}
              valueType={valueTypeCalcDriver}
              onChangeType={setValueTypeCalcDriver}
              radioGroupName="valueTypeCalcDriver"
            />
            <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <Checkbox
                checked={disableOnPromotion}
                onChange={(event) =>
                  setDisableOnPromotion(event.target.checked)
                }
              />
              <label style={{ color: "#334155", fontSize: "14px", fontWeight: 500 }}>
                Desabilitar comissão no preço promocional
              </label>
            </div>
          </ContentPricePolicy>

          <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginTop: "1.2rem", marginBottom: "0.5rem" }}>
            Comissões por Forma de Pagamento
          </h4>
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
          <WizardNavContainer>
            <WizardButtonPrev onClick={() => setCurrentStep(2)}>
              <AiOutlineArrowLeft size={16} /> Voltar: Tempo em Espera
            </WizardButtonPrev>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <ButtonActions
                onClick={handleUpdateTariffs}
                disabled={loading}
                style={{
                  minWidth: "210px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "SALVANDO NO BANCO..." : "ATUALIZAR E SALVAR TARIFA"}
              </ButtonActions>
              <WizardButtonNext onClick={() => setCurrentStep(4)}>
                Próximo: Taxas & Cashback <AiOutlineArrowRight size={16} />
              </WizardButtonNext>
            </div>
          </WizardNavContainer>
        </WizardStepContent>
      )}

      {/* Passo 4: Taxas, Cashback & Faixas */}
      {currentStep === 4 && (
        <WizardStepContent>
          <WizardStepTitle>4. Cashback, Faixa de Preços & Taxas Extras</WizardStepTitle>
          <StepInstructionBanner title="Instruções Obrigatórias em Vermelho - Taxas Extras e Cashback:">
            <div>• <strong>TAXA ADICIONAL / SOBRETAXA:</strong> Taxa administrativa fixa ou percentual somada ao valor final da corrida (opcional).</div>
            <div>• <strong>CASHBACK AO PASSAGEIRO:</strong> Ative se desejar creditar saldo promocional ao passageiro para usar em viagens futuras.</div>
            <div>• <strong>FAIXA DE PREÇO (PRICE RANGE):</strong> Crie tabelas de preços com valores diferenciados por distância ou horário.</div>
            <div style={{ marginTop: 4, fontWeight: 700 }}>⚠️ Caso esta modalidade não utilize taxas adicionais nem cashback, basta clicar em "Próximo Passo".</div>
          </StepInstructionBanner>
          {/* Cashback */}
          <ContentPricePolicy>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#00349A", margin: "0 0 10px 0" }}>
              CashBack
            </h3>
            <ContentInputs>
              <InputText
                type="text"
                value={valueCashback}
                onChange={(event) =>
                  setValueCashback(
                    Mask.setMaskMoney(event.target.value)
                  )
                }
                placeholder="Valor do cashback"
              />
              <Radio.Group
                onChange={(event) =>
                  setValueTypeCashback(event.target.value)
                }
                value={valueTypeCashback}
              >
                <Radio value="%">%</Radio>
                <Radio value="$">$</Radio>
              </Radio.Group>
            </ContentInputs>
            <ContentInputs>
              <Switch onChange={onChangeSwitchFinalPrice} />
              <LabelText>Soma a tarifa final</LabelText>
            </ContentInputs>
            <h4 style={{ margin: "10px 0 6px 0", fontSize: "13px", fontWeight: 600 }}>Saldo direcionado para</h4>
            <ContentInputs style={{ justifyContent: "initial" }}>
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
            {cashBacks && cashBacks.length > 0 && (
              <ContentTable>
                <table style={{ width: "100%" }}>
                  <THead>
                    <tr>
                      <th>Criado em</th>
                      <th>Valor</th>
                      <th>Ações</th>
                    </tr>
                  </THead>
                  <TBody>
                    {cashBacks.map((value) => (
                      <tr key={value.id}>
                        <th>{new Date(value.created_at).toLocaleString()}</th>
                        <th>{`${value.valueType} ${Mask.setMaskMoneyAlternative(value.value)}`}</th>
                        <th>
                          <ButtonDelete onClick={() => handleDeleteCashback(value.id)}>
                            <AiOutlineClose size={18} fontWeight="bold" />
                          </ButtonDelete>
                        </th>
                      </tr>
                    ))}
                  </TBody>
                </table>
              </ContentTable>
            )}
            <ContentBtnSaveCashBack>
              <Button color="#0069d9" onClick={handleAddCashback}>
                Salvar Cashback
              </Button>
            </ContentBtnSaveCashBack>
          </ContentPricePolicy>

          {/* Faixa de Preços */}
          <ContentPricePolicy style={{ marginTop: "1rem" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#00349A", margin: "0 0 10px 0" }}>
              Faixas de Preço
            </h3>
            <LabelText>Descrição</LabelText>
            <TextArea
              rows={3}
              value={descriptionPriceRange}
              onChange={(event) => setDescritpionPriceRange(event.target.value)}
              placeholder="Descrição da faixa de preço"
            />
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
              <span style={{ marginTop: 20 }}>=</span>
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
                Salvar Faixa
              </Button>
            </ContentInputs>
            {datasPriceRange && datasPriceRange.length > 0 && (
              <ContentTable>
                <table style={{ width: "100%" }}>
                  <THead>
                    <tr>
                      <th>Data</th>
                      <th>Inicial</th>
                      <th>Final</th>
                      <th>Fixo</th>
                      <th>Tipo</th>
                      <th>Ações</th>
                    </tr>
                  </THead>
                  <TBody>
                    {datasPriceRange.map((value) => (
                      <Fragment key={value.id}>
                        <tr>
                          <th>{value.created_at ? new Date(value.created_at).toLocaleDateString() : "-"}</th>
                          <th>{`R$ ${Mask.setMaskMoneyAlternative(value.min_value)}`}</th>
                          <th>{`R$ ${Mask.setMaskMoneyAlternative(value.max_value)}`}</th>
                          <th>{`R$ ${Mask.setMaskMoneyAlternative(value.new_value)}`}</th>
                          <th>{value.trip_type?.type || value.tripTypeName || "Geral"}</th>
                          <th>
                            <ButtonClosePrices onClick={() => handleDeletePriceRange(value.id)}>
                              X
                            </ButtonClosePrices>
                          </th>
                        </tr>
                      </Fragment>
                    ))}
                  </TBody>
                </table>
              </ContentTable>
            )}
          </ContentPricePolicy>

          {/* Taxas por tipo de viagem */}
          <ContentPricePolicy style={{ marginTop: "1rem" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#00349A", margin: "0 0 10px 0" }}>
              Taxas Adicionais
            </h3>
            {allRates.map((value, index) => (
              <Fragment key={value.id}>
                <form
                  onSubmit={(event) =>
                    handleUpdatedRates(event, inputValues[`valueRates-${index}`])
                  }
                  style={{ marginBottom: "1rem", borderBottom: "1px dashed #e2e8f0", paddingBottom: "1rem" }}
                >
                  <ContentInputs>
                    <ContentColumnInputs>
                      <input type="hidden" name="id" value={value.id} />
                      <LabelText>Nome da taxa</LabelText>
                      <InputText type="text" defaultValue={value.name} name="nameRates" id="nameRates" />
                    </ContentColumnInputs>
                    <ContentColumnInputs>
                      <LabelText>Valor</LabelText>
                      <InputText
                        type="text"
                        defaultValue={Mask.setMaskMoneyAlternative(value.value)}
                        value={inputValues[`valueRates-${index}`] || ""}
                        onChange={handleInputChange}
                        name={`valueRates-${index}`}
                        id={`valueRates-${index}`}
                      />
                    </ContentColumnInputs>
                  </ContentInputs>
                  <ContentInputs style={{ justifyContent: "flex-end", gap: "8px" }}>
                    <Button color="#0069d9" type="submit">Atualizar</Button>
                    <Button color="#C82333" type="button" onClick={() => handeDeleteRates(value.id)}>Excluir</Button>
                  </ContentInputs>
                </form>
              </Fragment>
            ))}
            {isShowNewRates ? (
              <>
                <ContentInputs>
                  <ContentColumnInputs>
                    <LabelText>Nome da taxa</LabelText>
                    <InputText type="text" value={nameRates} onChange={(event) => setNameRates(event.target.value)} />
                  </ContentColumnInputs>
                  <ContentColumnInputs>
                    <LabelText>Valor</LabelText>
                    <InputText type="text" value={valueRates} onChange={(event) => setValueRates(Mask.setMaskMoney(event.target.value))} />
                  </ContentColumnInputs>
                </ContentInputs>
                <ContentInputs style={{ justifyContent: "flex-end" }}>
                  <Button color="#0069d9" onClick={handleAddRates}>Criar Taxa</Button>
                </ContentInputs>
              </>
            ) : (
              <Button color="#0069d9" onClick={() => setIsShowNewRates(true)}>+ Nova Taxa</Button>
            )}
          </ContentPricePolicy>

          {/* InDriver Limites flutuantes */}
          {isInDriverEnabled && canManageFloatingLimits && (
            <ContentPricePolicy style={{ marginTop: "1rem" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#00349A", margin: "0 0 10px 0" }}>
                Limites Flutuantes (InDriver)
              </h3>
              <ContentInputs>
                <ContentColumnInputs>
                  <LabelText>Valor mínimo %</LabelText>
                  <InputText type="text" value={floatingLimitsOfferMin} onChange={(event) => setFloatingLimitsOfferMin(Mask.setMaskMoney(event.target.value))} />
                </ContentColumnInputs>
                <ContentColumnInputs>
                  <LabelText>Valor máximo %</LabelText>
                  <InputText type="text" value={floatingLimitsOfferMax} onChange={(event) => setFloatingLimitsOfferMax(Mask.setMaskMoney(event.target.value))} />
                </ContentColumnInputs>
              </ContentInputs>
            </ContentPricePolicy>
          )}

          <WizardNavContainer>
            <WizardButtonPrev onClick={() => setCurrentStep(3)}>
              <AiOutlineArrowLeft size={16} /> Voltar: Comissões
            </WizardButtonPrev>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <ButtonActions
                onClick={handleUpdateTariffs}
                disabled={loading}
                style={{
                  minWidth: "210px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "SALVANDO NO BANCO..." : "ATUALIZAR E SALVAR TARIFA"}
              </ButtonActions>
              <WizardButtonNext onClick={() => setCurrentStep(5)}>
                Revisar e Salvar <AiOutlineArrowRight size={16} />
              </WizardButtonNext>
            </div>
          </WizardNavContainer>
        </WizardStepContent>
      )}

      {/* Passo 5: Resumo e Confirmação / Tela de Sucesso */}
      {currentStep === 5 && (
        <WizardStepContent>
          {isSavedSuccess ? (
            <SuccessScreenContainer>
              <SuccessIconBadge>
                <AiOutlineCheck />
              </SuccessIconBadge>
              <SuccessTitle>Tarifa Atualizada com Sucesso!</SuccessTitle>
              <SuccessSubtitle>
                Os novos preços e regras de <strong>{travelSelected?.type || "Tarifa"}</strong> foram persistidos no banco de dados com êxito e já estão ativos no sistema.
              </SuccessSubtitle>

              <SuccessSummaryGrid>
                <SuccessSummaryCard>
                  <SuccessSummaryLabel>Modalidade</SuccessSummaryLabel>
                  <SuccessSummaryValue>{travelSelected?.type || "Tarifa"}</SuccessSummaryValue>
                </SuccessSummaryCard>
                <SuccessSummaryCard>
                  <SuccessSummaryLabel>Preço Mínimo</SuccessSummaryLabel>
                  <SuccessSummaryValue>{`R$ ${minPrice}`}</SuccessSummaryValue>
                </SuccessSummaryCard>
                <SuccessSummaryCard>
                  <SuccessSummaryLabel>Preço Base</SuccessSummaryLabel>
                  <SuccessSummaryValue>{`R$ ${basePrice}`}</SuccessSummaryValue>
                </SuccessSummaryCard>
                <SuccessSummaryCard>
                  <SuccessSummaryLabel>Preço KM</SuccessSummaryLabel>
                  <SuccessSummaryValue>{`R$ ${kmPrice}`}</SuccessSummaryValue>
                </SuccessSummaryCard>
                <SuccessSummaryCard>
                  <SuccessSummaryLabel>Preço Minuto</SuccessSummaryLabel>
                  <SuccessSummaryValue>{`R$ ${minutePrice}`}</SuccessSummaryValue>
                </SuccessSummaryCard>
                <SuccessSummaryCard>
                  <SuccessSummaryLabel>Comissão Motorista</SuccessSummaryLabel>
                  <SuccessSummaryValue>{`${valueCalcDriver || "0,00"} ${valueTypeCalcDriver}`}</SuccessSummaryValue>
                </SuccessSummaryCard>
              </SuccessSummaryGrid>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <WizardButtonPrev
                  onClick={() => {
                    setIsSavedSuccess(false);
                    setCurrentStep(1);
                  }}
                >
                  <AiOutlineArrowLeft size={16} /> Editar Novamente
                </WizardButtonPrev>
                {onCloseModal && (
                  <WizardButtonNext
                    onClick={onCloseModal}
                    style={{ background: "#10b981", borderColor: "#059669" }}
                  >
                    <AiOutlineCheckCircle size={16} /> Concluir e Fechar
                  </WizardButtonNext>
                )}
                <WizardButtonNext onClick={() => setVisibleModal(true)}>
                  <AiOutlinePlus size={16} /> Adicionar Nova Tarifa
                </WizardButtonNext>
              </div>
            </SuccessScreenContainer>
          ) : (
            <>
              <WizardStepTitle>5. Resumo e Confirmação da Tarifa</WizardStepTitle>
              <StepInstructionBanner title="Instruções Obrigatórias em Vermelho - Como Atualizar e Salvar:">
                <div>• <strong>1. Revise com Atenção:</strong> Verifique os valores de Preço Mínimo, Base, KM e Comissões nos cartões abaixo.</div>
                <div>• <strong>2. Gravar no Banco:</strong> Para salvar definitivamente no banco de dados e aplicar no app, clique no botão azul abaixo:</div>
                <div style={{ margin: "4px 0", fontWeight: 800, fontSize: "14px" }}>👉 CLIQUE EM "ATUALIZAR E SALVAR TARIFA"</div>
                <div>• <strong>3. Confirmação:</strong> A alteração será sincronizada instantaneamente com os servidores e você verá a tela de confirmação.</div>
              </StepInstructionBanner>
              <p style={{ color: "#64748b", margin: "0 0 1.25rem 0", fontSize: "14px" }}>
                Revise os parâmetros configurados abaixo antes de persistir no banco de dados.
              </p>

              <SummarySectionCard>
                <h4 style={{ color: "#00349A", fontWeight: 700, margin: "0 0 12px 0", fontSize: "15px" }}>
                  Valores Principais de Viagem ({travelSelected?.type || "Tarifa"})
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
                  <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Preço Mínimo:</strong> <div style={{ fontSize: "16px", fontWeight: 700 }}>R$ {minPrice}</div></div>
                  <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Preço Base:</strong> <div style={{ fontSize: "16px", fontWeight: 700 }}>R$ {basePrice}</div></div>
                  <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Preço KM:</strong> <div style={{ fontSize: "16px", fontWeight: 700 }}>R$ {kmPrice}</div></div>
                  <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Preço Minuto:</strong> <div style={{ fontSize: "16px", fontWeight: 700 }}>R$ {minutePrice}</div></div>
                  <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Preço Promocional:</strong> <div style={{ fontSize: "16px", fontWeight: 700 }}>R$ {promotionalPriceTemp}</div></div>
                  <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Preço Parada:</strong> <div style={{ fontSize: "16px", fontWeight: 700 }}>R$ {wayPointPrice}</div></div>
                </div>
              </SummarySectionCard>

              <SummarySectionCard>
                <h4 style={{ color: "#00349A", fontWeight: 700, margin: "0 0 12px 0", fontSize: "15px" }}>
                  Comissão & Regras Operacionais
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
                  <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Taxa Serviço Motorista:</strong> <div style={{ fontSize: "15px", fontWeight: 700 }}>{valueCalcDriver || "0,00"} {valueTypeCalcDriver}</div></div>
                  <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Tolerância Espera:</strong> <div style={{ fontSize: "15px", fontWeight: 700 }}>{waitingToleranceSeconds || "0"}s</div></div>
                  <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Multa Espera:</strong> <div style={{ fontSize: "15px", fontWeight: 700 }}>R$ {waitingPenaltyFee || "0,00"}</div></div>
                  <div><strong style={{ fontSize: "12px", color: "#64748b" }}>Minuto Excedente:</strong> <div style={{ fontSize: "15px", fontWeight: 700 }}>R$ {waitingExtraFeePerMinute || "0,00"}</div></div>
                </div>
              </SummarySectionCard>

              <WizardNavContainer>
                <WizardButtonPrev onClick={() => setCurrentStep(4)}>
                  <AiOutlineArrowLeft size={16} /> Voltar e Ajustar
                </WizardButtonPrev>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <ButtonActions
                    onClick={handleDisabledCalls}
                    style={{
                      backgroundColor: "#1e293b",
                      boxShadow: "0 4px 14px rgba(30, 41, 59, 0.25)",
                    }}
                  >
                    DESABILITAR CHAMADO
                  </ButtonActions>
                  <ButtonActions onClick={handleUpdateTariffs} disabled={loading} style={{ minWidth: "240px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                    {loading ? "SALVANDO NO BANCO..." : "ATUALIZAR E SALVAR TARIFA"}
                  </ButtonActions>
                </div>
              </WizardNavContainer>
            </>
          )}
        </WizardStepContent>
      )}
    </>
  );
};
