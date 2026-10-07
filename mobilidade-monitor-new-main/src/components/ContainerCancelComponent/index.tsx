import { useRef, useState } from "react";
import { RadioButtonGroup, Section, SectionRow, TextArea } from "./styles";
import { Button } from "antd";
import { ContainerCheckbox } from "./ContainerCheckbox";
import { CurrencyInput, CurrencyInputRef } from "../CurrencyInput";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import swal from "sweetalert";
import { TripDetailsProps } from "../Trip/Details/Header/types";
import Mask from "../../services/Mask";
import api from "../../services/api";
import { STATUS_CANCELED } from "../../utils/TripStatus";

const dataRefund = [
  {
    id: "fullRefund",
    title: "Devolução completa",
  },
  {
    id: "partialRefund",
    title: "Devolução parcial",
  },
  {
    id: "noRefund",
    title: "Sem devolução",
  },
];

const paymentTypeRefund = [
  {
    id: "voucher",
    title: "Voucher",
  },
  {
    id: "pix",
    title: "Pix",
  },
  {
    id: "credit_card",
    title: "Estorno de cartão",
  },
];

interface Props {
  detailsTrip: TripDetailsProps;
  onCancelTripNoRefund: () => void;
  onClose: () => void;
  handleMessageAlerts: (message: string, type: "success" | "error") => void;
  setDetailsTrip: (detailsTrip: TripDetailsProps) => void;
  getStatus: (status: string) => void;
}

const ContainerCancelComponent = ({
  detailsTrip,
  onCancelTripNoRefund,
  onClose,
  handleMessageAlerts,
  setDetailsTrip,
  getStatus,
}: Props) => {
  const [devolutionPayload, setDevolutionPayload] = useState({
    refundType: "",
    paymentType: "",
    valueDevolution: "" as string | number,
  });
  const inputRef = useRef<CurrencyInputRef>(null);
  const textareaDriverRef = useRef<HTMLTextAreaElement>(null);
  const textareaClientRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);

  const handleRefundChange = (event: CheckboxChangeEvent) => {
    setDevolutionPayload({
      ...devolutionPayload,
      refundType: event.target.id || "",
      valueDevolution: "",
    });
    if (inputRef.current) inputRef.current.clear();
  };

  const handleTypeRefundChange = (event: CheckboxChangeEvent) => {
    if (event.target.id === "pix") {
      swal({
        title: "O estorno via PIX, tem que ser feito de forma manual!",
        text: "Proderá prosseguir com o cancelamento, porém o estorno tem quer ser feito através do gestor e cliente!",
        icon: "warning",
      });
    }
    setDevolutionPayload({
      ...devolutionPayload,
      paymentType: event.target.id || "",
    });
  };

  const validateProccess = () => {
    if (!devolutionPayload.refundType) {
      throw new Error("Tipo de devolução não informado");
    }

    if (!devolutionPayload.paymentType) {
      throw new Error("Forma de devolução não informado");
    }

    if (
      devolutionPayload.refundType === "partialRefund" &&
      !devolutionPayload.valueDevolution
    ) {
      throw new Error("Informe o valor da devolução");
    }

    if (
      devolutionPayload.paymentType === "credit_card" &&
      devolutionPayload.refundType === "partialRefund"
    ) {
      throw new Error("Estorno de cartão não pode ser parcial!");
    }
    return true;
  };

  const handleProccess = () => {
    try {
      if (devolutionPayload?.refundType === "noRefund") {
        onCancelTripNoRefund();
        onClose();
        return;
      }
      validateProccess();
      onCancelTripWithRefund();
    } catch (e: any) {
      swal({
        title: e?.message,
        icon: "warning",
      });
    }
  };

  const onCancelTripWithRefund = () => {
    const price =
      detailsTrip?.price === Number(devolutionPayload.valueDevolution || 0)
        ? null
        : Number(devolutionPayload.valueDevolution || 0) || null;
    const payload = {
      formTypeDevolution: devolutionPayload.paymentType,
      valueDevolution:
        devolutionPayload.paymentType === "credit_card"
          ? 0
          : devolutionPayload.refundType === "fullRefund"
          ? detailsTrip?.price
          : price,
      messagesDevolution: {
        driver: textareaDriverRef?.current?.value || "",
        client: textareaClientRef?.current?.value || "",
      },
    };
    swal({
      title: "Deseja cancelar essa corrida?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isCancel) => {
      if (isCancel) {
        setLoading(true);
        onClose();
        api
          .put(`trip/${detailsTrip?.tripReference}/cancel`, payload)
          .then((response) => {
            setLoading(false);
            if (response.data.status) {
              handleMessageAlerts("Corrida cancelada com sucesso!", "success");
              setDetailsTrip({
                ...detailsTrip,
                status: STATUS_CANCELED,
              });
              getStatus(STATUS_CANCELED);
            }
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
            handleMessageAlerts("Erro ao cancelar corrida!", "error");
          });
      }
      if (textareaClientRef.current) textareaClientRef.current.value = "";
      if (textareaDriverRef.current) textareaDriverRef.current.value = "";
    });
  };

  return (
    <>
      <Section>
        <h3>Valores</h3>
        <RadioButtonGroup>
          {dataRefund.map((item) => (
            <ContainerCheckbox
              title={item.title}
              id={item.id}
              key={item.id}
              checked={devolutionPayload.refundType === item.id}
              onChange={handleRefundChange}
            />
          ))}
          <CurrencyInput
            onValueChange={(value) => {
              const price = Mask.setRemoveMaskMoney(String(value));

              if (price > detailsTrip?.price) {
                swal({
                  title: "O valor informado é maior que o valor da viagem!",
                  icon: "warning",
                });
                throw new Error();
              }
              setDevolutionPayload({
                ...devolutionPayload,
                valueDevolution: Mask.setRemoveMaskMoney(String(value)),
              });
            }}
            ref={inputRef}
            placeholder={"Valor da devolução"}
            disabled={devolutionPayload.refundType !== "partialRefund"}
          />
        </RadioButtonGroup>
      </Section>
      {devolutionPayload.refundType === "noRefund" ? null : (
        <>
          <Section>
            <h3>Forma de devolução</h3>
            {paymentTypeRefund.map((item) => {
              return (
                <>
                  {item.id === "credit_card" &&
                  detailsTrip?.tripPaymentFormTypeId !== 3 ? null : (
                    <ContainerCheckbox
                      title={item.title}
                      key={item.id}
                      id={item.id}
                      checked={devolutionPayload.paymentType === item.id}
                      onChange={handleTypeRefundChange}
                    />
                  )}
                </>
              );
            })}
          </Section>
          <SectionRow>
            <Section
              style={{
                width: "100%",
              }}
            >
              <h3>Mensagem para o motorista</h3>
              <TextArea ref={textareaDriverRef} />
            </Section>
            <Section
              style={{
                width: "100%",
              }}
            >
              <h3>Mensagem para o Cliente</h3>
              <TextArea ref={textareaClientRef} />
            </Section>
          </SectionRow>
        </>
      )}

      <Section
        style={{
          marginTop: 10,
        }}
      >
        <Button loading={loading} onClick={handleProccess} type="primary">
          Processar ações e enviar mensagens
        </Button>
      </Section>
    </>
  );
};

export default ContainerCancelComponent;
