import apiAdmin from "../services/apiAdmin";
import api from "../services/api";
import { useCitySelected } from "./useCitySelected";
import type { FinancialProps } from "../pages/Financial/TransferRequests/types";
import { useState } from "react";

type apiAdminEnvelope<T> = {
  status?: boolean;
  response?: T;
  message?: string;
  [key: string]: any;
};

type apiAdminListEnvelope<T> = {
  data?: T[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  [key: string]: any;
};

export type FinancialApiResponse<T> = apiAdminEnvelope<T>;
export type FinancialPaginatedResponse<T> = apiAdminEnvelope<apiAdminListEnvelope<T>>;

export type WithdrawalStatus = "pending" | "approved" | "rejected" | string;
export type WithdrawalType = "driver" | "customer" | string;

export interface CreateWithdrawalPayload {
  customer_id: number;
  type: WithdrawalType;
  status?: WithdrawalStatus;
  amount: number;
  recipient_name: string;
  recipient_phone: string;
  recipient_document: string;
  bank_account?: string | null;
  pix_key?: string | null;
  external_id?: number | string | null;
}

export interface WithdrawalCustomerSummary {
  id: number;
  name: string;
  project_name: string;
}

export interface FinancialCustomer {
  id: number;
  name: string;
  email?: string | null;
  document?: string | null;
  project_name: string;
  holder_name?: string | null;
  logo?: string | null;
  acquirers?: any[];
  [key: string]: any;
}

export interface WithdrawalListItem {
  id: number;
  customer_id: number;
  amount: string;
  status: WithdrawalStatus;
  type: WithdrawalType;
  external_id: string | null;
  webhook_url: string | null;
  webhook_status: string | null;
  bank_account: string | null;
  pix_key: string | null;
  recipient_name: string;
  recipient_phone: string;
  recipient_document: string;
  created_at: string;
  updated_at: string;
  customer?: WithdrawalCustomerSummary;
}

export interface ListWithdrawalsParams {
  page?: number;
  per_page?: number;
  status?: WithdrawalStatus;
  type?: WithdrawalType;
  customer_id?: number;
  search?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface UpdateCustomerAcquirersPayload {
  acquirers: Array<{
    acquirer_id: number;
    payment_method: string;
    fee_percentage: number;
    fixed_fee: number;
  }>;
}

export interface ListCustomersParams {
  page?: number;
  per_page?: number;
  include?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface SearchCustomersParams {
  name: string;
  include?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export type GlobalTransactionStatus =
  | "paid"
  | "pending"
  | "failed"
  | "canceled"
  | string;

export type PaymentMethod = "card" | "pix" | "cash" | string;

export interface CreateGlobalTransactionPayload {
  customer_id: number;
  acquirer_id: number;
  amount: number;
  status: GlobalTransactionStatus;
  payment_method: PaymentMethod;
  external_id?: string | number;
}

export interface ListGlobalTransactionsParams {
  page?: number;
  per_page?: number;
  status?: GlobalTransactionStatus;
  customer_id?: number;
  acquirer_id?: number;
  payment_method?: PaymentMethod;
  [key: string]: string | number | boolean | null | undefined;
}

export interface GlobalTransactionAcquirerSummary {
  id: number;
  name: string;
  description?: string | null;
  active?: number | boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface GlobalTransactionListItem {
  id: number;
  customer_id: number;
  acquirer_id: number;
  external_id: string | null;
  amount: string;
  liquid_amount: string;
  status: GlobalTransactionStatus;
  payment_method: PaymentMethod;
  fee_percentage: number | null;
  fixed_fee: number | null;
  created_at: string;
  updated_at: string;
  customer?: WithdrawalCustomerSummary;
  acquirer?: GlobalTransactionAcquirerSummary;
  payer_name?: string;
  payer_email?: string;
  payer_document?: string;
}

export type FinancialOverviewTrend = "up" | "down" | string;

export interface FinancialOverviewMetric {
  current: number;
  previous: number;
  difference: number;
  percentage: number;
  trend: FinancialOverviewTrend;
}

export interface FinancialOverviewWalletBalance {
  current: number;
}

export interface FinancialOverviewResponse {
  total_revenue: FinancialOverviewMetric;
  cancelled_total: FinancialOverviewMetric;
  refunded_total: FinancialOverviewMetric;
  wallet_balance: FinancialOverviewWalletBalance;
}

export interface LegacyWithdrawalsParams {
  page: number;
  per_page?: number;
  paid?: number;
  recused?: number;
}

const toQueryParams = (
  params?: Record<string, string | number | boolean | null | undefined>
) => {
  if (!params) return undefined;

  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );

  if (entries.length === 0) return undefined;

  return Object.fromEntries(entries);
};

export const useFinancial = () => {
  const { citySelected, hasCitySelected } = useCitySelected();
  const [ customer, setCustomer ] = useState<FinancialCustomer | null>(null);

  const getAdminHeaders = () => {
    const defaultsHeaders = apiAdmin.defaults.headers as any;
    const authorization =
      defaultsHeaders?.Authorization ||
      defaultsHeaders?.authorization ||
      defaultsHeaders?.common?.Authorization ||
      defaultsHeaders?.common?.authorization;

    return {
      cityId: citySelected?.cityId,
      ...(authorization ? { Authorization: authorization } : {}),
    };
  };

  const listWithdrawals = async <T = WithdrawalListItem,>(
    params?: ListWithdrawalsParams
  ) => {
    const response = await apiAdmin.get<FinancialPaginatedResponse<T>>(
      "/withdrawal",
      {
        headers: {
          ...getAdminHeaders(),
        },
        params: toQueryParams(params),
      }
    );

    return response.data;
  };

  const listProjectWithdrawals = async <T = WithdrawalListItem,>(
    params?: Omit<ListWithdrawalsParams, "customer_id">
  ) => {
    const customer = await getProjectCustomer();

    if (!customer?.id) {
      return {
        status: false,
        response: {
          data: [],
          total: 0,
        },
        message: "Customer do projeto não encontrado",
      } as FinancialPaginatedResponse<T>;
    }

    return listWithdrawals<T>({
      ...params,
      customer_id: customer.id,
    });
  };

  const createWithdrawal = async <T = WithdrawalListItem,>(
    payload: CreateWithdrawalPayload
  ) => {
    const response = await apiAdmin.post<apiAdminEnvelope<T>>("/withdrawal", payload, {
      headers: {
        ...getAdminHeaders(),
      },
    });
    return response.data;
  };

  const approveWithdrawal = async <T = any,>(withdrawalId: number | string) => {
    const response = await apiAdmin.patch<apiAdminEnvelope<T>>(
      `/withdrawal/approve/${withdrawalId}`,
      undefined,
      {
        headers: {
          ...getAdminHeaders(),
        },
      }
    );
    return response.data;
  };

  const rejectWithdrawal = async <T = any,>(withdrawalId: number | string) => {
    const response = await apiAdmin.patch<apiAdminEnvelope<T>>(
      `/withdrawal/reject/${withdrawalId}`,
      undefined,
      {
        headers: {
          ...getAdminHeaders(),
        },
      }
    );
    return response.data;
  };

  const listCustomers = async <T = any,>(params?: ListCustomersParams) => {
    const response = await apiAdmin.get<FinancialPaginatedResponse<T>>(
      "/customers/pagination",
      {
        headers: {
          ...getAdminHeaders(),
        },
        params: toQueryParams({
          include: "acquirers",
          ...params,
        }),
      }
    );

    return response.data;
  };

  const searchCustomers = async (params: SearchCustomersParams) => {
    const response = await apiAdmin.get<apiAdminEnvelope<FinancialCustomer | null>>(
      "/customers/search",
      {
        headers: getAdminHeaders(),
        params: toQueryParams(params),
      }
    );

    return response.data;
  };

  const getProjectCustomer = async (): Promise<FinancialCustomer | null> => {
    if (customer && customer?.id) {
      return customer;
    }

    const projectName = String(import.meta.env.PROJECT_NAME || "").trim();
    const response = await searchCustomers({ name: projectName });

    setCustomer(response?.response || null);

    return response?.response || null;
  };

  const updateCustomerAcquirers = async <T = any,>(
    customerId: number | string,
    payload: UpdateCustomerAcquirersPayload
  ) => {
    const response = await apiAdmin.put<apiAdminEnvelope<T>>(
      `/customers/${customerId}/acquirers`,
      payload,
      {
        headers: {
          ...getAdminHeaders(),
        },
      }
    );

    return response.data;
  };

  const listGlobalTransactions = async <T = GlobalTransactionListItem,>(
    params?: ListGlobalTransactionsParams
  ) => {
    const response = await apiAdmin.get<FinancialPaginatedResponse<T>>(
      "/global-transactions",
      {
        headers: {
          ...getAdminHeaders(),
        },
        params: toQueryParams(params),
      }
    );

    return response.data;
  };

  const listProjectGlobalTransactions = async <
    T = GlobalTransactionListItem,
  >(
    params?: Omit<ListGlobalTransactionsParams, "customer_id">
  ) => {
    const customer = await getProjectCustomer();

    if (!customer?.id) {
      return {
        status: false,
        response: {
          data: [],
          total: 0,
        },
        message: "Customer do projeto não encontrado",
      } as FinancialPaginatedResponse<T>;
    }

    return listGlobalTransactions<T>({
      ...params,
      customer_id: customer.id,
    });
  };

  const createGlobalTransaction = async <T = any,>(
    payload: CreateGlobalTransactionPayload
  ) => {
    const response = await apiAdmin.post<apiAdminEnvelope<T>>(
      "/global-transactions",
      payload,
      {
        headers: {
          ...getAdminHeaders(),
        },
      }
    );

    return response.data;
  };

  const listAcquirers = async <T = any,>() => {
    const response = await apiAdmin.get<apiAdminEnvelope<T[] | apiAdminListEnvelope<T>>>(
      "/acquirers",
      {
        headers: {
          ...getAdminHeaders(),
        },
      }
    );

    return response.data;
  };

  const listLegacyWithdrawals = async (
    params: LegacyWithdrawalsParams
  ): Promise<{ data: FinancialProps[]; total: number }> => {
    const response = await api.get("withdraw", { params });
    
    const envelope = response.data.response;
    const raw: FinancialProps[] = envelope?.data ?? [];
    return {
      data: raw,
      total: envelope?.total ?? raw.length,
    };
  };

  const approveLegacyWithdrawal = async (id: string | number): Promise<boolean> => {
    const response = await api.put(`withdraw/${id}`, {});
    return !!response.status;
  };

  const rejectLegacyWithdrawal = async (id: string | number): Promise<boolean> => {
    const response = await api.put(`withdraw/${id}/reject`, {});
    return !!response.status;
  };

  const getFinancialOverview = async <T = FinancialOverviewResponse,>() => {
    const customer = await getProjectCustomer();

    if (!customer?.id) return null;

    const response = await apiAdmin.get<apiAdminEnvelope<T>>(
      `/dashboard/financial/overview?customer_id=${customer?.id}`,
      {
        headers: {
          ...getAdminHeaders(),
        },
      }
    );

    return response.data;
  };

  return {
    citySelected,
    hasCitySelected,
    withdrawal: {
      list: listWithdrawals,
      listProject: listProjectWithdrawals,
      create: createWithdrawal,
      approve: approveWithdrawal,
      reject: rejectWithdrawal,
      listLegacy: listLegacyWithdrawals,
      approveLegacy: approveLegacyWithdrawal,
      rejectLegacy: rejectLegacyWithdrawal,
    },
    customers: {
      list: listCustomers,
      search: searchCustomers,
      getProjectCustomer,
      updateAcquirers: updateCustomerAcquirers,
    },
    globalTransactions: {
      list: listGlobalTransactions,
      listProject: listProjectGlobalTransactions,
      create: createGlobalTransaction,
    },
    acquirers: {
      list: listAcquirers,
    },
    overview: {
      get: getFinancialOverview,
    },
    listWithdrawals,
    listProjectWithdrawals,
    createWithdrawal,
    approveWithdrawal,
    rejectWithdrawal,
    listLegacyWithdrawals,
    approveLegacyWithdrawal,
    rejectLegacyWithdrawal,
    listCustomers,
    searchCustomers,
    getProjectCustomer,
    updateCustomerAcquirers,
    listGlobalTransactions,
    listProjectGlobalTransactions,
    createGlobalTransaction,
    listAcquirers,
    getFinancialOverview,
  };
};
