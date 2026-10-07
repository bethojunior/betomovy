import * as yup from 'yup';

export const schema = yup.object({
  document: yup.string().nullable().default(''),
});