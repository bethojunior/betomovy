export const sanitizeWhatsappSessionHtmlForAdmin = (html: string): string => {
  let h = html;
  h = h.replace(/<div class="session-name"[^>]*>[\s\S]*?<\/div>/gi, "");
  h = h.replace(/<button[^>]*class="remove-button"[^>]*>[\s\S]*?<\/button>/gi, "");
  h = h.replace(/Status:\s*Sessão já existe e conectada/gi, "WhatsApp ligado.");
  h = h.replace(/Status:\s*/gi, "");
  return h;
};
