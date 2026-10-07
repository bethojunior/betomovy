import * as yup from "yup";

export const schemaWebhook = yup
  .object({
    url: yup
      .string()
      .matches(
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/,
        "URL Inválido"
      )
      .required("Campo obrigatório"),
    type_services: yup.number().integer().required("Campo obrigatório"),
    method: yup.string().required("Campo obrigatório"),
  })
  .required();
