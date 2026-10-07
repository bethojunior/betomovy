import { useState } from "react";
import { Card, Typography, Divider } from "antd";
import { Withdraw } from "./Withdraw";
import { WithdrawRequest } from "./WithdrawRequest";

type MyWithdrawsProps = {
  balance?: number;
};

export function MyWithdraws({ balance = 0 }: MyWithdrawsProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Card
      style={{
        width: "60%",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
      bodyStyle={{ padding: 0 }}
    >
      {/* Header */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "0 16px",
        }}
      >
        <Typography.Title level={4} style={{ margin: 0, flex: 1 }}>
          Meus Saques
        </Typography.Title>
      </div>

      {/* Withdraw form/section */}
      <div style={{ padding: 16 }}>
        <Withdraw
          theme="light"
          balance={balance}
          onCreated={() => setRefreshKey((prev) => prev + 1)}
        />
      </div>

      <Divider style={{ margin: 0 }} />

      {/* History */}
      <div >
        <WithdrawRequest
          style={{borderRadius: 0, border: 0,  boxShadow: "0 0 0 rgba(0,0,0,0.08)", }}
          title="Histórico Recente"
          listMaxHeight={220}
          refreshKey={refreshKey}
        />
      </div>
    </Card>
  );
}
