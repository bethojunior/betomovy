import { Button, Input, Select } from "antd";
import { useEffect, useState } from "react";

import { Container, ContentInput, LabelInput, ContentButton } from "./styles";

import Mask from "../../../../../services/Mask";

import api from "../../../../../services/api";
import swal from "sweetalert";
import { AxiosError } from "axios";

import { PayMachineReturnTypesProps, PayMachineReturnsProps } from "./types";
import Session from "../../../../../utils/Session";

export const DobbyReturnsFee = () => {
  const [valueDobby, setValueDobby] = useState("0,00");

  const [payMachineReturns, setPayMachineReturns] =
    useState<PayMachineReturnsProps | null>(null);
  const [typesFee, setTypesFee] = useState<PayMachineReturnTypesProps[]>([]);

  const [payMachineReturnTypeId, setPayMachineReturnTypeId] = useState<
    string | null
  >(null);
  const [paidByPlatform, setPaidByPlatform] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const cityId = Session.getLocal("citySelected")?.cityId;

  const getPayMachineReturns = async () => {
    if (!cityId) return;
    try {
      const responsePayMachineReturns = await api.get(
        `payMachineReturn/${cityId}`
      );

      if (responsePayMachineReturns?.data) {
        setPayMachineReturns(responsePayMachineReturns.data?.response ?? null);
      }
    } catch (error) {
      // Silencioso se não houver dados
    }
  };

  const getTypesFee = async () => {
    try {
      const responseTypesFee = await api.get("payMachineReturn/types");

      if (responseTypesFee?.data) {
        const raw = responseTypesFee.data?.response ?? responseTypesFee.data?.data;
        setTypesFee(Array.isArray(raw) ? raw : []);
      }
    } catch (error) {
      setTypesFee([]);
    }
  };

  const handleUpdateDobbyReturnsFee = async () => {
    if (!paidByPlatform || !payMachineReturnTypeId) {
      swal({
        title: "Preencha os campos",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      const responseUpdateDobbyReturnsFee = await api.post("payMachineReturn", {
        cityId: cityId,
        paidByPlatform,
        payMachineReturnTypeId,
        value: Mask.setRemoveMaskMoney(valueDobby),
      });

      if (responseUpdateDobbyReturnsFee.status) {
        swal({
          title: "Taxa de devolução atualizada com sucesso!",
          icon: "success",
        });
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTypesFee();
    getPayMachineReturns();
  }, []);

  const typesFeeFormated = (Array.isArray(typesFee) ? typesFee : []).map((value) => {
    return {
      value: String(value?.id),
      label: value?.name || "",
    };
  });

  useEffect(() => {
    if (payMachineReturns) {
      const valNum = Number(payMachineReturns.value ?? 0);
      setValueDobby(
        valNum
          .toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
          .replace("R$", "")
          .trim()
      );
      setPayMachineReturnTypeId(
        payMachineReturns.payMachineReturnTypeId ? String(payMachineReturns.payMachineReturnTypeId) : null
      );
      setPaidByPlatform(
        payMachineReturns.paidByPlatform != null ? String(payMachineReturns.paidByPlatform) : null
      );
    }
  }, [payMachineReturns]);

  return (
    <Container>
      <ContentInput>
        <LabelInput>Valor</LabelInput>
        <Input
          placeholder="Valor"
          value={valueDobby}
          onChange={(event) =>
            setValueDobby(Mask.setMaskMoney(event.target.value))
          }
        />
      </ContentInput>

      <ContentInput>
        <LabelInput>Tipo de Taxa</LabelInput>
        <Select
          placeholder="Tipo de Taxa"
          options={typesFeeFormated}
          value={payMachineReturnTypeId}
          onChange={(value) => setPayMachineReturnTypeId(value)}
        />
      </ContentInput>

      <ContentInput>
        <LabelInput>Forma de Pagamento da taxa ao entregador</LabelInput>
        <Select
          placeholder="Forma de Pagamento da taxa ao entregador"
          options={[
            {
              value: "1",
              label: "Pago pela plataforma",
            },
            {
              value: "0",
              label: "Pago pelo estabelecimento no local",
            },
          ]}
          value={paidByPlatform}
          onChange={(value) => setPaidByPlatform(value)}
        />
      </ContentInput>

      <ContentButton>
        <Button
          type="primary"
          loading={loading}
          onClick={handleUpdateDobbyReturnsFee}
        >
          Atualizar
        </Button>
      </ContentButton>
    </Container>
  );
};
