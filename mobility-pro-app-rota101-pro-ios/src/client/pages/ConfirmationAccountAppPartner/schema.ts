import * as Yup from 'yup';
import {translate} from '../../locales';

export const SchemaForm = Yup.object().shape({
  email: Yup.string()
    .email(() => translate('login.yup_login_required_email'))
    .required(() => translate('paymentPage.error_required')),
});
