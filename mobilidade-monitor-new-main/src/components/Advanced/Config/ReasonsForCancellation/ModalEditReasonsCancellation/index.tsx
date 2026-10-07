import { Button, Modal, Input, Select, Switch } from "antd";
import swal from "sweetalert";

import { useEffect, useState } from "react";

import { ReasonsCancellationsProps } from "../../../../../pages/Advanced/Configs/ReasonsForCancellations/types";
import api from "../../../../../services/api";

import { Container, ContentInput, LabelInput } from "./styles";

interface ModalEditReasonsCancellationProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  reasonsCancellationSelected: ReasonsCancellationsProps | null;
  setReasonsCancellationSelected: (
    data: ReasonsCancellationsProps | null
  ) => void;
  getAllReasonsCancellation: () => void;
}

const Constants = {
  driver: "1",
  client: "2",
};

export const ModalEditReasonsCancellation = ({
  visible,
  setVisible,
  reasonsCancellationSelected,
  setReasonsCancellationSelected,
  getAllReasonsCancellation,
}: ModalEditReasonsCancellationProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [nameReasons, setNameReasons] = useState<string>("");
  const [typeReasonsCancellation, setTypeReasonsCancellation] =
    useState<string>(Constants.client);

  const [reports, setReports] = useState(false);
  const [monetized, setMonetized] = useState(false);

  const handleCloseModal = () => {
    setVisible(false);
    setReasonsCancellationSelected(null);
    setNameReasons("");
  };

  const handleEditReasonsCancellation = async () => {
    try {
      if (nameReasons.trim().length == 0) {
        return swal({
          title: "A descrição do motivo é obrigatoria",
          icon: "warning",
        });
      }
      setLoading(true);
      const responseReasonsCancellation = await api.put(
        `cancellationReasons/${reasonsCancellationSelected?.idCancellationReasons}`,
        {
          id: reasonsCancellationSelected?.idCancellationReasons,
          cancellationReasonsTypeId: typeReasonsCancellation,
          name: nameReasons,
          reports: reports,
          monetized: monetized,
        }
      );

      if (responseReasonsCancellation.status) {
        swal({
          title: "Motivo de cancelamento editado com sucesso",
          icon: "success",
        }).then(() => {
          handleCloseModal();
          getAllReasonsCancellation();
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: boolean) => {
    setReports(e);
    if (!e) {
      setMonetized(false);
    }
  };

  useEffect(() => {
    if (reasonsCancellationSelected) {
      setNameReasons(reasonsCancellationSelected?.name);
      setReports(Boolean(reasonsCancellationSelected.reports));
      setMonetized(Boolean(reasonsCancellationSelected.monetized));
      setTypeReasonsCancellation(
        String(reasonsCancellationSelected.cancellationReasonsTypeId)
      );
    }
  }, [reasonsCancellationSelected]);

  useEffect(() => {
    if (visible) {
      setReports(false);
      setMonetized(false);
    }
  }, [open]);

  useEffect(() => {
    if (typeReasonsCancellation == Constants.driver) {
      setReports(false);
      setMonetized(false);
    }
  }, [typeReasonsCancellation]);

  return (
    <Modal
      title="Editar motivo de cancelamento"
      open={visible}
      onCancel={handleCloseModal}
      footer={[
        <Button key={1} onClick={handleCloseModal}>
          Cancelar
        </Button>,
        <Button
          key={2}
          type="primary"
          loading={loading}
          onClick={handleEditReasonsCancellation}
        >
          Confirmar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <LabelInput htmlFor="reason-cancellation">
            Motivo de cancelamento
          </LabelInput>
          <Input
            placeholder="Motivo de cancelamento"
            value={nameReasons}
            onChange={(event) => setNameReasons(event.target.value)}
            id="reason-cancellation"
          />
        </ContentInput>
        <ContentInput>
          <LabelInput htmlFor="type-reason-cancellation">
            Para quem será mostrado?
          </LabelInput>
          <Select
            id="type-reason-cancellation"
            style={{ width: "100%" }}
            value={typeReasonsCancellation}
            onChange={(value) => setTypeReasonsCancellation(value)}
            options={[
              {
                value: "1",
                label: "Motorista",
              },
              {
                value: "2",
                label: "Cliente",
              },
            ]}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Switch
              checked={reports}
              onChange={(e) => handleChange(e)}
              value={reports}
              disabled={typeReasonsCancellation == Constants.driver}
            />
            <span style={{ marginLeft: 10 }}>Relatos da viagem</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Switch
              checked={monetized}
              onChange={(e) => setMonetized(e)}
              disabled={typeReasonsCancellation == Constants.driver || !reports}
            />
            <span style={{ marginLeft: 10 }}>Monetizado</span>
          </div>
        </ContentInput>
      </Container>
    </Modal>
  );
};
