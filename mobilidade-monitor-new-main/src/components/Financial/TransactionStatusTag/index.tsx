import { Tag } from "antd";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  paid: { label: "Pago", color: "green" },
  pending: { label: "Pendente", color: "gold" },
  cancelled: { label: "Cancelado", color: "red" },
  refunded: { label: "Reembolsado", color: "blue" },
  denied: { label: "Negado", color: "default" },
};

type TransactionStatusTagProps = {
  status: string;
};

export function TransactionStatusTag({ status }: TransactionStatusTagProps) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return <Tag>{status}</Tag>;
  }

  return (
    <Tag
      color={config.color}
      style={{
        padding: "2px 8px",
        fontSize: 13,
        lineHeight: "20px",
        borderRadius: 4,
      }}
    >
      {config.label}
    </Tag>
  );
}
