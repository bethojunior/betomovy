import { AiOutlineAndroid, AiOutlineApple, AiFillRobot } from "react-icons/ai";

import {
  MONITOR_DRIVER,
  MONITOR_CLIENT,
  MONITOR_DELIVERY,
  MONITOR_MOBILITY,
} from "../../../constants/monitorApps";
import {
  VersionsProps,
  ListVersionsAppProps,
  ListVersionsAppFormatedProps,
  ReturnVersionsCurrentAppsProps,
  DataDefaultPieChartProps,
  MessageAlertProps,
  PlatformTagProps,
} from "./types";

export const compareVersions = (
  version1: ListVersionsAppFormatedProps,
  version2: ListVersionsAppFormatedProps
) => {
  const maxLength = Math.max(version1.versions.length, version2.versions.length);

  for (let i = 0; i < maxLength; i++) {
    const v1 = version1.versions[i] ?? 0;
    const v2 = version2.versions[i] ?? 0;

    if (v1 < v2) {
      return -1;
    } else if (v1 > v2) {
      return 1;
    }
  }
  return 0;
};

const formatObjectAppVersions = (
  listVersionsApp: ListVersionsAppFormatedProps[]
) => {
  listVersionsApp.sort((a, b) => compareVersions(b, a));

  const latestVersionStringMobilityPro =
    listVersionsApp.length > 0
      ? {
          appType: listVersionsApp[0].appType,
          versions: listVersionsApp[0].versions.join("."),
        }
      : null;

  const secondLatestVersionStringMobilityPro =
    listVersionsApp.length > 1
      ? {
          appType: listVersionsApp[1].appType,
          versions: listVersionsApp[1].versions.join("."),
        }
      : null;

  return {
    current_version_latest: latestVersionStringMobilityPro,
    second_version_latest: secondLatestVersionStringMobilityPro,
  };
};

export const findVersionsLatestsApps = (
  versions: ListVersionsAppProps[]
): ReturnVersionsCurrentAppsProps | null => {
  if (versions.length === 0) {
    return null;
  }

  const versionArrays = versions.map((version) => ({
    appType: version.appType,
    versions: version.versions.split(".").map(Number),
  }));

  const appVersionsDriver = versionArrays.filter(
    (data) => data.appType === MONITOR_DRIVER
  );

  const appVersionsClientFinal = versionArrays.filter(
    (data) => data.appType === MONITOR_CLIENT
  );

  const appVersionsDelivery = versionArrays.filter(
    (data) => data.appType === MONITOR_DELIVERY
  );

  const appsVersionsMobilityPro = versionArrays.filter(
    (data) => data.appType === MONITOR_MOBILITY
  );

  const driverVersions = formatObjectAppVersions(appVersionsDriver);
  const clientFinalVersions = formatObjectAppVersions(appVersionsClientFinal);
  const deliveryVersions = formatObjectAppVersions(appVersionsDelivery);
  const mobilityProVersions = formatObjectAppVersions(appsVersionsMobilityPro);

  return {
    client_final: {
      current_version_latest: clientFinalVersions.current_version_latest,
      second_version_latest: clientFinalVersions.second_version_latest,
    },
    driver: {
      current_version_latest: driverVersions.current_version_latest,
      second_version_latest: driverVersions.second_version_latest,
    },
    delivery: {
      current_version_latest: deliveryVersions.current_version_latest,
      second_version_latest: deliveryVersions.second_version_latest,
    },
    mobility_pro: {
      current_version_latest: mobilityProVersions.current_version_latest,
      second_version_latest: mobilityProVersions.second_version_latest,
    },
  };
};

export const filterVersions = (
  listVersions: VersionsProps[],
  statusId: number,
  appId: number
): DataDefaultPieChartProps[] => {
  return listVersions
    .filter((data) => data.statusId === statusId && data.appId === appId)
    .map((value) => ({
      id: value.id,
      label: value.version,
      value: 1,
    }));
};

export const switchOptionsTag = (namePlatform: string): PlatformTagProps => {
  switch (namePlatform) {
    case "android":
      return {
        color: "green",
        icon: <AiOutlineAndroid />,
      };
    case "ios":
      return {
        color: "magenta",
        icon: <AiOutlineApple />,
      };
    default:
      return {
        color: "processing",
        icon: <AiFillRobot />,
      };
  }
};

export const switchMessageAlert = (
  qntVersionsActives: number
): MessageAlertProps | undefined => {
  if (qntVersionsActives === 1) {
    return {
      message:
        "Tudo Ok! Mas fique atento a quantidade de versões ativas do seu aplicativo.",
      color: "green",
    };
  }

  if (qntVersionsActives > 1 && qntVersionsActives <= 10) {
    return {
      message:
        "Recomendação: Existe mais de uma versão ativa, recomenda-se deixar uma apenas uma versão estável ativa.",
      color: "orange",
    };
  }

  if (qntVersionsActives > 10) {
    return {
      message:
        "Recomendação: Existe mais de 10 versões ativas, muitos apps podem não estar com recursos ou ajustes críticos, com isso possíveis falhas podem ocorrer no uso do mesmo. Você deve filtrar e deixar apenas as versões estáveis, preferencialmente apenas uma.",
      color: "red",
    };
  }

  return undefined;
};
