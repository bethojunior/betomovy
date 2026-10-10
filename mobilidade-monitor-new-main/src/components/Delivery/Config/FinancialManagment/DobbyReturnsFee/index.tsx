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
    try {
      const responsePayMachineReturns = await api.get(
        `payMachineReturn/${cityId}`
      );

      if (responsePayMachineReturns.status) {
        setPayMachineReturns(responsePayMachineReturns.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
  };

  const getTypesFee = async () => {
    try {
      const responseTypesFee = await api.get("payMachineReturn/types");

      if (responseTypesFee.status) {
        setTypesFee(responseTypesFee.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
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

  const typesFeeFormated = typesFee.map((value) => {
    return {
      value: String(value.id),
      label: value.name,
    };
  });

  useEffect(() => {
    if (payMachineReturns) {
      setValueDobby(
        payMachineReturns.value
          .toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })
          .replace("R$", "")
      );
      setPayMachineReturnTypeId(
        String(payMachineReturns.payMachineReturnTypeId)
      );
      setPaidByPlatform(String(payMachineReturns.paidByPlatform));
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
