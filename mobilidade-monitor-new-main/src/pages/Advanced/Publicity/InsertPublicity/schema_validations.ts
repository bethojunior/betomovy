import * as yup from "yup";

export const schema = yup
  .object({
    dateInit: yup.date().nullable().required("Este campo é obrigatório"),
    dateFinal: yup.date().nullable().required("Este campo é obrigatório"),
    amountOfTime: yup
      .string()
      .required("Este campo é obrigatório")
      .test(
        "max-300",
        "O tempo máximo permitido é 300 segundos",
        (value) => !value || Number(value) <= 300
      ),
    description: yup.string().required("Este campo é obrigatório"),
    company: yup.number().required("Este campo é obrigatório"),
    link: yup
      .string()
      .test("is-valid-url", "URL inválida. Ex: https://exemplo.com", (value) => {
        if (!value) return true; // deixa o required tratar vazios
        try {
          const normalized = value.startsWith("http") ? value : `http://${value}`;
          const url = new URL(normalized);
          return url.hostname.includes(".");
        } catch {
          return false;
        }
      })
      .required("Este campo é obrigatório"),
    genderId: yup.number().required("Este campo é obrigatório"),
    appId: yup.number().required("Este campo é obrigatório"),
    advertsingId: yup.number().required("Este campo é obrigatório"),
    emailInformation: yup
      .string()
      .email("Email inválido")
      .required("Este campo é obrigatório"),
    emailRedirect: yup
      .string()
      .email("Email inválido")
      .required("Este campo é obrigatório"),
  })
  .required();

export type TypeSchema = yup.InferType<typeof schema>;
