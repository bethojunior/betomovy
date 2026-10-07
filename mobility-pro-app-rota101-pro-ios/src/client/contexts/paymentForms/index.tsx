// @ts-nocheck

import {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {customToast} from '../../../utils/FlashMessage';
import {translate} from '../../locales';
import {PaymentFormService} from './services';
import Helper from '../../utils/Helper';

interface iPaymentFormContext {
  getCards: any;
  getCoupons: any;
  getCurrentBalanceVoucher: any;
  removeCard: any;
  addCard: any;
  addCoupon: any;
  addVoucher: any;
  cards: any;
}

const PaymentFormContext = createContext<iPaymentFormContext>(
  {} as iPaymentFormContext,
);

export const PaymentFormProvider = ({children}: any) => {
  const [cards, setCards] = useState([]);

  const getCards = useCallback(async () => {
    try {
      const {data} = await PaymentFormService.listCard();

      if (!data.status) {
        return customToast(
          translate('paymentPage.text_error_list_card'),
          'danger',
        );
      }
      setCards(data.data);
      return data.data;
    } catch (error) {
      return customToast(
        translate('paymentPage.text_error_list_card'),
        'danger',
      );
    }
  }, []);

  const addCard = useCallback(
    async (
      listCard: any,
      cardHolder: string,
      document: string,
      cardNumber: string,
      dueDate: string,
      cvv: string,
      birthday: string,
    ) => {
      try {
        if (
          listCard.find(
            (item: any) => item.number === cardNumber.split(' ').join(''),
          )
        ) {
          return customToast(
            translate('paymentPage.text_card_exists'),
            'warning',
          );
        }

        const date = dueDate.split('/');
        const organizedBithDay = birthday.split('/')

        const card = {
          cardNumber,
          cvv,
          expirationMonth: date[0],
          expirationYear: date[1],
          cardholderName: cardHolder,
          docNumber: Helper.unMask(document),
          mpToken: null,
          firstSixDigits: cardNumber.split(' ').join('').substr(0, 6),
          paymentMethodName: await Helper.detectCardType(cardNumber),
          securityCodeLength: String(cvv).length,
          lastFourDigits: cardNumber.substr(-4),
          dateOfBirth: `${organizedBithDay[2] + '-' + organizedBithDay[1] + '-' + organizedBithDay[0]}`,
        };

        const {data} = await PaymentFormService.addCard(card);

        if (!data.status) {
          return customToast(translate('paymentPage.error_add_card'), 'danger');
        }

        return customToast(
          translate('paymentPage.text_success_to_add_card'),
          'success',
        );
      } catch (error) {
        return customToast(translate('paymentPage.error_add_card'), 'danger');
      }
    },
    [],
  );

  const removeCard = useCallback(async (cardSelected: string) => {
    try {
      const response = await PaymentFormService.deleteCard({
        cardId: cardSelected,
      });

      if (!response.data.status) {
        return customToast(
          translate('paymentPage.error_delete_card'),
          'danger',
        );
      }

      return customToast(
        translate('paymentPage.success_delete_card'),
        'success',
      );
    } catch (error) {
      return customToast(translate('paymentPage.error_delete_card'), 'danger');
    }
  }, []);

  const getCoupons = useCallback(async () => {
    try {
      const {data} = await PaymentFormService.listCoupom();

      if (!data.status) {
        return customToast(
          translate('paymentPage.error_load_coupon'),
          'danger',
        );
      }

      return data.data;
    } catch (error) {
      return customToast(translate('paymentPage.error_load_coupon'), 'danger');
    }
  }, []);

  const getCurrentBalanceVoucher = useCallback(async () => {
    try {
      const {data} = await PaymentFormService.getCurrentSaldVoucher();

      if (!data.status) {
        return customToast(
          translate('paymentPage.error_load_sald_voucher'),
          'danger',
        );
      }

      return data.data;
    } catch (error) {
      return customToast(
        translate('paymentPage.error_load_sald_voucher'),
        'danger',
      );
    }
  }, []);

  const addCoupon = useCallback(
    async (code: string, lat: string, lng: string) => {
      try {
        if (code === '') {
          return customToast(
            translate('paymentPage.text_code_empty'),
            'warning',
          );
        }
        const {data} = await PaymentFormService.addCoupon(code, lat, lng);

        if (!data.status) {
          return customToast(
            translate('paymentPage.error_add_coupon'),
            'danger',
          );
        }

        if (data.data === null) {
          return customToast(
            translate('paymentPage.text_invalid_code'),
            'warning',
          );
        }

        return customToast(
          translate('paymentPage.success_add_coupon'),
          'success',
        );
      } catch (error) {
        return customToast(translate('paymentPage.error_add_coupon'), 'danger');
      }
    },
    [],
  );

  const addVoucher = useCallback(async (response: any) => {
    try {
      if (response.cardId === undefined) {
        return customToast(
          translate('paymentPage.error_select_card'),
          'danger',
        );
      }

      const {data} = await PaymentFormService.addVoucher(response);

      if (!data.status) {
        return customToast(
          data?.data?.message || data?.message,
          'danger',
        );
      }

      return customToast(
        translate('paymentPage.success_buy_voucher'),
        'success',
      );
    } catch (error) {
      return customToast(translate('paymentPage.error_buy_voucher'), 'danger');
    }
  }, []);

  const value = useMemo(
    () => ({
      getCards,
      addCard,
      getCoupons,
      getCurrentBalanceVoucher,
      removeCard,
      addCoupon,
      addVoucher,
      cards,
    }),
    [
      getCards,
      addCard,
      getCoupons,
      getCurrentBalanceVoucher,
      removeCard,
      addCoupon,
      addVoucher,
      cards,
    ],
  );

  return (
    <PaymentFormContext.Provider value={value}>
      {children}
    </PaymentFormContext.Provider>
  );
};

export const usePaymentForm = () => {
  const context = useContext(PaymentFormContext);
  return context;
};
