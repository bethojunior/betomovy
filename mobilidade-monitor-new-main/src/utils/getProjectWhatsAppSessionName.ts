export const getProjectWhatsAppSessionName = (): string => {
  const fromAlias = import.meta.env.PROJECT_NAME_ALIAS;
  if (fromAlias != null && String(fromAlias).trim() !== "") {
    return String(fromAlias).trim();
  }
  const fromProject = import.meta.env.PROJECT_NAME;
  if (fromProject != null && String(fromProject).trim() !== "") {
    return String(fromProject).trim();
  }
  return "monitor_without_session";
};
