import { useEffect, useMemo, useState } from "react";
import { Button, Card, Input, Select, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import {
  useFinancial,
  type GlobalTransactionListItem,
} from "../../../../hooks/useFinancial";
import { formatTransactionFee } from "../../../../utils/financial";
import { PaymentMethodTag } from "../../../../components/Financial/PaymentMethodTag";
import { TransactionStatusTag } from "../../../../components/Financial/TransactionStatusTag";
import { ModalDetailsTransaction } from "../../../../components/Financial/ModalDetailsTransaction";
import { PayerInfo } from "../../../../components/Financial/PayerInfo";
import CurrencyUtils from "@/utils/currency/currency";




const PAGE_SIZE = 10;
const API_PAGE_SIZE = 100;

type TransactionsHistoryProps = {
  showFilters?: boolean;
};

export const TransactionsHistory = ({
  showFilters = false,
}: TransactionsHistoryProps) => {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<GlobalTransactionListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string | undefined>();
  const [acquirerFilter, setAcquirerFilter] = useState<string | undefined>();
  const [selectedTransaction, setSelectedTransaction] =
    useState<GlobalTransactionListItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { globalTransactions } = useFinancial();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        let currentPage = 1;
        let totalItems = 0;
        const allTransactions: GlobalTransactionListItem[] = [];

        do {
          const response = await globalTransactions.listProject({
            page: currentPage,
            per_page: API_PAGE_SIZE,
          });

          const pageData = response.response?.data ?? [];
          totalItems = response.response?.total ?? totalItems;
          allTransactions.push(...pageData);

          if (!pageData.length) break;

          const lastPage = response.response?.last_page;
          if (lastPage && currentPage >= lastPage) break;
          if (totalItems > 0 && allTransactions.length >= totalItems) break;

          currentPage += 1;
        } while (true);

        const list = allTransactions.slice().sort((a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });

        setItems(list);
        setTotal(totalItems || list.length);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, paymentMethodFilter, acquirerFilter]);

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

  const openDetails = (tx: GlobalTransactionListItem) => {
    setSelectedTransaction(tx);
    setIsDetailsOpen(true);
  };

  const columns: ColumnsType<GlobalTransactionListItem> = useMemo(
    () => [
      {
        title: "Data",
        dataIndex: "created_at",
        key: "created_at",
        width: "17%",
        render: (v: string) => (
          <Typography.Text type="secondary">{formatDateTime(v)}</Typography.Text>
        ),
      },
      // {
      //   title: "Adquirente",
      //   dataIndex: ["acquirer", "name"],
      //   key: "acquirer",
      //   render: (_: string, tx) => tx.acquirer?.name || "-",
      // },
      {
        title: "Pagamento",
        dataIndex: "payment_method",
        key: "payment_method",
        width: "11%",
        render: (v: string) => <PaymentMethodTag method={v} />,
      },
      {
        title: "Cliente",
        key: "payer",
        width: "20%",
        render: (_, tx) => (
          <PayerInfo
            name={tx.payer_name}
            email={tx.payer_email}
            document={tx.payer_document}
          />
        ),
      },
      {
        title: "Valor",
        dataIndex: "amount",
        key: "amount",
        width: "11%",
        render: (v: string) => (
          <Typography.Text strong>
            {CurrencyUtils.formatCurrency(v)}
          </Typography.Text>
        ),
      },
      {
        title: "Taxa",
        key: "fee",
        width: "11%",
        render: (_, tx) => {
          const fee = formatTransactionFee(tx.fee_percentage, tx.fixed_fee);
          return fee || <Typography.Text type="secondary">-</Typography.Text>;
        },
      },
      {
        title: "Valor líquido",
        dataIndex: "liquid_amount",
        key: "liquid_amount",
        width: "11%",
        render: (v: string) => (
          <Typography.Text strong>
            {CurrencyUtils.formatCurrency(v)}
          </Typography.Text>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "11%",
        render: (v: string) => <TransactionStatusTag status={v} />,
      },
      {
        title: "Ações",
        key: "actions",
        align: "center",
        width: "8%",
        render: (_, tx) => (
          <Button
            type="text"
            icon={<EyeOutlined />}
            aria-label={`Ações da transação ${tx.id}`}
            onClick={() => openDetails(tx)}
          />
        ),
      },
    ],
    []
  );

  const acquirerOptions = useMemo(() => {
    const names = Array.from(
      new Set(items.map((tx) => tx.acquirer?.name).filter(Boolean))
    ) as string[];

    return names
      .sort((a, b) => a.localeCompare(b, "pt-BR"))
      .map((name) => ({ label: name, value: name }));
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((tx) => {
      if (statusFilter && tx.status !== statusFilter) return false;
      if (paymentMethodFilter && tx.payment_method !== paymentMethodFilter) return false;
      if (acquirerFilter && tx.acquirer?.name !== acquirerFilter) return false;

      if (!normalizedSearch) return true;

      const haystack = [
        String(tx.id),
        tx.external_id ?? "",
        tx.customer?.name ?? "",
        tx.customer?.project_name ?? "",
        tx.acquirer?.name ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [items, search, statusFilter, paymentMethodFilter, acquirerFilter]);

  useEffect(() => {
    setTotal(filteredItems.length);
  }, [filteredItems.length]);

  return (
    <Card
      style={{
        width: "100%",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Histórico de Transações
        </Typography.Title>
      </div>

      {showFilters && (
        <Space
          wrap
          size={12}
          style={{ width: "100%", marginBottom: 12, justifyContent: "space-between" }}
        >
          <Space wrap size={8}>
            <Input
              allowClear
              placeholder="Buscar por ID, cliente, app ou adquirente"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{ width: 320 }}
            />

            <Select
              allowClear
              placeholder="Status"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              style={{ width: 160 }}
              options={[
                { label: "Pago", value: "paid" },
                { label: "Pendente", value: "pending" },
                { label: "Falhou", value: "failed" },
                { label: "Cancelado", value: "canceled" },
              ]}
            />

            <Select
              allowClear
              placeholder="Pagamento"
              value={paymentMethodFilter}
              onChange={(value) => setPaymentMethodFilter(value)}
              style={{ width: 160 }}
              options={[
                { label: "PIX", value: "pix" },
                { label: "Cartão", value: "card" },
              ].map(({ label, value }) => ({
                label,
                value,
              }))}
            />

            <Select
              allowClear
              placeholder="Adquirente"
              value={acquirerFilter}
              onChange={(value) => setAcquirerFilter(value)}
              style={{ width: 220 }}
              options={acquirerOptions}
            />
          </Space>

          <Button
            onClick={() => {
              setSearch("");
              setStatusFilter(undefined);
              setPaymentMethodFilter(undefined);
              setAcquirerFilter(undefined);
            }}
          >
            Limpar filtros
          </Button>
        </Space>
      )}

      <Table<GlobalTransactionListItem>
        rowKey="id"
        columns={columns}
        dataSource={filteredItems}
        loading={loading}
        scroll={{ y: "50vh" }}
        sticky
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total,
          showSizeChanger: false,
          onChange: (nextPage) => setPage(nextPage),
        }}
      />

      <ModalDetailsTransaction
        open={isDetailsOpen}
        item={selectedTransaction}
        onClose={() => setIsDetailsOpen(false)}
      />
    </Card>
  );
};
