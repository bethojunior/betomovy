import { Card, Typography } from "antd";
import type { ComponentType } from "react";

const { Text } = Typography;

type CardComponentProps = {
  title: string;
  value: string;
  variation?: string;
  icon?: ComponentType<{ className?: string }>;
  variationColor?: string;
  loading?: boolean;
};

export function CardComponent({
  title,
  value,
  icon: Icon,
  variation,
  variationColor,
  loading,
}: CardComponentProps) {
  return (
    <Card
      loading={loading}
      style={{
        width: "100%",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
      bodyStyle={{
        padding: 24,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Text
          style={{
            flex: 1,
            fontSize: 14,
            color: "rgba(0,0,0,0.45)",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {title}
        </Text>

        {Icon && (
          <div
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "#fafafa",
            }}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 600 }}>
          {value}
        </div>

        <div style={{ marginTop: 6, minHeight: 22 }}>
          {variation ? (
            <Text style={{ color: variationColor || "rgba(0,0,0,0.45)" }}>
              {variation}
            </Text>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
