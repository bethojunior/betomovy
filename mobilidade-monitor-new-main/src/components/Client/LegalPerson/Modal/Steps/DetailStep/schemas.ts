import * as yup from 'yup';

export const SchemaFormDetailsStep = yup.object({
    financialEmail: yup.string().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email inválido").required("Campo obrigatório"),
    siteCompany: yup.string(),
    goalOfTrip: yup.string().required("Campo obrigatório"),
    phoneCompany: yup.string().required("Campo obrigatório"),
    numberRegister: yup.string().required("Campo obrigatório"),
    dayPayment: yup.string().required("Campo obrigatório"),
    limitVoucher: yup.string().required("Campo obrigatório"),
    instagram: yup.string(),
    facebook: yup.string(),
}).required();