import { useEffect, useMemo, useState } from "react";
import { Button, Card, Descriptions, Input, Modal, Select, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import * as XLSX from "xlsx";
import {
  useFinancial,
  type GlobalTransactionListItem,
  type WithdrawalListItem,
} from "../../../../hooks/useFinancial";

type ReportItemType = "transaction" | "withdrawal";

type UnifiedReportItem = {
  key: string;
  type: ReportItemType;
  created_at: string;
  amount: number;
  status: string;
  description: string;
  method: string;
  raw: GlobalTransactionListItem | WithdrawalListItem;
};

const PAGE_SIZE = 8;
const API_PAGE_SIZE = 100;

const transactionStatusLabel: Record<string, string> = {
  paid: "Pago",
  pending: "Pendente",
  failed: "Falhou",
  canceled: "Cancelado",
};

const withdrawalStatusLabel: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

const paymentMethodLabel: Record<string, string> = {
  card: "Cartão",
  pix: "PIX",
  cash: "Dinheiro",
};

const withdrawalTypeLabel: Record<string, string> = {
  manager: "Gestor",
  driver: "Motorista",
  customer: "Cliente",
};

const typeLabel: Record<ReportItemType, string> = {
  transaction: "Transferência",
  withdrawal: "Saque",
};

const statusColor = (status: string) => {
  if (status === "paid" || status === "approved") return "green";
  if (status === "pending") return "gold";
  return "red";
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

const formatCurrency = (value: number | string) => {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const getStatusLabel = (item: UnifiedReportItem) => {
  if (item.type === "transaction") {
    return transactionStatusLabel[item.status] || item.status;
  }
  return withdrawalStatusLabel[item.status] || item.status;
};

const formatDateTimeExport = (date?: string) => {
  if (!date) return "";
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const FinancialReportsOverview = () => {
  const { globalTransactions, listProjectWithdrawals } = useFinancial();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<UnifiedReportItem[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ReportItemType | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string | undefined>();
  const [withdrawalTypeFilter, setWithdrawalTypeFilter] = useState<string | undefined>();
  const [selectedItem, setSelectedItem] = useState<UnifiedReportItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const transactions: GlobalTransactionListItem[] = [];
        const withdrawals: WithdrawalListItem[] = [];

        let transactionPage = 1;
        let hasMoreTransactions = true;
        while (hasMoreTransactions) {
          const response = await globalTransactions.listProject({
            page: transactionPage,
            per_page: API_PAGE_SIZE,
          });

          const data = response.response?.data ?? [];
          transactions.push(...data);

          if (!data.length) {
            hasMoreTransactions = false;
            break;
          }
          if (response.response?.last_page && transactionPage >= response.response.last_page) {
            hasMoreTransactions = false;
            break;
          }
          transactionPage += 1;
        }

        let withdrawalPage = 1;
        let hasMoreWithdrawals = true;
        while (hasMoreWithdrawals) {
          const response = await listProjectWithdrawals({
            page: withdrawalPage,
            per_page: API_PAGE_SIZE,
          });

          const data = response.response?.data ?? [];
          withdrawals.push(...data);

          if (!data.length) {
            hasMoreWithdrawals = false;
            break;
          }
          if (response.response?.last_page && withdrawalPage >= response.response.last_page) {
            hasMoreWithdrawals = false;
            break;
          }
          withdrawalPage += 1;
        }

        const unifiedTransactions: UnifiedReportItem[] = transactions.map((tx) => ({
          key: `tx-${tx.id}`,
          type: "transaction",
          created_at: tx.created_at,
          amount: Number(tx.amount || 0),
          status: tx.status,
          description: tx.customer
            ? `${tx.customer.name} (${tx.customer.project_name})`
            : `Transação #${tx.id}`,
          method: paymentMethodLabel[tx.payment_method] || tx.payment_method,
          raw: tx,
        }));

        const unifiedWithdrawals: UnifiedReportItem[] = withdrawals.map((wd) => ({
          key: `wd-${wd.id}`,
          type: "withdrawal",
          created_at: wd.created_at,
          amount: Number(wd.amount || 0),
          status: wd.status,
          description: wd.recipient_name || `Saque #${wd.id}`,
          method: withdrawalTypeLabel[wd.type] || wd.type,
          raw: wd,
        }));

        const sorted = [...unifiedTransactions, ...unifiedWithdrawals].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setItems(sorted);
      } catch (error) {
        console.error("Erro ao carregar overview financeiro:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      if (typeFilter && item.type !== typeFilter) return false;
      if (statusFilter && item.status !== statusFilter) return false;

      if (item.type === "transaction") {
        const tx = item.raw as GlobalTransactionListItem;
        if (paymentMethodFilter && tx.payment_method !== paymentMethodFilter) return false;
      }

      if (item.type === "withdrawal") {
        const wd = item.raw as WithdrawalListItem;
        if (withdrawalTypeFilter && wd.type !== withdrawalTypeFilter) return false;
      }

      if (!normalizedSearch) return true;

      const searchable =
        item.type === "transaction"
          ? [
              item.description,
              item.method,
              (item.raw as GlobalTransactionListItem).external_id,
              (item.raw as GlobalTransactionListItem).acquirer?.name,
            ]
          : [
              item.description,
              item.method,
              (item.raw as WithdrawalListItem).recipient_document,
              (item.raw as WithdrawalListItem).recipient_phone,
              (item.raw as WithdrawalListItem).external_id,
            ];

      return searchable
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [
    items,
    paymentMethodFilter,
    search,
    statusFilter,
    typeFilter,
    withdrawalTypeFilter,
  ]);

  const statusOptions = useMemo(() => {
    const statuses = Array.from(new Set(items.map((item) => item.status)));
    return statuses.map((status) => ({
      value: status,
      label:
        transactionStatusLabel[status] ||
        withdrawalStatusLabel[status] ||
        status,
    }));
  }, [items]);

  const columns: ColumnsType<UnifiedReportItem> = [
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      render: (value: ReportItemType) => (
        <Tag color={value === "transaction" ? "blue" : "purple"} style={{ margin: 0 }}>
          {typeLabel[value]}
        </Tag>
      ),
    },
    {
      title: "Data",
      dataIndex: "created_at",
      key: "created_at",
      render: (value: string) => (
        <Typography.Text type="secondary">{formatDateTime(value)}</Typography.Text>
      ),
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Método",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "Valor",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => <Typography.Text strong>{formatCurrency(value)}</Typography.Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_: string, item) => (
        <Tag color={statusColor(item.status)} style={{ margin: 0 }}>
          {getStatusLabel(item)}
        </Tag>
      ),
    },
    {
      title: "Ações",
      key: "actions",
      align: "center",
      render: (_, item) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedItem(item);
            setIsDetailsOpen(true);
          }}
        >
          Ver detalhes
        </Button>
      ),
    },
  ];

  const handleExportExcel = () => {
    if (!filteredItems.length) {
      return;
    }

    const rows = filteredItems.map((item) => {
      if (item.type === "transaction") {
        const tx = item.raw as GlobalTransactionListItem;
        return {
          Tipo: typeLabel[item.type],
          Data: formatDateTimeExport(item.created_at),
          Descricao: item.description,
          Metodo: item.method,
          Valor: Number(item.amount || 0),
          Status: getStatusLabel(item),
          Adquirente: tx.acquirer?.name || "-",
          IdExterno: tx.external_id || "-",
        };
      }

      const wd = item.raw as WithdrawalListItem;
      return {
        Tipo: typeLabel[item.type],
        Data: formatDateTimeExport(item.created_at),
        Descricao: item.description,
        Metodo: item.method,
        Valor: Number(item.amount || 0),
        Status: getStatusLabel(item),
        Adquirente: "-",
        IdExterno: wd.external_id || "-",
      };
    });

    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Relatorio");
    XLSX.writeFile(workbook, "relatorio-dashboard-adquirente.xls", {
      bookType: "biff8",
    });
  };

  return (
    <Card
      style={{
        width: "100%",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Overview Financeiro (Transferências e Saques)
      </Typography.Title>

      <Space wrap size={8} style={{ width: "100%", marginBottom: 12 }}>
        <Input
          allowClear
          placeholder="Buscar por cliente, destinatário, doc, telefone..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ width: 360 }}
        />
        <Select
          allowClear
          placeholder="Tipo"
          value={typeFilter}
          onChange={(value) => setTypeFilter(value)}
          style={{ width: 160 }}
          options={[
            { value: "transaction", label: "Transferência" },
            { value: "withdrawal", label: "Saque" },
          ]}
        />
        <Select
          allowClear
          placeholder="Status"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          style={{ width: 160 }}
          options={statusOptions}
        />
        <Select
          allowClear
          placeholder="Pagamento (transferência)"
          value={paymentMethodFilter}
          onChange={(value) => setPaymentMethodFilter(value)}
          style={{ width: 220 }}
          options={Object.entries(paymentMethodLabel).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <Select
          allowClear
          placeholder="Tipo (saque)"
          value={withdrawalTypeFilter}
          onChange={(value) => setWithdrawalTypeFilter(value)}
          style={{ width: 180 }}
          options={Object.entries(withdrawalTypeLabel).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <Button
          onClick={() => {
            setSearch("");
            setTypeFilter(undefined);
            setStatusFilter(undefined);
            setPaymentMethodFilter(undefined);
            setWithdrawalTypeFilter(undefined);
          }}
        >
          Limpar filtros
        </Button>
        <Button type="primary" onClick={handleExportExcel} disabled={!filteredItems.length}>
          Exportar Excel
        </Button>
      </Space>

      <Table<UnifiedReportItem>
        rowKey="key"
        columns={columns}
        dataSource={filteredItems}
        loading={loading}
        pagination={{
          pageSize: PAGE_SIZE,
          showSizeChanger: false,
        }}
      />

      <Modal
        open={isDetailsOpen}
        onCancel={() => setIsDetailsOpen(false)}
        title={
          selectedItem?.type === "transaction"
            ? "Detalhes da transferência"
            : "Detalhes do saque"
        }
        footer={[
          <Button key="close" onClick={() => setIsDetailsOpen(false)}>
            Fechar
          </Button>,
        ]}
        width={760}
      >
        {selectedItem?.type === "transaction" && (
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Tipo">Transferência</Descriptions.Item>
            <Descriptions.Item label="ID">
              {(selectedItem.raw as GlobalTransactionListItem).id}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {getStatusLabel(selectedItem)}
            </Descriptions.Item>
            <Descriptions.Item label="Data">
              {formatDateTime((selectedItem.raw as GlobalTransactionListItem).created_at)}
            </Descriptions.Item>
            <Descriptions.Item label="Valor">
              {formatCurrency((selectedItem.raw as GlobalTransactionListItem).amount)}
            </Descriptions.Item>
            <Descriptions.Item label="Pagamento">
              {paymentMethodLabel[(selectedItem.raw as GlobalTransactionListItem).payment_method] ||
                (selectedItem.raw as GlobalTransactionListItem).payment_method}
            </Descriptions.Item>
            <Descriptions.Item label="Adquirente" span={2}>
              {(selectedItem.raw as GlobalTransactionListItem).acquirer?.name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Cliente" span={2}>
              {(selectedItem.raw as GlobalTransactionListItem).customer
                ? `${(selectedItem.raw as GlobalTransactionListItem).customer?.name} (${(selectedItem.raw as GlobalTransactionListItem).customer?.project_name})`
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        )}

        {selectedItem?.type === "withdrawal" && (
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Tipo">Saque</Descriptions.Item>
            <Descriptions.Item label="ID">
              {(selectedItem.raw as WithdrawalListItem).id}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {getStatusLabel(selectedItem)}
            </Descriptions.Item>
            <Descriptions.Item label="Data">
              {formatDateTime((selectedItem.raw as WithdrawalListItem).created_at)}
            </Descriptions.Item>
            <Descriptions.Item label="Valor">
              {formatCurrency((selectedItem.raw as WithdrawalListItem).amount)}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo de saque">
              {withdrawalTypeLabel[(selectedItem.raw as WithdrawalListItem).type] ||
                (selectedItem.raw as WithdrawalListItem).type}
            </Descriptions.Item>
            <Descriptions.Item label="Destinatário">
              {(selectedItem.raw as WithdrawalListItem).recipient_name}
            </Descriptions.Item>
            <Descriptions.Item label="Telefone">
              {(selectedItem.raw as WithdrawalListItem).recipient_phone}
            </Descriptions.Item>
            <Descriptions.Item label="Documento">
              {(selectedItem.raw as WithdrawalListItem).recipient_document}
            </Descriptions.Item>
            <Descriptions.Item label="Chave PIX">
              {(selectedItem.raw as WithdrawalListItem).pix_key || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Conta bancária">
              {(selectedItem.raw as WithdrawalListItem).bank_account || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Cliente" span={2}>
              {(selectedItem.raw as WithdrawalListItem).customer
                ? `${(selectedItem.raw as WithdrawalListItem).customer?.name} (${(selectedItem.raw as WithdrawalListItem).customer?.project_name})`
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
};
