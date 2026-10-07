import { Button, Descriptions, Modal, Typography } from "antd";
import type { GlobalTransactionListItem } from "../../../hooks/useFinancial";
import { PaymentMethodTag } from "../PaymentMethodTag";
import { TransactionStatusTag } from "../TransactionStatusTag";
import { formatTransactionFee } from "../../../utils/financial";
import { DescriptionsItemProps } from "antd/es/descriptions/Item";

const DescItem = (props: DescriptionsItemProps) => (
    <Descriptions.Item {...props} />
);

const LABEL_STYLE = { width: "20%" };

const formatCurrency = (value?: string | number) => {
    if (value == null) return "-";
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
};

const formatDateTime = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export type ModalDetailsTransactionProps = {
    open: boolean;
    item: GlobalTransactionListItem | null;
    onClose: () => void;
};

export function ModalDetailsTransaction({
    open,
    item,
    onClose,
}: ModalDetailsTransactionProps) {
    if (!item) return null;

    const fee = formatTransactionFee(item.fee_percentage, item.fixed_fee);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title="Detalhes da transação"
            width={"70vw"}
            footer={<Button onClick={onClose}>Fechar</Button>}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    padding: "8px 0",
                }}
            >
                {/* Status + valor em destaque */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <TransactionStatusTag status={item.status} />
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        {formatCurrency(item.amount)}
                    </Typography.Title>
                </div>

                {/* Detalhes da transação */}
                <Descriptions
                    bordered
                    size="small"
                    column={2}
                    title="Transação"
                    styles={{ label: LABEL_STYLE }}
                >
                    <DescItem label="ID" span={1}>
                        {item.id}
                    </DescItem>
                    <DescItem label="Criado em" span={1}>
                        {formatDateTime(item.created_at)}
                    </DescItem>
                    <DescItem label="Pagamento" span={1}>
                        <PaymentMethodTag method={item.payment_method} />
                    </DescItem>
                    {item.external_id && (
                        <DescItem label="ID externo" span={1}>
                            <Typography.Text copyable>
                                {item.external_id}
                            </Typography.Text>
                        </DescItem>
                    )}
                </Descriptions>

                {/* Taxas — só exibe a seção se houver ao menos uma taxa */}
                {fee && (
                    <Descriptions
                        bordered
                        size="small"
                        title="Taxas"
                        styles={{ label: LABEL_STYLE }}
                    >
                        <DescItem label="Taxa" span={1}>
                            {fee || "-"}
                        </DescItem>
                    </Descriptions>
                )}

                {/* Cliente */}
                <Descriptions
                    bordered
                    size="small"
                    column={2}
                    title="Cliente"
                    styles={{ label: LABEL_STYLE }}
                >
                    <DescItem label="Nome" span={1}>
                        {item.payer_name || "-"}
                    </DescItem>
                    <DescItem label="Email" span={1}>
                        {item.payer_email || "-"}
                    </DescItem>
                    <DescItem label="Documento" span={1}>
                        {item.payer_document || "-"}
                    </DescItem>
                </Descriptions>
            </div>
        </Modal>
    );
}
