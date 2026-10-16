import apiMain from '../../api/apiMain';

export const ReceiptService = {
  postReceipt: async (tripReference: string) => {
    const response = await apiMain.get(
      `/TripReceipt/SendCustomer?t=${tripReference}`,
    );
    return response.data;
  },
  postMessageContactUs: async (message: string, idUser: string) => {
    const response = await apiMain.post('/Customer/HelpMeEmail', {
      message,
      userId: idUser,
    });
    return response.data;
  },
  postExcludeAccount: async (details: string, reason: string) => {
    const response = await apiMain.post<ApiResponse<any>>('/User/RemoveAccountRequest', {
      details: details,
      reason: reason,
    });
    return response.data;
  },
  insertByCustomer: async data => {
    try {
      const response = await apiMain.post('/TripReport/InsertByCustomer', data);
      return response.data;
    } catch (error) {
      return console.log(error);
    }
  },
};
