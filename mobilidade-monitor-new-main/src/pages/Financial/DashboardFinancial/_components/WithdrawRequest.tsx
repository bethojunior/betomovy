import { useState, useEffect, type CSSProperties } from "react";
import { Card, List, Space, Tag, Typography } from "antd";
import { WithdrawStatusTag } from "../../../../components/Financial/WithdrawStatusTag";
import {
    useFinancial,
    type WithdrawalListItem,
} from "../../../../hooks/useFinancial";

export type WithdrawRequestItem = WithdrawalListItem;

type WithdrawRequestProps = {
    title?: string;
    statusFilter?: WithdrawRequestItem["status"][];
    fillHeight?: boolean;
    listMaxHeight?: number;
    style?: CSSProperties;
    refreshKey?: number;
    onViewDetails?: (item: WithdrawRequestItem) => void;
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

type WithdrawListItemProps = {
    item: WithdrawRequestItem;
    onViewDetails?: (item: WithdrawRequestItem) => void;
};

function WithdrawListItem({ item }: WithdrawListItemProps) {
    return (
        <List.Item style={{ padding: "10px 16px" }}>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography.Text strong style={{ fontSize: 14, flex: "0 0 auto" }}>
                    R$ {item.amount}
                </Typography.Text>
                <WithdrawStatusTag status={item.status} />
                <Typography.Text type="secondary" style={{ fontSize: 12, flex: "0 0 auto" }}>
                    {formatDateTime(
                        item.status === "pending"
                            ? item.created_at
                            : item.updated_at,
                    )}
                </Typography.Text>
            </div>
        </List.Item>
    );
}

export function WithdrawRequest({
    title,
    statusFilter,
    fillHeight = false,
    listMaxHeight = 420,
    style,
    refreshKey,
    onViewDetails,
}: WithdrawRequestProps) {
    const { listProjectWithdrawals } = useFinancial();

    const [loading, setLoading] = useState(false);
    const [withdrawals, setWithdrawals] = useState<WithdrawRequestItem[]>([]);

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const response = await listProjectWithdrawals();
            setWithdrawals(response.response?.data ?? []);
        } catch (error) {
            console.error("Erro ao carregar solicitações de saque:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, [refreshKey]);

    const sortedWithdrawals = withdrawals.sort((a, b) => {
        const dateA =
            a.status === "pending"
                ? new Date(a.created_at).getTime()
                : new Date(a.updated_at).getTime();
        const dateB =
            b.status === "pending"
                ? new Date(b.created_at).getTime()
                : new Date(b.updated_at).getTime();
        return dateB - dateA;
    });

    const pendingCount = sortedWithdrawals.filter(
        (i) => i.status === "pending",
    ).length;

    const isPendingOnlyFilter =
        statusFilter?.length === 1 && statusFilter[0] === "pending";

    const summaryText = isPendingOnlyFilter
        ? `${pendingCount} Pendentes`
        : `${sortedWithdrawals.length} Registros`;

    return (
        <Card
            style={{
                width: "100%",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                height: fillHeight ? "100%" : undefined,
                display: "flex",
                flexDirection: "column",
                ...style,
            }}
            bodyStyle={{
                padding: 8,
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
            }}
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Typography.Text strong style={{ fontSize: 18, flex: 1 }}>
                        {title}
                    </Typography.Text>
                    <Space size={8}>
                        <Tag style={{ margin: 0 }} color="default">
                            {summaryText}
                        </Tag>
                    </Space>
                </div>
            }
        >
            <div
                style={{
                    maxHeight: fillHeight ? "none" : listMaxHeight,
                    overflowY: "auto",
                    flex: fillHeight ? 1 : undefined,
                    minHeight: 0,
                }}
            >
                {sortedWithdrawals.length === 0 ? (
                    <div style={{ padding: 16 }}>
                        <Typography.Text type="secondary">
                            Nenhuma solicitação no momento.
                        </Typography.Text>
                    </div>
                ) : (
                    <List
                        loading={loading}
                        itemLayout="horizontal"
                        dataSource={sortedWithdrawals}
                        renderItem={(item) => (
                            <WithdrawListItem
                                item={item}
                                onViewDetails={onViewDetails}
                            />
                        )}
                    />
                )}
            </div>
        </Card>
    );
}
