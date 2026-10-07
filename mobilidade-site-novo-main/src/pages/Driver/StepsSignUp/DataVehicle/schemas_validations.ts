import * as yup from "yup";

export const schema = yup.object({
  documentCar: yup.string().required("Este campo é obrigatório"),
  brandCar: yup.string().required("Este campo é obrigatório"),
  modelCar: yup.string().required("Este campo é obrigatório"),
  plateCar: yup.string().required("Este campo é obrigatório"),
  numberRenavam: yup
    .string()
    .min(11, "O mínimo é 11 caracteres")
    .max(12, "O máximo é 12 caracteres")
    .required("Este campo é obrigatório"),
  colorCar: yup.string().required("Este campo é obrigatório"),
  quantitySeats: yup.number().required("Este campo é obrigatório"),
  yearCar: yup.string().required("Este campo é obrigatório"),
  cnpjCompany: yup.string(),
});

export const schemaInternational = yup.object({
  documentCar: yup.string().required("Este campo é obrigatório"),
  brandCar: yup.string().required("Este campo é obrigatório"),
  modelCar: yup.string().required("Este campo é obrigatório"),
  plateCar: yup.string().required("Este campo é obrigatório"),
  numberRenavam: yup.string(),
  colorCar: yup.string().required("Este campo é obrigatório"),
  quantitySeats: yup.number().required("Este campo é obrigatório"),
  yearCar: yup.string().required("Este campo é obrigatório"),
  cnpjCompany: yup.string(),
});
