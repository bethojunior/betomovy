import * as yup from "yup";

function isValidHostname(hostname: string): boolean {
  if (!hostname) return false;

  const hostnameParts = hostname.split('.');
  if (hostnameParts.length < 2 || hostname.endsWith('-')) {
    return false;
  }

  const validTLD = /\.(com|net|org|edu|gov|mil|co|info|biz|io|tech|ai|me|app|dev|site|br)$/i;
  return validTLD.test(hostname);
}

export const schema = yup.object({
  company_name: yup.string().required("Campo obrigatório"),
  company_type: yup.string().required("Campo obrigatório"),

  company_email: yup
    .string()
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Este campo deve conter um email válido"
    )
    .required("Campo obrigatório"),

  company_phone: yup
    .string()
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Formato de telefone inválido (ex: (99) 99999-9999)")
    .required("Campo obrigatório"),

  company_whatsapp: yup
    .string()
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Formato de WhatsApp inválido (ex: (99) 99999-9999)")
    .required("Campo obrigatório"),

    link: yup
    .string()
    .test("is-valid-url", "URL Inválido", (value) => {
      if (!value) return false;
      try {
        const url = new URL(value.startsWith("http") ? value : `http://${value}`);
        return isValidHostname(url.hostname);
      } catch {
        return false;
      }
    })
    .required("Campo obrigatório"),

  opening_hours: yup.string().required("Campo obrigatório"),
  opening_hours2: yup.string().required("Campo obrigatório"),

  benefit1: yup.string().default('').max(100, "Máximo de 100 caracteres"),
  benefit2: yup.string().default('').max(100, "Máximo de 100 caracteres"),
  benefit3: yup.string().default('').max(100, "Máximo de 100 caracteres"),

  responsible_manager: yup.string().required("Campo obrigatório"),

  email_report: yup
    .string()
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Este campo deve conter um email válido"
    )
    .required("Campo obrigatório"),

  title: yup.string().required("Campo obrigatório"),
  subtitle: yup
    .string()
    .max(300, "Máximo de 300 caracteres")
    .required("Campo obrigatório"),

  text_button_cta: yup.string().required("Campo obrigatório"),

  link_button_cta: yup
  .string()
  .test("is-valid-url", "URL Inválido", (value) => {
    if (!value) return false;
    try {
      const url = new URL(value.startsWith("http") ? value : `http://${value}`);
      return isValidHostname(url.hostname);
    } catch {
      return false;
    }
  })
  .required("Campo obrigatório"),

  image_passenger_screen: yup.string().required("Campo obrigatório"),
  image_passenger_transit: yup.string().required("Campo obrigatório"),
  image_driver_initial: yup.string().required("Campo obrigatório"),
  image_driver_transit: yup.string().required("Campo obrigatório"),

  gender: yup.string().required("Campo obrigatório"),

  min_age: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Campo inválido")
    .min(0, "A idade mínima deve ser 0")
    .test(
      "min-less-than-max-age",
      "A idade mínima deve ser menor ou igual à idade máxima",
      function (min_age) {
        const { max_age } = this.parent;
        return max_age == null || min_age == null || min_age <= max_age;
      }
    )
    .required("Campo obrigatório"),

  max_age: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Campo inválido")
    .test(
      "max-greater-than-min-age",
      "A idade máxima deve ser maior ou igual à idade mínima",
      function (max_age) {
        const { min_age } = this.parent;
        return min_age == null || max_age == null || max_age >= min_age;
      }
    )
    .required("Campo obrigatório"),


  min_distance: yup
  .number()
  .nullable()
  .transform((value, originalValue) => (originalValue === "" ? null : value))
  .typeError("Campo inválido")
  .test(
    "min-less-than-max-distance",
    "O raio de distância mínima deve ser menor ou igual ao raio de distância máxima",
    function (value) {
      const { max_distance } = this.parent;
      return max_distance == null || value == null || value <= max_distance;
    }
  )
  .required("Campo obrigatório"),

max_distance: yup
  .number()
  .nullable()
  .transform((value, originalValue) => (originalValue === "" ? null : value))
  .typeError("Campo inválido")
  .test(
    "max-greater-than-min-distance",
    "O raio de distância máxima deve ser maior ou igual ao raio de distância mínima",
    function (value) {
      const { min_distance } = this.parent;
      return min_distance == null || value == null || value >= min_distance;
    }
  )
  .required("Campo obrigatório"),


  activities: yup.string().required("Campo obrigatório"),

  passenger_screen: yup.boolean().required("Campo obrigatório"),
  passenger_transit: yup.boolean().required("Campo obrigatório"),
  driver_screen: yup.boolean().required("Campo obrigatório"),
  driver_transit: yup.boolean().required("Campo obrigatório"),

  start_date: yup.string().required("Campo obrigatório"),

  end_date: yup
    .string()
    .required("Campo obrigatório")
    .test("is-after-start", "A data de fim não pode ser menor que a data de início", function (value) {
      const { start_date } = this.parent;
      return !start_date || !value || new Date(value) >= new Date(start_date);
    }),

  start_hour: yup.string().required("Campo obrigatório"),
  end_hour: yup.string().required("Campo obrigatório"),

  days_of_week: yup
    .array()
    .min(1, "Selecione ao menos um dia da semana")
    .required("Campo obrigatório"),
});

export type TypeSchema = yup.InferType<typeof schema>;