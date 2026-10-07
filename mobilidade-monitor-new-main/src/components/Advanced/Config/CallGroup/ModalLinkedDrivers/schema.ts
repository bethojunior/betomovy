import * as yup from "yup";

export const schemaLinkedDrivers = yup.object({
  driverCode: yup.string().required("Este campo é obrigatório"),
});
