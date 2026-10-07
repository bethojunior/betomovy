import apiMain from '../../../api/apiMain';

export const PixService = () => {
  const generatePixPayment = async (tripReference: string, amount: number) => {
    const formattedAmount = Number(amount.toFixed(2));
    const response = await apiMain.post('/trip/payWithPixAtEnd', { tripReference, amount: formattedAmount });
    if (response.data?.status && response.data?.data) {
      return response.data.data;
    }
    throw new Error('Erro ao gerar pagamento Pix');
  };

  const checkPixStatus = async (transactionId: string) => {
    const response = await apiMain.get(`/trip/pixStatus?transactionId=${transactionId}`);
    return response.data
  };

  return {
    generatePixPayment,
    checkPixStatus,
  };
};
