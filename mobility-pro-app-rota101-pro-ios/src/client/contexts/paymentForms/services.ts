import apiMain from '../../api/apiMain';

export const PaymentFormService = {
  listCard: () => {
    return apiMain('CustomerCard/Get');
  },

  addCard: (card: any) => {
    return apiMain.post('CustomerCard/Insert', card);
  },

  addCoupon: (code: string, lat: string, lng: string) => {
    return apiMain.post('DiscountCoupon/Activate', {code, lat, lng});
  },

  addVoucher: (data: any) => {
    return apiMain.post('VoucherPurchase/CustomerInsert', data);
  },

  listCoupom: () => {
    return apiMain('DiscountCoupon/FindActivated');
  },

  listVoucher: (lat: string, lng: string) => {
    return apiMain(`voucherPromotion/findAll?latitude=${lat}&longitude=${lng}`);
  },

  getCurrentSaldVoucher: () => {
    return apiMain('Customer/Find');
  },

  deleteCard: (card: any) => {
    return apiMain.post('CustomerCard/Delete', card);
  },
};
