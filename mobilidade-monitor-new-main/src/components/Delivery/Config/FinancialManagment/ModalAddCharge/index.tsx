import { Modal, Input, Button } from "antd";
import swal from "sweetalert";
import { AxiosError } from "axios";

import { useState } from "react";

import { Container, ContentInput, Label } from "./styles";
import api from "../../../../../services/api";

import Mask from "../../../../../services/Mask";

interface ModalAddChargeProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  getEstabilishments: () => void;
}

export const ModalAddCharge = ({
  visible,
  setVisible,
  getEstabilishments,
}: ModalAddChargeProps) => {
  const [name, setName] = useState<string>("");
  const [valueFixe, setValueFixe] = useState<string>("0,00");
  const [orderValue, setOrderValue] = useState<string>("0,00");
  const [orderPercentage, setOrderPercentage] = useState<string>("0,00");

  const [loading, setLoading] = useState<boolean>(false);

  const handleCloseModal = () => {
    setVisible(false);
    setName("");
    setValueFixe("0,00");
    setOrderValue("0,00");
    setOrderPercentage("0,00");
  };

  const handleAddCharge = async () => {
    if (
      name.length <= 0 ||
      valueFixe.length <= 0 ||
      orderPercentage.length <= 0 ||
      orderValue.length <= 0
    ) {
      swal({
        title: "Preencha os campos",
        icon: "warning",
      });

      return;
    }

    try {
      setLoading(true);
      const responseCharge = await api.post(
        "establishmentCollectionManagement",
        {
          label: name,
          fixedValue: Mask.setRemoveMaskMoney(valueFixe),
          orderPercentage: Mask.setRemoveMaskMoney(orderPercentage),
          orderValue: Mask.setRemoveMaskMoney(orderValue),
        }
      );

      if (responseCharge.status) {
        swal({
          title: "Cobrança adicionada com sucesso!",
          icon: "success",
        });
        getEstabilishments();
        handleCloseModal();
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

  return (
    <Modal
      title="Adicionar Cobrança"
      open={visible}
      onCancel={handleCloseModal}
      footer={[
        <Button key={1} onClick={handleCloseModal}>
          Cancelar
        </Button>,
        <Button
          type="primary"
          onClick={handleAddCharge}
          key={2}
          loading={loading}
        >
          Adicionar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            placeholder="Nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </ContentInput>

        <ContentInput
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div>
            <Label htmlFor="value-fixe">Valor fixo</Label>
            <Input
              id="value-fixe"
              value={valueFixe}
              onChange={(event) =>
                setValueFixe(Mask.setMaskMoney(event.target.value))
              }
            />
          </div>

          <div>
            <Label htmlFor="order-value">R$ por entrega</Label>
            <Input
              id="order-value"
              value={orderValue}
              onChange={(event) =>
                setOrderValue(Mask.setMaskMoney(event.target.value))
              }
            />
          </div>

          <div>
            <Label htmlFor="order-percentage">% por entrega</Label>
            <Input
              id="order-percentage"
              value={orderPercentage}
              onChange={(event) =>
                setOrderPercentage(Mask.setMaskMoney(event.target.value))
              }
            />
          </div>
        </ContentInput>
      </Container>
    </Modal>
  );
};
