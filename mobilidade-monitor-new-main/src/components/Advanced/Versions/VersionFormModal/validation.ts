import { CheckFormatVersionApp } from "../../../../utils/Helpers";
import { VersionsProps } from "../../../../pages/Advanced/Versions/types";
import { VersionFormValues } from "./types";

export const validateVersionForm = (
  values: VersionFormValues,
  listVersions: VersionsProps[],
  excludeId?: number
): string | null => {
  const { idApp, platform, linkApp, versionApp } = values;

  if (!idApp || !platform || linkApp.trim().length === 0 || versionApp.trim().length === 0) {
    return "Preencha os campos!";
  }

  if (!CheckFormatVersionApp(versionApp)) {
    return "Formato de versão inválida!";
  }

  const isDuplicate = listVersions.some(
    (data) =>
      data.id !== excludeId &&
      String(data.version.trim()) === String(versionApp.trim()) &&
      data.appId === Number(idApp) &&
      data.platform.toLowerCase() === platform.toLowerCase()
  );

  if (isDuplicate) {
    return "Esta versão já está cadastrada!";
  }

  return null;
};
