import { useState, useEffect } from "react";
import { Avatar, Button, Card, List, Typography, message } from "antd";
import { WithdrawStatusTag } from "../../../../components/Financial/WithdrawStatusTag";

import { UserOutlined } from "@ant-design/icons";
import { useFinancial } from "../../../../hooks/useFinancial";
import { FinancialProps } from "../../TransferRequests/types";
import { ModalDetailsTransferLegacy } from "../../../../components/Financial/ModalDetailsTransferLegacy";

const getStatus = (item: FinancialProps): string => {
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

type WithdrawListItemProps = {
    item: FinancialProps;
    onViewDetails: (item: FinancialProps) => void;
};

function WithdrawListItem({ item, onViewDetails }: WithdrawListItemProps) {
    const status = getStatus(item);

    return (
        <List.Item
            style={{ padding: "12px 16px" }}
            actions={[
                <div
                    key="actions"
                    style={{ textAlign: "right", minWidth: 120 }}
                >
                    <Typography.Text strong style={{ fontSize: 16 }}>
                        {item.value.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </Typography.Text>
                    <div>
                        <Typography.Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                        >
                            {formatDateTime(item.created_at)}
                        </Typography.Text>
                    </div>
                    <Button
                        style={{ marginTop: 8, width: "100%" }}
                        onClick={() => onViewDetails(item)}
                    >
                        Ver detalhes
                    </Button>
                </div>,
            ]}
        >
            <List.Item.Meta
                avatar={<Avatar size={48} icon={<UserOutlined />} />}
                title={item.name}
                description={<WithdrawStatusTag status={status} />}
            />
        </List.Item>
    );
}

export function WithdrawRequestLegacy() {
    const {
        listLegacyWithdrawals,
        approveLegacyWithdrawal,
        rejectLegacyWithdrawal,
    } = useFinancial();

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [withdrawals, setWithdrawals] = useState<FinancialProps[]>([]);
    const [selectedWithdrawal, setSelectedWithdrawal] =
        useState<FinancialProps | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const fetchLegacyWithdrawals = async () => {
        setLoading(true);
        try {
            const response = await listLegacyWithdrawals({
                page: 1,
                paid: 0,
                recused: 0,
            } as any);
            setWithdrawals(response.data);
        } catch (error) {
            console.error(
                "Erro ao carregar solicitações de saque legado",
                error,
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLegacyWithdrawals();
    }, []);

    const handleOpenDetails = (item: FinancialProps) => {
        setSelectedWithdrawal(item);
        setIsDetailsModalOpen(true);
    };

    const handleApprove = async () => {
        if (!selectedWithdrawal) return;

        setActionLoading(true);
        try {
            const response = await approveLegacyWithdrawal(
                selectedWithdrawal.idWithdraw,
            );
            if (!response) {
                message.error("Falha na solicitação de aprovar.");
                return;
            }

            message.success("Solicitação aprovada com sucesso.");
            setIsDetailsModalOpen(false);

            await fetchLegacyWithdrawals();
        } catch (error) {
            console.error("Erro ao aprovar solicitação:", error);
            message.error("Erro ao aprovar solicitação.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedWithdrawal) return;

        setActionLoading(true);
        try {
            const response = await rejectLegacyWithdrawal(
                selectedWithdrawal.idWithdraw,
            );

            if (!response) {
                message.error("Falha na solicitação de rejeitar.");
                return;
            }

            message.success("Solicitação rejeitada com sucesso.");
            setIsDetailsModalOpen(false);

            await fetchLegacyWithdrawals();
        } catch (error) {
            console.error("Erro ao rejeitar solicitação:", error);
            message.error("Erro ao rejeitar solicitação.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Card
            title={
                <Typography.Title level={4} style={{ margin: 0, flex: 1 }}>
                    Solicitações de Saque Pendentes
                </Typography.Title>
            }
            style={{
                width: "100%",
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
            }}
            bodyStyle={{
                padding: 0,
                paddingLeft: 0,
                paddingRight: 0,
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
            }}
        >
            <div
                style={{
                    maxHeight: 420,
                    overflowY: "scroll",
                    minHeight: 0,
                    scrollbarColor: "#bcbcbc transparent",
                }}
            >
                {withdrawals.length === 0 ? (
                    <div style={{ padding: 16 }}>
                        <Typography.Text type="secondary">
                            Nenhuma solicitação no momento.
                        </Typography.Text>
                    </div>
                ) : (
                    <List
                        loading={loading}
                        itemLayout="horizontal"
                        dataSource={withdrawals}
                        renderItem={(item) => (
                            <WithdrawListItem
                                item={item}
                                onViewDetails={handleOpenDetails}
                            />
                        )}
                    />
                )}
            </div>

            <ModalDetailsTransferLegacy
                open={isDetailsModalOpen}
                item={selectedWithdrawal}
                actionLoading={actionLoading}
                onClose={() => setIsDetailsModalOpen(false)}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </Card>
    );
}
