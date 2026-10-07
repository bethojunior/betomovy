import {createContext, useCallback, useContext, useMemo, useState} from 'react';
import {translate} from '../../../../client/locales';
import {customToast} from '../../../../utils/FlashMessage';
import {PaymentFormService} from './service';
import {iPaymentFormContext} from './types';

const PaymentFormContext = createContext<iPaymentFormContext>(
  {} as iPaymentFormContext,
);

export const PaymentFormProvider = ({children}: ChildrenType) => {
  const [cards, setCards] = useState([]);

  const getCards = useCallback(async () => {
    try {
      const {data} = await PaymentFormService.listCard();

      if (!data.status) {
        return customToast(
          translate('paymentDriver.text_error_list_card'),
          'danger',
        );
      }
      setCards(data.data);
      return data.data;
    } catch (error) {
      return customToast(
        translate('paymentDriver.text_error_list_card'),
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
            translate('paymentDriver.text_card_exists'),
            'warning',
          );
        }

        const date = dueDate.split('/');

        const card = {
          cardNumber,
          cvv,
          expirationMonth: date[0],
          expirationYear: date[1],
          cardholderName: cardHolder,
          docNumber: document,
          mpToken: null,
          firstSixDigits: cardNumber.split(' ').join('').substr(0, 6),
          paymentMethodName: 'mastercard',
          securityCodeLength: String(cvv).length,
          lastFourDigits: cardNumber.substr(-4),
          dateOfBirth: birthday,
        };

        const {data} = await PaymentFormService.addCard(card);

        if (!data.status) {
          return customToast(
            translate('paymentDriver.error_add_card'),
            'danger',
          );
        }

        return customToast(
          translate('paymentDriver.text_success_to_add_card'),
          'success',
        );
      } catch (error) {
        return customToast(translate('paymentDriver.error_add_card'), 'danger');
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
          translate('paymentDriver.error_delete_card'),
          'danger',
        );
      }

      return customToast(
        translate('paymentDriver.success_delete_card'),
        'success',
      );
    } catch (error) {
      return customToast(
        translate('paymentDriver.error_delete_card'),
        'danger',
      );
    }
  }, []);

  const value = useMemo(
    () => ({
      getCards,
      addCard,
      removeCard,
      cards,
    }),
    [getCards, addCard, removeCard, cards],
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
