import * as yup from "yup";

export const schemaFormConfigApp = yup.object({
  nameApp: yup.string().required("Este campo é obrigatório"),
  phoneSupport: yup.string().optional(),
  primaryColor: yup.string().required("Este campo é obrigatório"),
  secondaryColor: yup.string().required("Este campo é obrigatório"),
  textColor: yup.string().required("Este campo é obrigatório"),
  requiredLogo: yup.boolean().default(false),
  logoApp: yup.mixed().when("requiredLogo", {
    is: true,
    then: (schema) => schema.required("Logo é obrigatório"),
    otherwise: (schema) => schema.optional(),
  }),
});
