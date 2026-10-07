import * as yup from "yup";

export const schemaFormCallGroup = yup.object({
  name: yup.string().required("Este campo é obrigatório"),
  weight: yup.number().required("Este campo é obrigatório"),
  requiredImage: yup.boolean().default(false),
  image: yup.mixed().when("requiredImage", {
    is: true,
    then: (schema) => schema.required("Logo é obrigatório"),
    otherwise: (schema) => schema.optional(),
  }),
});
