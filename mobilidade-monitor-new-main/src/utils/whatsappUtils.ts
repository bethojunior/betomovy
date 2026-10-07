/**
 * Utilitários para formatação e manipulação de telefones para WhatsApp
 */

/**
 * Formata um número de telefone removendo todos os caracteres não numéricos
 * @param phone - Número de telefone a ser formatado
 * @returns String contendo apenas números, ou string vazia se o telefone for inválido
 * 
 * @example
 * formatPhoneForWhatsApp("(85) 99999-9999") // "85999999999"
 * formatPhoneForWhatsApp("85 99999-9999") // "85999999999"
 * formatPhoneForWhatsApp(undefined) // ""
 */
export const formatPhoneForWhatsApp = (phone: string | undefined | null): string => {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
};

/**
 * Gera a URL do WhatsApp com o número formatado e mensagem opcional
 * @param phone - Número de telefone (pode conter formatação)
 * @param message - Mensagem opcional a ser enviada
 * @param countryCode - Código do país (padrão: "55" para Brasil)
 * @returns URL formatada para WhatsApp ou string vazia se o telefone for inválido
 * 
 * @example
 * generateWhatsAppUrl("85999999999", "Olá!") 
 * // "https://wa.me/5585999999999?text=Ol%C3%A1%21"
 * generateWhatsAppUrl("(85) 99999-9999") 
 * // "https://wa.me/5585999999999"
 */
export const generateWhatsAppUrl = (
  phone: string | undefined | null,
  message?: string,
  countryCode: string = "55"
): string => {
  const cleanPhone = formatPhoneForWhatsApp(phone);
  if (!cleanPhone) return "";

  let whatsappUrl = `https://wa.me/${countryCode}${cleanPhone}`;

  if (message) {
    const encodedMessage = encodeURIComponent(message);
    whatsappUrl += `?text=${encodedMessage}`;
  }

  return whatsappUrl;
};

/**
 * Abre o WhatsApp em uma nova aba/janela
 * @param phone - Número de telefone (pode conter formatação)
 * @param message - Mensagem opcional a ser enviada
 * @param countryCode - Código do país (padrão: "55" para Brasil)
 * @returns true se o WhatsApp foi aberto, false caso contrário
 */
export const openWhatsApp = (
  phone: string | undefined | null,
  message?: string,
  countryCode: string = "55"
): boolean => {
  const url = generateWhatsAppUrl(phone, message, countryCode);
  if (!url) return false;

  window.open(url, "_blank", "noopener,noreferrer");
  return true;
};

/**
 * Valida se um número de telefone tem o formato válido para WhatsApp brasileiro
 * @param phone - Número de telefone a ser validado
 * @returns true se o telefone é válido (10 ou 11 dígitos), false caso contrário
 * 
 * @example
 * isValidBrazilianPhone("85999999999") // true
 * isValidBrazilianPhone("8599999999") // true
 * isValidBrazilianPhone("859999999") // false
 */
export const isValidBrazilianPhone = (phone: string | undefined | null): boolean => {
  const cleanPhone = formatPhoneForWhatsApp(phone);
  // Telefone brasileiro deve ter 10 ou 11 dígitos (com ou sem DDD + 9 dígitos)
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

