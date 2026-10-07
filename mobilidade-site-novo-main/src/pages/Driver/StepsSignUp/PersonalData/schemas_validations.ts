import * as yup from "yup";

export const schema = yup.object({
  nameDriver: yup
    .string()
    .required("Este campo é obrigatório")
    .test("full-name", "Digite o nome completo", (value) => {
      if (!value) return false; // Garante que o valor não seja vazio
      const words = value.trim().split(/\s+/); // Divide por espaços múltiplos
      return words.length > 1; // Verifica se há pelo menos duas palavras
    }),
  email: yup
    .string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Este campo é do tipo email")
    .required("Este campo é obrigatório"),
  // Comprimento/formato real do telefone já é validado por país no onBlur
  // (validatePhoneByCountry) — aqui só garante que foi preenchido.
  phone: yup.string().required("Este campo é obrigatório"),
  gender: yup.string().required("Este campo é obrigatório"),
  password: yup
    .string()
    .min(6, "O mínimo é 6 caracteres")
    .required("Este campo é obrigatório"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], "As senhas não coincidem")
    .required("Este campo é obrigatório"),
  cpfandcnpj: yup.string(),
});
