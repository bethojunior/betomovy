import { Tag } from "antd";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendente", color: "gold" },
  approved: { label: "Aprovado", color: "green" },
  rejected: { label: "Rejeitado", color: "red" },
};

type WithdrawStatusTagProps = {
  status: string;
};

export function WithdrawStatusTag({ status }: WithdrawStatusTagProps) {
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
