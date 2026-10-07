import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, CardsRow, CardWrapper, WithdrawsRow, HistorySection } from "./styles";
import { CardComponent } from "./_components/CardComponent";
import { MyWithdraws } from "./_components/MyWithdraws";
import { TransactionsHistory } from "./_components/TransactionsHistory";
import { FinancialReportsOverview } from "./_components/FinancialReportsOverview";

import { FaDollarSign, FaRedo } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import CurrencyUtils from "../../../utils/currency/currency";
import {
  useFinancial,
  type FinancialOverviewMetric,
  type FinancialOverviewResponse,
} from "../../../hooks/useFinancial";
import { WithdrawRequestLegacy } from "./_components/WithdrawRequestLegacy";

const emptyMetric: FinancialOverviewMetric = {
  current: 0,
  previous: 0,
  difference: 0,
  percentage: 0,
  trend: "up",
};

const emptyOverview: FinancialOverviewResponse = {
  total_revenue: emptyMetric,
  cancelled_total: emptyMetric,
  refunded_total: emptyMetric,
  wallet_balance: {
    current: 0,
  },
};

const toSafeNumber = (value: unknown) => Number(value ?? 0) || 0;

const normalizeMetric = (metric?: Partial<FinancialOverviewMetric> | null): FinancialOverviewMetric => ({
  current: toSafeNumber(metric?.current),
  previous: toSafeNumber(metric?.previous),
  difference: toSafeNumber(metric?.difference),
  percentage: toSafeNumber(metric?.percentage),
  trend: metric?.trend === "down" ? "down" : "up",
});

const normalizeOverview = (
  data?: Partial<FinancialOverviewResponse> | null
): FinancialOverviewResponse => ({
  total_revenue: normalizeMetric(data?.total_revenue),
  cancelled_total: normalizeMetric(data?.cancelled_total),
  refunded_total: normalizeMetric(data?.refunded_total),
  wallet_balance: {
    current: toSafeNumber(data?.wallet_balance?.current),
  },
});

const getTrendArrow = (trend?: string) => (trend === "down" ? "↓" : "↑");

const getVariationColor = (trend?: string) =>
  trend === "down" ? "#cf1322" : "#389e0d";

const formatVariation = (metric?: FinancialOverviewMetric) => {
  if (!metric) return undefined;

  return `${getTrendArrow(metric.trend)} ${Number(metric.percentage || 0).toLocaleString(
    "pt-BR",
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }
  )}% vs mês anterior`;
};

export function DashboardFinancial() {
  const location = useLocation();
  const { getFinancialOverview } = useFinancial();
  const activeTab = useMemo(
    () => new URLSearchParams(location.search).get("tab"),
    [location.search]
  );
  const [overview, setOverview] = useState<FinancialOverviewResponse>(emptyOverview);
  const [loadingOverview, setLoadingOverview] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoadingOverview(true);
      try {
        const response = await getFinancialOverview();
        setOverview(normalizeOverview(response?.response));
      } catch (error) {
        console.error("Erro ao carregar overview financeiro:", error);
        setOverview(emptyOverview);
      } finally {
        setLoadingOverview(false);
      }
    };

    fetchOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (activeTab === "transacoes") {
    return (
      <Container>
        <HistorySection>
          <TransactionsHistory showFilters />
        </HistorySection>
      </Container>
    );
  }

  if (activeTab === "relatorios") {
    return (
      <Container>
        <HistorySection>
          <FinancialReportsOverview />
        </HistorySection>
      </Container>
    );
  }

  return (
    <Container>
      {/* Cards superiores */}
      <CardsRow>
        <CardWrapper>
          <CardComponent
            title="Faturamento"
            value={CurrencyUtils.formatCurrency(overview.total_revenue.current).replace(
              "R$ ",
              ""
            )}
            icon={FaDollarSign}
            variation={formatVariation(overview.total_revenue)}
            variationColor={getVariationColor(overview.total_revenue.trend)}
            loading={loadingOverview}
          />
        </CardWrapper>

        <CardWrapper>
          <CardComponent
            title="Cancelamentos"
            value={CurrencyUtils.formatCurrency(overview.cancelled_total.current).replace(
              "R$ ",
              ""
            )}
            icon={IoCloseCircle}
            variation={formatVariation(overview.cancelled_total)}
            variationColor={getVariationColor(overview.cancelled_total.trend)}
            loading={loadingOverview}
          />
        </CardWrapper>

        <CardWrapper>
          <CardComponent
            title="Estornos"
            value={CurrencyUtils.formatCurrency(overview.refunded_total.current).replace(
              "R$ ",
              ""
            )}
            icon={FaRedo}
            variation={formatVariation(overview.refunded_total)}
            variationColor={getVariationColor(overview.refunded_total.trend)}
            loading={loadingOverview}
          />
        </CardWrapper>


      </CardsRow>

      {/* Saques */}
      <WithdrawsRow>
        <WithdrawRequestLegacy/>
        <MyWithdraws balance={overview.wallet_balance.current} />
      </WithdrawsRow>

      {/* Histórico */}
      <HistorySection>
        <TransactionsHistory />
      </HistorySection>
    </Container>
  );
}
