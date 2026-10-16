import * as Yup from 'yup';
import {translate} from '../../locales';

export const schema = Yup.object().shape({
  name: Yup.string()
    .required(() => translate('dataUserSignUp.text_error_name'))
    .min(2, () => translate('dataUserSignUp.text_error_name')),
  date: Yup.string(),
  // .required(
  //   translate('dataUserSignUp.text_required_date_birth'),
  // ),
  email: Yup.string()
    .email(() => translate('dataUserSignUp.text_error_email'))
    .required(() => translate('dataUserSignUp.text_required_email')),
  phone: Yup.string().required(() =>
    translate('dataUserSignUp.text_required_phone'),
  ),
  password: Yup.string()
    .min(6, () => translate('dataUserSignUp.text_required_password'))
    .required(() =>
      translate(
        'dataUserSignUp.message_alert_password_must_contain_least_six_digits',
      ),
    ),

  password_confirmation: Yup.string()
    .required(() =>
      translate('dataUserSignUp.message_alert_password_do_not_match'),
    )
    .oneOf([Yup.ref('password'), null], () =>
      translate('dataUserSignUp.message_alert_password_do_not_match'),
    ),
});
