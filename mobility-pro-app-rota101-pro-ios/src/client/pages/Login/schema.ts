import * as Yup from 'yup';

export const schema = translate =>
  Yup.object().shape({
    email: Yup.string()
      .email(translate('login.yup_login_required_email'))
      .required(translate('login.message_alert_enter_the_email')),
    password: Yup.string()
      .min(6, translate('login.password_min_caracteres'))
      .required(translate('login.message_alert_enter_the_password')),
  });
