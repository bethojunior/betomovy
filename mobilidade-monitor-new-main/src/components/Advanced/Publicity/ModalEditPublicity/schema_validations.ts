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
    link: yup.string().required("Este campo é obrigatório"),
    genderId: yup.number().required("Este campo é obrigatório"),
    appId: yup.number().required("Este campo é obrigatório"),
    advertisingId: yup.number().required("Este campo é obrigatório"),
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

export type TypeSchema = Omit<yup.InferType<typeof schema>, "dateInit" | "dateFinal"> & {
  dateInit: Date | null;
  dateFinal: Date | null;
};


