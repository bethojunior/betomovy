import * as yup from "yup";

const cnpjRegex = /^(?:\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;

export const SchemaFormInfoStep = yup
  .object({
    nameCompany: yup.string().required("Campo obrigatório"),
    nameFantasy: yup.string().required("Campo obrigatório"),
    address: yup.string().required("Campo obrigatório"),
    document: yup.string()
      .required("Campo obrigatório")
      .matches(cnpjRegex, "Formato do CNPJ inválido"),
    state: yup.number().required("Campo obrigatório"),
    city: yup.number().required("Campo obrigatório"),
  })
  .required();

