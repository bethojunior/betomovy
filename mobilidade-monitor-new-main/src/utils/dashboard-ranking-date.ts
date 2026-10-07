export type DashboardRankingPeriod = "day" | "month" | "all";

const formatDateToApi = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const buildRankingPeriodParams = (
  period: DashboardRankingPeriod
): { dateStart?: string; dateEnd?: string } => {
  if (period === "all") {
    return {};
  }
  const today = new Date();
  const dateEnd = formatDateToApi(today);
  if (period === "day") {
    return {
      dateStart: dateEnd,
      dateEnd,
    };
  }
  const firstDayOfMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  return {
    dateStart: formatDateToApi(firstDayOfMonth),
    dateEnd,
  };
};
