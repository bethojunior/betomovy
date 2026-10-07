import * as yup from "yup";

export const schema = yup.object({
  email: yup
    .string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Este campo é do tipo email")
    .required("Este campo é obrigatório"),
  password: yup
    .string()
    .min(6, "O mínimo é 6 caracteres")
    .required("Este campo é obrigatório"),
});
