import * as Yup from 'yup';

export const schema = Yup.object().shape({
  document: Yup.string().required('Campo obrigatorio'),
});
