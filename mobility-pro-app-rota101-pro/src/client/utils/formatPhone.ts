import I18n from "i18n-js";

export const formatPhone = (value, applyMask = true) => {
    const locale = I18n.locale;
    const removeMask = (phone) => phone.replace(/\D/g, '');
    const applyMaskBR = (phone) => {
        phone = phone.replace(/\D/g, '');
        
        if (phone.length > 11) {
            phone = phone.slice(0, 11);
        }

        phone = phone.replace(/(\d{2})(\d)/, "($1) $2");
        phone = phone.replace(/(\d)(\d{4})$/, "$1-$2");
        return phone;
    };
    
    if (locale !== 'pt_BR') {
        return removeMask(value);
    }

    return applyMask ? applyMaskBR(value) : removeMask(value);
};
