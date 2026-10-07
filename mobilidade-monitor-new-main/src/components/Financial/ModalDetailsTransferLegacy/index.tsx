import { Button, Descriptions, Modal, Tag } from "antd";
import { FinancialProps } from "../../../pages/Financial/TransferRequests/types";

const STATUS_LABEL: Record<string, string> = {
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Rejeitado",
};

const STATUS_COLOR: Record<string, string> = {
    pending: "gold",
    approved: "green",
    rejected: "red",
};

const getStatus = (item: FinancialProps) => {
    if (item.recused === 1) return "rejected";
    if (item.paid === 1) return "approved";
    return "pending";
};

const formatDateTime = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export type ModalDetailsTransferLegacyProps = {
    open: boolean;
    item: FinancialProps | null;
    actionLoading?: boolean;
    onClose: () => void;
    onApprove?: () => void;
    onReject?: () => void;
};

export function ModalDetailsTransferLegacy({
    open,
    item,
    actionLoading = false,
    onClose,
    onApprove,
    onReject,
}: ModalDetailsTransferLegacyProps) {
    if (!item) return null;

    const status = getStatus(item);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title="Detalhes da solicitação"
            width={760}
            footer={
                status !== "pending" ? null : (
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Button
                            danger
                            loading={actionLoading}
                            onClick={onReject}
                        >
                            Rejeitar
                        </Button>
                        <Button
                            type="primary"
                            loading={actionLoading}
                            onClick={onApprove}
                        >
                            Aprovar
                        </Button>
                    </div>
                )
            }
        >
            <div style={{ display: "flex", gap: 24 }}>
                {/* Dados bancários — string separada por vírgulas, cada parte "Label: Valor" */}
                {item.bankAccountToPay && (
                    <Descriptions
                        column={1}
                        bordered
                        size="small"
                        style={{ flex: 1 }}
                    >
                        {item.bankAccountToPay.split(",").map((entry, i) => {
                            const [label, ...rest] = entry.trim().split(":");
                            return (
                                <Descriptions.Item
                                    key={i}
                                    label={label?.trim()}
                                >
                                    {rest.join(":").trim() || "-"}
                                </Descriptions.Item>
                            );
                        })}
                    </Descriptions>
                )}

                {/* Informações da solicitação */}
                <Descriptions
                    column={1}
                    bordered
                    size="small"
                    style={{ flex: 1 }}
                >
                    <Descriptions.Item label="Data Solicitação">
                        {formatDateTime(item.created_at)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Contato">
                        {item.phone || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={STATUS_COLOR[status]}>
                            {STATUS_LABEL[status]}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Valor">
                        {item.value.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </Descriptions.Item>
                    <Descriptions.Item label="Chave PIX">
                        {item.pix || "-"}
                    </Descriptions.Item>

                    {item.recused !== 1 && (
                        <>
                            <Descriptions.Item label="Pago por">
                                {item.paidByUserName || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Confirmada em">
                                {formatDateTime(item.paymentDate)}
                            </Descriptions.Item>
                        </>
                    )}

                    {item.recused === 1 && (
                        <>
                            <Descriptions.Item label="Recusado por">
                                {item.recusedByUserName || "-"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Recusada em">
                                {formatDateTime(item.refusalDate)}
                            </Descriptions.Item>
                        </>
                    )}
                </Descriptions>
            </div>
        </Modal>
    );
}
