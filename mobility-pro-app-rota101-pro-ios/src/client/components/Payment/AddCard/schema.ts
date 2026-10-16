import * as Yup from 'yup';
import {translate} from '../../../locales';

export const schema = Yup.object().shape({
  cardHolder: Yup.string()
    .min(2, () => translate('paymentPage.error_name'))
    .required(() => translate('paymentPage.error_required'))
    .test(
      'cardHolder',
      () => translate('paymentPage.error_name'),
      value => validateName(value),
    ),

  document: Yup.string()
    .min(11, () => translate('paymentPage.error_document'))
    .required(() => translate('paymentPage.error_required')),

  cardNumber: Yup.string()
    .min(19, () => translate('paymentPage.error_card_number'))
    .required(() => translate('paymentPage.error_required'))
    .test(
      'cardNumber',
      () => translate('paymentPage.error_card_number'),
      value => validateCreditCardNumber(value),
    ),

  dueDate: Yup.string()
    .matches(/(0[1-9]|1[0-2])\/([0-9]{2})$/, () =>
      translate('paymentPage.error_date'),
    )
    .required(() => translate('paymentPage.error_required'))
    .test(
      'dueDate',
      () => translate('paymentPage.error_date'),
      value => validateDate(value),
    ),

  cvv: Yup.string()
    .min(3, () => translate('paymentPage.error_cvv'))
    .max(4, () => translate('paymentPage.error_cvv'))
    .required(() => translate('paymentPage.error_required')),

  birthday: Yup.string()
    .matches(/(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/, () =>
      translate('paymentPage.error_date'),
    )
    .required(() => translate('paymentPage.error_required'))
    .test(
      'birthday',
      () => translate('paymentPage.error_date'),
      value => validateBirthday(value),
    ),
});

function validateDate(date: string | undefined) {
  if (!date) return false;

  const [month, year] = date?.split('/');
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear() % 100; // Dois últimos dígitos do ano

  if (Number(year) < currentYear) {
    return false;
  }

  if (Number(year) === currentYear && Number(month) < currentMonth) {
    return false;
  }

  return true;
}

function validateBirthday(date: string | undefined) {
  if (!date) return false;

  const [day, month, year] = date?.split('/');
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  if (Number(year) > currentYear) {
    return false;
  }

  if (Number(year) === currentYear && Number(month) > currentMonth) {
    return false;
  }

  if (
    Number(year) === currentYear &&
    Number(month) === currentMonth &&
    Number(day) > currentDay
  ) {
    return false;
  }

  return true;
}

function validateCreditCardNumber(value: string | undefined) {
  if (!value) return false;

  // accept only digits, dashes or spaces
  if (/[^0-9-\s]+/.test(value)) return false;

  return true;
}

function validateName(value: string | undefined) {
  if (!value) return false;

  const words = value?.split(' ');

  if (words.length >= 2 && words[1].length >= 1) return true;

  return false;
}
