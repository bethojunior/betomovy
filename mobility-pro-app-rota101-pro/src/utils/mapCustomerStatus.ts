export const CUSTOMER_STATUS = {
  ACTIVE: '1',
  PENDING: '2',
  BLOCKED: '3',
} as const;

export const mapCustomerStatus = (statusId: string | number): string => {
  const statusMap = {
    [CUSTOMER_STATUS.ACTIVE]: 'ATIVO',
    [CUSTOMER_STATUS.PENDING]: 'PENDENTE',
    [CUSTOMER_STATUS.BLOCKED]: 'BLOQUEADO',
  };

  return statusMap[String(statusId)] || 'PENDENTE';
};