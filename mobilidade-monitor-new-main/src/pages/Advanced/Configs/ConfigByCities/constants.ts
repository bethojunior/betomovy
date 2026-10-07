export const WHATSAPP_ZAFIRA_TEMPLATE_ATTRIBUTES = [
  "whatsapp_zafira_validated_driver_message",
  "whatsapp_zafira_validated_client_message",
] as const;

export type WhatsAppZafiraTemplateAttribute =
  (typeof WHATSAPP_ZAFIRA_TEMPLATE_ATTRIBUTES)[number];

export const isWhatsAppZafiraTemplateAttribute = (
  attribute: string
): attribute is WhatsAppZafiraTemplateAttribute =>
  WHATSAPP_ZAFIRA_TEMPLATE_ATTRIBUTES.includes(
    attribute as WhatsAppZafiraTemplateAttribute
  );
