import { Button, Modal } from "antd";

import { Container, LabelText, ContentInformations } from "./styles";
import { ModalDetailsTransferProps } from "./types";
import {
  formatDateTime,
  getBankAccountLines,
  getWithdrawStatus,
} from "./helpers";

const STATUS_LABEL = {
  pending: "Pendente",
  approved: "Confirmado",
  rejected: "Recusado",
};

export const ModalDetailsTransfer = ({
  setVisible,
  visible,
  datasTransfer,
}: ModalDetailsTransferProps) => {
  if (!datasTransfer) {
    return (
      <Modal
        width={700}
        title="Solicitações de Motoristas"
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setVisible(false)}>
            Fechar
          </Button>,
        ]}
      />
    );
  }

  const status = getWithdrawStatus(datasTransfer);
  const bankAccountLines = getBankAccountLines(datasTransfer.bankAccountToPay);

  return (
    <Modal
      width={700}
      title={`Solicitações de Motoristas - ${datasTransfer.name}`}
      open={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button key="close" type="primary" onClick={() => setVisible(false)}>
          Fechar
        </Button>,
      ]}
    >
      <Container>
        <div>
          {bankAccountLines.length > 0 ? (
            bankAccountLines.map((line, index) => (
              <ContentInformations key={index}>{line}</ContentInformations>
            ))
          ) : (
            <ContentInformations>
              Conta bancária não informada
            </ContentInformations>
          )}
        </div>

        <div>
          <ContentInformations>
            <LabelText>Data Solicitação: </LabelText>
            <span>{formatDateTime(datasTransfer.created_at)}</span>
          </ContentInformations>
          <ContentInformations>
            <LabelText>Contato: </LabelText>
            <span>{datasTransfer.phone}</span>
          </ContentInformations>
          <ContentInformations>
            <LabelText>Status: </LabelText>
            <span>{STATUS_LABEL[status]}</span>
          </ContentInformations>
          <ContentInformations>
            <LabelText>Valor: </LabelText>
            <span>
              {datasTransfer.value.toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </ContentInformations>
          <ContentInformations>
            <LabelText>Chave PIX: </LabelText>
            <span>{datasTransfer.pix || "-"}</span>
          </ContentInformations>

          {status === "approved" && (
            <>
              <ContentInformations>
                <LabelText>Pago por: </LabelText>
                <span>{datasTransfer.paidByUserName || "-"}</span>
              </ContentInformations>
              <ContentInformations>
                <LabelText>Confirmada em: </LabelText>
                <span>{formatDateTime(datasTransfer.paymentDate)}</span>
              </ContentInformations>
            </>
          )}

          {status === "rejected" && (
            <>
              <ContentInformations>
                <LabelText>Recusado por: </LabelText>
                <span>{datasTransfer.recusedByUserName || "-"}</span>
              </ContentInformations>
              <ContentInformations>
                <LabelText>Recusada em: </LabelText>
                <span>{formatDateTime(datasTransfer.refusalDate)}</span>
              </ContentInformations>
            </>
          )}
        </div>
      </Container>
    </Modal>
  );
};
