import * as Yup from 'yup';
import {translate} from '../../locales';

export const schema = Yup.object().shape({
  email: Yup.string()
    .email(() => translate('recoveryPassword.message_email'))
    .required(() => translate('recoveryPassword.message_email')),
});

export const schemaPassword = Yup.object().shape({
  password: Yup.string()
    .min(6, () => translate('recoveryPassword.message_change_password_error'))
    .required(() => translate('recoveryPassword.message_password_empty')),

  password_confirmation: Yup.string()
    .required(() => translate('recoveryPassword.message_password_empty'))
    .oneOf([Yup.ref('password'), null], () =>
      translate('recoveryPassword.message_password_many_different'),
    ),
});
