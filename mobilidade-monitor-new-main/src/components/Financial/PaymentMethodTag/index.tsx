import { Tag } from "antd";
import Icon from "@ant-design/icons";
import { MdPix, MdCreditCard } from "react-icons/md";

const METHOD_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pix: {
    label: "PIX",
    icon: <Icon component={MdPix} />,
    color: "cyan",
  },
  card: {
    label: "Cartão",
    icon: <Icon component={MdCreditCard} />,
    color: "blue",
  },
};

type PaymentMethodTagProps = {
  method: string;
};

export function PaymentMethodTag({ method }: PaymentMethodTagProps) {
  const config = METHOD_CONFIG[method];

  if (!config) {
    return <Tag>{method}</Tag>;
  }

  return (
    <Tag
      color={config.color}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px",
        fontSize: 13,
        lineHeight: "20px",
        borderRadius: 4,
      }}
    >
      <span style={{ display: "flex", alignItems: "center", fontSize: 15 }}>
        {config.icon}
      </span>
      {config.label}
    </Tag>
  );
}
